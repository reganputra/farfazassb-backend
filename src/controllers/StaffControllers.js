import prisma from "../config/db.js";

class StaffControllers {

    async getAllStaff(req, res) {
        try {
            const staff = await prisma.staff.findMany();
            return res.status(200).json(staff);
        } catch (error) {
            console.error('Error fetching staff:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async getStaffById(req, res) {
        try {
            const { id } = req.params;
            const staff = await prisma.staff.findUnique({
                where: { id: parseInt(id) }
            });

            if (!staff) {
                return res.status(404).json({ message: 'Staff member not found' });
            }

            return res.status(200).json(staff);
        } catch (error) {
            console.error('Error fetching staff member:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async createStaff(req, res) {
        try {
            const { name, role } = req.body;

            const staff = await prisma.staff.create({
                data: {
                    name,
                    role
                }
            });

            return res.status(201).json(staff);
        } catch (error) {
            console.error('Error creating staff member:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async updateStaff(req, res) {
        try {
            const { id } = req.params;
            const { name, role } = req.body;

            const staff = await prisma.staff.update({
                where: { id: parseInt(id) },
                data: {
                    name,
                    role
                }
            });

            return res.status(200).json(staff);
        } catch (error) {
            console.error('Error updating staff member:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async deleteStaff(req, res) {
        try {
            const { id } = req.params;

            await prisma.staff.delete({
                where: { id: parseInt(id) }
            });

            return res.status(200).json({ message: 'Staff member deleted successfully' });
        } catch (error) {
            console.error('Error deleting staff member:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
}

export default new StaffControllers();