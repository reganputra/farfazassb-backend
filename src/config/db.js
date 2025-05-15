import {PrismaClient} from '@prisma/client';
// import { withAccelerate } from '@prisma/extension-accelerate';
import dotenv from 'dotenv';

dotenv.config();

// Check if DATABASE_URL exists through console log
console.log('DATABASE_URL exists:', Boolean(process.env.DATABASE_URL));

const prisma = new PrismaClient();

prisma.$connect()
    .then(() => {
        console.log('Berhasil terhubung ke database');
    })
    .catch((error) => {
        console.error('Gagal terhubung ke database:', error);
        process.exit(1);
    });

export default prisma;