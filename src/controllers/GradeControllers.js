import prisma from "../config/db.js";

class GradeControllers {

    async getGradesByStudentId(req, res) {
        try {
            const { studentId } = req.params;

            const grades = await prisma.grade.findMany({
                where: { studentId: parseInt(studentId) },
                include: {
                    student: { select: { id: true, name: true } },
                    coach: { select: { id: true, name: true } }
                }
            });

            return res.status(200).json(grades);
        } catch (error) {
            console.error('Error fetching grades:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async getGradeById(req, res) {
        try {
            const { id } = req.params;

            const grade = await prisma.grade.findUnique({
                where: { id: parseInt(id) },
                include: {
                    student: { select: { id: true, name: true } },
                    coach: { select: { id: true, name: true } }
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

    async addGrade(req, res) {
        try {
            const {
                studentId,
                coachId,
                date,
                tinggiBadan, beratBadan, bmi, kategoriBMI, tinggiDuduk, panjangTungkai, rentangLengan,
                denyutNadiIstirahat, saturasiOksigen,
                standingBoardJump, kecepatan, dayaTahan,
                controllingKanan, controllingKiri, dribbling,
                longpassKanan, longpassKiri, shortpassKanan, shortpassKiri,
                shootingKanan, shootingKiri,
                disiplin, komitmen, percayaDiri,
                injuryDetail, comment
            } = req.body;

            const grade = await prisma.grade.create({
                data: {
                    date: new Date(date),
                    student: { connect: { id: parseInt(studentId) } },
                    coach: { connect: { id: parseInt(coachId) } },

                    tinggiBadan: parseFloat(tinggiBadan),
                    beratBadan: parseFloat(beratBadan),
                    bmi: parseFloat(bmi),
                    kategoriBMI,

                    tinggiDuduk: parseFloat(tinggiDuduk),
                    panjangTungkai: parseFloat(panjangTungkai),
                    rentangLengan: parseFloat(rentangLengan),

                    denyutNadiIstirahat: parseFloat(denyutNadiIstirahat),
                    saturasiOksigen: parseFloat(saturasiOksigen),

                    standingBoardJump: parseFloat(standingBoardJump),
                    kecepatan: parseFloat(kecepatan),
                    dayaTahan: parseFloat(dayaTahan),

                    controllingKanan: parseInt(controllingKanan),
                    controllingKiri: parseInt(controllingKiri),
                    dribbling: parseInt(dribbling),
                    longpassKanan: parseInt(longpassKanan),
                    longpassKiri: parseInt(longpassKiri),
                    shortpassKanan: parseInt(shortpassKanan),
                    shortpassKiri: parseInt(shortpassKiri),
                    shootingKanan: parseInt(shootingKanan),
                    shootingKiri: parseInt(shootingKiri),

                    disiplin: parseInt(disiplin),
                    komitmen: parseInt(komitmen),
                    percayaDiri: parseInt(percayaDiri),

                    injuryDetail,
                    comment
                },
                include: {
                    student: { select: { id: true, name: true } },
                    coach: { select: { id: true, name: true } }
                }
            });

            return res.status(201).json(grade);
        } catch (error) {
            console.error('Error creating grade:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async updateGrade(req, res) {
        try {
            const { id } = req.params;
            const body = req.body;

            const data = {};

            if (body.date) data.date = new Date(body.date);
            if (body.studentId) data.student = { connect: { id: parseInt(body.studentId) } };
            if (body.coachId) data.coach = { connect: { id: parseInt(body.coachId) } };

            const floatFields = [
                "tinggiBadan", "beratBadan", "bmi", "tinggiDuduk", "panjangTungkai", "rentangLengan",
                "denyutNadiIstirahat", "saturasiOksigen",
                "standingBoardJump", "kecepatan", "dayaTahan"
            ];
            const intFields = [
                "controllingKanan", "controllingKiri", "dribbling",
                "longpassKanan", "longpassKiri", "shortpassKanan", "shortpassKiri",
                "shootingKanan", "shootingKiri", "disiplin", "komitmen", "percayaDiri"
            ];

            floatFields.forEach(field => {
                if (body[field] !== undefined) data[field] = parseFloat(body[field]);
            });

            intFields.forEach(field => {
                if (body[field] !== undefined) data[field] = parseInt(body[field]);
            });

            if (body.kategoriBMI) data.kategoriBMI = body.kategoriBMI;
            if (body.injuryDetail !== undefined) data.injuryDetail = body.injuryDetail;
            if (body.comment !== undefined) data.comment = body.comment;

            const grade = await prisma.grade.update({
                where: { id: parseInt(id) },
                data,
                include: {
                    student: { select: { id: true, name: true } },
                    coach: { select: { id: true, name: true } }
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