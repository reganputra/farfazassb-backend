import prisma from "../config/db.js";

class CoachControllers {

    async getAllCoaches(req, res) {
        try {
            const coaches = await prisma.coach.findMany();
            return res.status(200).json(coaches);
        } catch (error) {
            console.error('Error fetching coaches:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }

    async getCoachesById(req, res) {
        try {
            const { id } = req.params;
            const coach = await prisma.coach.findUnique({
                where: { id: parseInt(id) }
            });

            if (!coach) {
                return res.status(404).json({ message: 'Coach not found' });
            }

            return res.status(200).json(coach);
        } catch (error) {
            console.error('Error fetching coach:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }

    async createCoach(req, res) {
        try {
            const { name } = req.body;

            const coach = await prisma.coach.create({
                data: {
                    name
                }
            });

            return res.status(201).json(coach);
        } catch (error) {
            console.error('Error creating coach:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }

    async updateCoach (req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const coach = await prisma.coach.update({
                where: { id: parseInt(id) },
                data: {
                    name
                }
            });

            return res.status(200).json(coach);
        } catch (error) {
            console.error('Error updating coach:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }

    async deleteCoach (req, res) {
        try {
            const { id } = req.params;

            await prisma.coach.delete({
                where: { id: parseInt(id) }
            });

            return res.status(200).json({ message: 'Coach deleted successfully' });
        } catch (error) {
            console.error('Error deleting coach:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }
}

export default new CoachControllers();