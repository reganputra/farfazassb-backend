import prisma from "../config/db.js";

class GradeControllers {

    async getGradesByStudentId (req, res) {
        try {
            const { studentId } = req.params;

            const grades = await prisma.grade.findMany({
                where: { studentId: parseInt(studentId) },
                include: {
                    student: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });

            return res.status(200).json(grades);
        } catch (error) {
            console.error('Error fetching grades:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }

    async getGradeById (req, res) {
        try {
            const { id } = req.params;

            const grade = await prisma.grade.findUnique({
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

            if (!grade) {
                return res.status(404).json({ message: 'Grade not found' });
            }

            return res.status(200).json(grade);
        } catch (error) {
            console.error('Error fetching grade:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }

    async addGrade (req,res) {
        try {
            const { subject, score, studentId } = req.body;

            const grade = await prisma.grade.create({
                data: {
                    subject,
                    score: parseFloat(score),
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

            return res.status(201).json(grade);
        } catch (error) {
            console.error('Error creating grade:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }

    async updateGrade (req, res) {
        try {
            const { id } = req.params;
            const { subject, score } = req.body;

            const grade = await prisma.grade.update({
                where: { id: parseInt(id) },
                data: {
                    subject,
                    score: parseFloat(score)
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

            return res.status(200).json(grade);
        } catch (error) {
            console.error('Error updating grade:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }

    async deleteGrade (req,res) {
        try {
            const { id } = req.params;

            await prisma.grade.delete({
                where: { id: parseInt(id) }
            });

            return res.status(200).json({ message: 'Grade deleted successfully' });
        } catch (error) {
            console.error('Error deleting grade:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }
}

export default new GradeControllers();