import prisma from "../config/db.js";


class StudentControllers {

    // Guest access
    async getAllStudentsPublic (req, res) {
        try {
            const students = await prisma.student.findMany({
                select: {
                    id: true,
                    name: true
                }
            });
            return res.status(200).json(students);
        }catch (error){
            console.error('Error fetching students:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    // Admin access
    async getAllStudents (req, res) {
        try{
            const students = await prisma.student.findMany({
                include: {
                    grades: true,
                    attendance: true,
                    parents: {
                        select: {
                            id: true,
                            email: true
                        }
                    }
                }
            });
            return res.status(200).json(students);
        }catch (error){
            console.error('Error fetching students:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async getStudentById(req, res) {
        try {
            const { id } = req.params;
            const student = await prisma.student.findUnique({
                where: { id: parseInt(id) },
                include: {
                    grades: true,
                    attendance: true,
                    parents: {
                        select: {
                            id: true,
                            email: true
                        }
                    }
                }
            });

            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }

            return res.status(200).json(student);
        } catch (error) {
            console.error('Error fetching student:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async createStudent(req, res) {
        try {
            const { name, parentIds = [] } = req.body;
            const data = { name };

            if (parentIds.length > 0) {
                data.parents = {
                    connect: parentIds.map(id => ({ id: parseInt(id) }))
                };
            }

            const student = await prisma.student.create({
                data,
                include: {
                    parents: {
                        select: {
                            id: true,
                            email: true
                        }
                    }
                }
            });

            return res.status(201).json(student);
        } catch (error) {
            console.error('Error creating student:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async updateStudent(req, res) {
        try {
            const { id } = req.params;
            const { name, parentIds } = req.body;

            // Prepare update data
            let updateData = {};
            if (name) updateData.name = name;

            // Handle parent relationships in a single operation
            if (Array.isArray(parentIds)) {
                if (parentIds.length > 0) {
                    updateData.parents = {
                        set: parentIds.map(id => ({ id: parseInt(id) }))
                    };
                } else {
                    updateData.parents = {
                        set: [] // Hapus semua relasi orang tua jika kosong
                    };
                }
            }

            // Update student and return the updated student in a single query
            const updatedStudent = await prisma.student.update({
                where: { id: parseInt(id) },
                data: updateData,
                include: {
                    parents: {
                        select: {
                            id: true,
                            email: true
                        }
                    }
                }
            });

            return res.status(200).json(updatedStudent);
        } catch (error) {
            console.error('Error updating student:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async deleteStudent(req, res) {
        try {
            const { id } = req.params;

            await prisma.$transaction([
                prisma.grade.deleteMany({ where: { studentId: parseInt(id) } }),
                prisma.attendance.deleteMany({ where: { studentId: parseInt(id) } }),
                prisma.student.delete({ where: { id: parseInt(id) } })
            ]);

            return res.status(200).json({ message: 'Student deleted successfully' });
        } catch (error) {
            console.error('Error deleting student:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

}

export default new StudentControllers()