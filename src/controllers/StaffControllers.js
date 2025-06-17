import prisma from "../config/db.js";

class StaffControllers {

    async getAllStaff(req, res) {
        try {
            const staff = await prisma.staff.findMany();
            return res.status(200).json(staff);
        } catch (error) {
            console.error('Terjadi kesalahan saat mengambil data staf:', error);
            return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }
    }

    async getStaffById(req, res) {
        try {
            const { id } = req.params;
            const staff = await prisma.staff.findUnique({
                where: { id: parseInt(id) }
            });

            if (!staff) {
                return res.status(404).json({ message: 'Staf tidak ditemukan' });
            }

            return res.status(200).json(staff);
        } catch (error) {
            console.error('Terjadi kesalahan saat mengambil data staf:', error);
            return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
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
            console.error('Terjadi kesalahan saat membuat data staf:', error);
            return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
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
            console.error('Terjadi kesalahan saat memperbarui data staf:', error);
            return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }
    }

    async deleteStaff(req, res) {
        try {
            const { id } = req.params;

            await prisma.staff.delete({
                where: { id: parseInt(id) }
            });

            return res.status(200).json({ message: 'Staf berhasil dihapus' });
        } catch (error) {
            console.error('Terjadi kesalahan saat menghapus data staf:', error);
            return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }
    }
}

export default new StaffControllers();
