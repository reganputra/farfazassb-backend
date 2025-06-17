import prisma from "../config/db.js";

class AttendanceControllers {

    async getAttendanceByStudentId(req, res) {
        try {
            const { studentId } = req.params;

            const attendance = await prisma.attendance.findMany({
                where: { studentId: parseInt(studentId) },
                include: {
                    student: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    date: 'desc'
                }
            });

            return res.status(200).json(attendance);
        } catch (error) {
            console.error('Terjadi kesalahan saat mengambil data kehadiran:', error);
            return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }
    }

    async getAttendanceByDate(req, res) {
        try {
            const { date } = req.params;

            const attendance = await prisma.attendance.findMany({
                where: { date: new Date(date) },
                include: {
                    student: {
                        select: {
                            id: true,
                            name: true,
                            gender: true,
                            coachId: true,
                            level: true
                        }
                    }
                }
            });

            if (!attendance) {
                return res.status(404).json({ message: 'Data kehadiran tidak ditemukan' });
            }

            return res.status(200).json(attendance);
        } catch (error) {
            console.error('Terjadi kesalahan saat mengambil data kehadiran:', error);
            return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }
    }

    async getAttendanceById(req, res) {
        try {
            const { id } = req.params;

            const attendance = await prisma.attendance.findUnique({
                where: { id: parseInt(id) },
                include: {
                    student: {
                        select: {
                            id: true,
                            name: true,
                            coachId: true,
                            level: true
                        }
                    }
                }
            });

            if (!attendance) {
                return res.status(404).json({ message: 'Data kehadiran tidak ditemukan' });
            }

            return res.status(200).json(attendance);
        } catch (error) {
            console.error('Terjadi kesalahan saat mengambil data kehadiran:', error);
            return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }
    }

    async createAttendance(req, res) {
        try {
            const { date, present, studentId } = req.body;

            const attendance = await prisma.attendance.create({
                data: {
                    date: new Date(date),
                    present: Boolean(present),
                    studentId: parseInt(studentId)
                },
                include: {
                    student: {
                        select: {
                            id: true,
                            name: true,
                            gender: true,
                            coachId: true,
                            level: true
                        }
                    }
                }
            });

            return res.status(201).json(attendance);
        } catch (error) {
            console.error('Terjadi kesalahan saat membuat data kehadiran:', error);
            return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }
    }

    async updateAttendance(req, res) {
        try {
            const { id } = req.params;
            const { date, present } = req.body;

            const attendance = await prisma.attendance.update({
                where: { id: parseInt(id) },
                data: {
                    date: date ? new Date(date) : undefined,
                    present: present !== undefined ? Boolean(present) : undefined
                },
                include: {
                    student: {
                        select: {
                            id: true,
                            name: true,
                            gender: true,
                            coachId: true
                        }
                    }
                }
            });

            return res.status(200).json(attendance);
        } catch (error) {
            console.error('Terjadi kesalahan saat memperbarui data kehadiran:', error);
            return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }
    }

    async deleteAttendance(req, res) {
        try {
            const { id } = req.params;

            await prisma.attendance.delete({
                where: { id: parseInt(id) }
            });

            return res.status(200).json({ message: 'Data kehadiran berhasil dihapus' });
        } catch (error) {
            console.error('Terjadi kesalahan saat menghapus data kehadiran:', error);
            return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }
    }
}

export default new AttendanceControllers();
