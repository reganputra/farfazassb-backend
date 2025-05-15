import prisma from "../config/db.js";
import {hashPassword} from "../utils/passwordUtil.js";

class UserControllers {

    async getAllUsers(req, res) {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    role: true,
                    parentOf: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });

            return res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }

    async getUserById (req, res) {
        try {
            const { id } = req.params;

            const user = await prisma.user.findUnique({
                where: { id: parseInt(id) },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    parentOf: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }

    async createUser (req, res) {
        try {
            const { email, password, role, childrenIds = [] } = req.body;

            // Check if user already exists
            const userExists = await prisma.user.findUnique({ where: { email } });
            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create new user with hashed password
            const data = {
                email,
                password: await hashPassword(password),
                role
            };

            if (childrenIds.length > 0) {
                data.parentOf = {
                    connect: childrenIds.map(id => ({ id: parseInt(id) }))
                };
            }

            const user = await prisma.user.create({
                data,
                select: {
                    id: true,
                    email: true,
                    role: true,
                    parentOf: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });

            return res.status(201).json(user);
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }

    async updateUser (req, res) {
        try {
            const { id } = req.params;
            const { email, password, role, childrenIds } = req.body;

            // Prepare update data
            let updateData = {};
            if (email) updateData.email = email;
            if (password) updateData.password = await hashPassword(password);
            if (role) updateData.role = role;

            // Handle children relationships
            if (Array.isArray(childrenIds)) {
                if (childrenIds.length > 0) {
                    updateData.parentOf = {
                        set: childrenIds.map(id => ({ id: parseInt(id) }))
                    };
                } else {
                    updateData.parentOf = {
                        set: [] // delete all children relation if empty
                    };
                }
            }

            // Update user and return the updated user in a single query
            const updatedUser = await prisma.user.update({
                where: { id: parseInt(id) },
                data: updateData,
                select: {
                    id: true,
                    email: true,
                    role: true,
                    parentOf: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });

            return res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }

    async deleteUser (req, res) {
        try {
            const { id } = req.params;

            //  disconnect all relations with students
            await prisma.user.update({
                where: { id: parseInt(id) },
                data: {
                    parentOf: {
                        set: [] // Disconnect all children
                    }
                }
            });

            //  delete the user
            await prisma.user.delete({
                where: { id: parseInt(id) }
            });

            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }

    async getCurrentUserChildren (req, res) {
        try {
            const userId = req.user.id;

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    parentOf: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });

            return res.status(200).json(user.parentOf);
        } catch (error) {
            console.error('Error fetching children:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }

    async getChildDetails (req, res) {
        try {
            const userId = req.user.id;
            const { childId } = req.params;

            // Verify parent-child relationship
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    parentOf: {
                        select: {
                            id: true
                        }
                    }
                }
            });

            const isParent = user.parentOf.some(child => child.id === parseInt(childId));
            if (!isParent) {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Get child details
            const child = await prisma.student.findUnique({
                where: { id: parseInt(childId) },
                include: {
                    grades: true,
                    attendance: {
                        orderBy: {
                            date: 'desc'
                        }
                    }
                }
            });

            if (!child) {
                return res.status(404).json({ message: 'Student not found' });
            }

            return res.status(200).json(child);
        } catch (error) {
            console.error('Error fetching child details:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }
}

export default new UserControllers();