import prisma from "../config/db.js";

class AchievementControllers {
  async getAllAchievements(req, res) {
    try {
      const achievements = await prisma.achievement.findMany({
        include: {
          student: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return res.status(200).json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  async getAchievementById(req, res) {
    try {
      const { id } = req.params;
      const achievement = await prisma.achievement.findUnique({
        where: { id: parseInt(id) },
        include: {
          student: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!achievement) {
        return res.status(404).json({ message: "Achievement not found" });
      }

      return res.status(200).json(achievement);
    } catch (error) {
      console.error("Error fetching achievement:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  async createAchievement(req, res) {
    try {
      const { title, date, desc, level, place,event, studentId } = req.body;

      const achievement = await prisma.achievement.create({
        data: {
          title,
          date: new Date(date),
          desc,
          level,
          event,
          place: parseInt(place),
          studentId: studentId ? parseInt(studentId) : null,
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return res.status(201).json(achievement);
    } catch (error) {
      console.error("Error creating achievement:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  async updateAchievement(req, res) {
    try {
      const { id } = req.params;
      const { title, date, desc, level,event, place, studentId } = req.body;

      const achievement = await prisma.achievement.update({
        where: { id: parseInt(id) },
        data: {
          title,
          date: new Date(date),
          desc,
          level,
          event,
          place: parseInt(place),
          studentId: studentId ? parseInt(studentId) : null,
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return res.status(200).json(achievement);
    } catch (error) {
      console.error("Error updating achievement:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  async deleteAchievement(req, res) {
    try {
      const { id } = req.params;

      await prisma.achievement.delete({
        where: { id: parseInt(id) },
      });

      return res
        .status(200)
        .json({ message: "Achievement deleted successfully" });
    } catch (error) {
      console.error("Error deleting achievement:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
}

export default new AchievementControllers();
