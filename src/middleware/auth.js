import jwt from 'jsonwebtoken';
import prisma from "../config/db.js";

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Authentication required' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!user) return res.status(401).json({ message: 'User not found' });

        req.user = user;
        next();

    }catch (error){
        return res.status(401).json({ message: 'Invalid token' });
    }
}

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ message: 'Super Admin access required' });
    }
    next();
};

const isCoachAndAdmin = (req, res, next) => {
    if (req.user.role !== 'COACH' && req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ message: 'Coach access required' });
    }
    next();
};

const isAll = (req, res, next) => {
    if (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'COACH' && req.user.role !== 'USER') {
        return res.status(403).json({ message: 'Access required' });
    }
    next();
};

export { authenticate, isAdmin,isCoachAndAdmin, isAll };