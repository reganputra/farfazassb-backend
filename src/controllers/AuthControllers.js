import jwt from 'jsonwebtoken';
import prisma from "../config/db.js";
import dotenv from "dotenv";
import { hashPassword, comparePassword } from "../utils/passwordUtil.js";

dotenv.config();

class AuthControllers {

    async register(req, res) {
        try {
            const { email, password, childrenIds = [] } = req.body;

            const userExists = await prisma.user.findUnique({ where: { email } });
            if (userExists) {
                return res.status(400).json({ message: 'Email sudah terdaftar' });
            }

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

            const token = jwt.sign(
                { userId: user.id, name: user.name, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            return res.status(201).json({
                message: 'Pendaftaran berhasil',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Terjadi kesalahan saat mendaftar:', error);
            return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(400).json({ message: 'Email atau kata sandi salah' });
            }

            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Email atau kata sandi salah' });
            }

            const token = jwt.sign(
                { userId: user.id, name: user.name, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            return res.status(200).json({
                message: 'Login berhasil',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Terjadi kesalahan saat login:', error);
            return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }
    }
}

export default new AuthControllers();
