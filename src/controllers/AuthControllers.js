import jwt from 'jsonwebtoken';
import prisma from "../config/db.js";
import dotenv from "dotenv";
import {hashPassword, comparePassword} from "../utils/passwordUtil.js";

dotenv.config();

class AuthControllers {

    async register(req, res) {
        try {
            const { email, password, childrenIds = [] } = req.body;

            // Check if user already exists
            const userExists = await prisma.user.findUnique({ where: { email } });
            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create new user with hashed password
            const hashedPassword = await hashPassword(password);
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: 'USER',
                    parentOf: {
                        connect: childrenIds.map(id => ({ id: parseInt(id) }))
                    }
                }
            });

            // Generate JWT token
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            return res.status(201).json({
                message: 'User registered successfully',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            });
        }catch (error) {
            
        }
    }

    async login(req, res) {
        try{
            const { email, password } = req.body;

            // Find user by email
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Compare passwords
            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            return res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            });
        }catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

}

export default new AuthControllers();