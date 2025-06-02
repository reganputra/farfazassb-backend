import express from 'express';
import AuthController from '../controllers/AuthControllers.js';
import {validateBody} from "../middleware/validateBody.js";
import { hashPassword } from '../utils/passwordUtil.js';
import prisma from '../config/db.js';
import Validate from "../middleware/validation.js";
import { isAdmin, authenticate } from '../middleware/auth.js';


const router = express.Router();

// Auth routes
router.post('/register',validateBody(Validate.registerSchema), AuthController.register);
router.post('/login',validateBody(Validate.loginSchema), AuthController.login);

router.post('/dev-create-coach',authenticate, isAdmin ,async (req, res) => {
    try {
        const { email, password } = req.body;
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ message: 'Email already exists' });

        const hashed = await hashPassword(password);
        const admin = await prisma.user.create({
            data: {
                email,
                password: hashed,
                role: 'COACH'
            }
        });

        res.status(201).json({ message: 'Coach account created', admin });
    } catch (err) {
        console.error('Admin creation error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;