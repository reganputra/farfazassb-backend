import prisma from "../config/db.js";

class AttendanceControllers {

    async getAttendanceByStudentId (req, res) {
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
            console.error('Error fetching attendance records:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }

    async getAttendanceById (req, res) {
        try {
            const { id } = req.params;

            const attendance = await prisma.attendance.findUnique({
                where: { id: parseInt(id) },
                include: {
                    student: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });

            if (!attendance) {
                return res.status(404).json({ message: 'Attendance record not found' });
            }

            return res.status(200).json(attendance);
        } catch (error) {
            console.error('Error fetching attendance record:', error);
            return res.status(500).json({ message: 'Server error' });
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
                            name: true
                        }
                    }
                }
            });

            return res.status(201).json(attendance);
        } catch (error) {
            console.error('Error creating attendance record:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }

    async updateAttendance (req, res) {

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
                            name: true
                        }
                    }
                }
            });

            return res.status(200).json(attendance);
        } catch (error) {
            console.error('Error updating attendance record:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }

    async deleteAttendance (req, res) {
        try {
            const { id } = req.params;

            await prisma.attendance.delete({
                where: { id: parseInt(id) }
            });

            return res.status(200).json({ message: 'Attendance record deleted successfully' });
        } catch (error) {
            console.error('Error deleting attendance record:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }

}

export default new AttendanceControllers();