import prisma from "../config/db.js";
import { hashPassword } from "../utils/passwordUtil.js";

class CoachControllers {
  async getAllCoaches(req, res) {
    try {
      const coaches = await prisma.user.findMany({
        where: {
          role: "COACH",
        },
        select: {
          id: true,
          name: true,
          email: true,
          telp: true,
          gender: true,
          photoUrl: true,
        },
      });
      return res.status(200).json(coaches);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data pelatih:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async getCoachesById(req, res) {
    try {
      const { id } = req.params;
      const coach = await prisma.user.findUnique({
        where: {
          id: parseInt(id),
          AND: {
            role: "COACH",
          },
        },
      });

      if (!coach) {
        return res.status(404).json({ message: "Pelatih tidak ditemukan" });
      }

      return res.status(200).json(coach);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data pelatih:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async createCoach(req, res) {
    try {
      const { name, email, telp, gender, password } = req.body;
      const photoUrl = req.file?.location;

      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res.status(400).json({ message: "Pelatih sudah terdaftar" });
      }

      const coach = await prisma.user.create({
        data: {
          name,
          email,
          telp,
          gender,
          password: await hashPassword(password),
          role: "COACH",
          photoUrl,
        },
      });

      return res.status(201).json(coach);
    } catch (error) {
      console.error("Terjadi kesalahan saat membuat pelatih:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async updateCoach(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password, telp, gender } = req.body;
      const photoUrl = req.file?.location;

      const dataToUpdate = {
        name,
        email,
        telp,
        gender,
      };

      if (photoUrl) {
        dataToUpdate.photoUrl = photoUrl;
      }

      if (password) {
        dataToUpdate.password = password;
      }

      const coach = await prisma.user.update({
        where: { id: parseInt(id) },
        data: dataToUpdate,
      });

      return res.status(200).json(coach);
    } catch (error) {
      console.error("Terjadi kesalahan saat memperbarui data pelatih:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async deleteCoach(req, res) {
    try {
      const { id } = req.params;

      await prisma.user.delete({
        where: {
          id: parseInt(id),
          AND: {
            role: "COACH",
          },
        },
      });

      return res.status(200).json({ message: "Pelatih berhasil dihapus" });
    } catch (error) {
      console.error("Terjadi kesalahan saat menghapus data pelatih:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }
}

export default new CoachControllers();
