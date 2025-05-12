import {PrismaClient} from '@prisma/client';

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