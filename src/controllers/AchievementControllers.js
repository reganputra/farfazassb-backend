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
      console.error("Terjadi kesalahan saat mengambil data prestasi:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
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
        return res.status(404).json({ message: "Prestasi tidak ditemukan" });
      }

      return res.status(200).json(achievement);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data prestasi:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async createAchievement(req, res) {
    try {
      const { title, date, desc, level, place, event, studentId } = req.body;

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
      console.error("Terjadi kesalahan saat membuat prestasi:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async updateAchievement(req, res) {
    try {
      const { id } = req.params;
      const { title, date, desc, level, event, place, studentId } = req.body;

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
      console.error("Terjadi kesalahan saat memperbarui prestasi:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
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
        .json({ message: "Prestasi berhasil dihapus" });
    } catch (error) {
      console.error("Terjadi kesalahan saat menghapus prestasi:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }
}

export default new AchievementControllers();
