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
      console.error("Error fetching coaches:", error);
      return res.status(500).json({ message: "Server error" });
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
        return res.status(404).json({ message: "Coach not found" });
      }

      return res.status(200).json(coach);
    } catch (error) {
      console.error("Error fetching coach:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  async createCoach(req, res) {
    try {
      const { name, email, telp, gender, password } = req.body;
      const photoUrl = req.file?.location;

      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res.status(400).json({ message: "Coach already exists" });
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
      return res.status(500).json({ message: "Server error" });
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
      console.error("Error updating coach:", error);
      return res.status(500).json({ message: "Server error" });
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

      return res.status(200).json({ message: "Coach deleted successfully" });
    } catch (error) {
      console.error("Error deleting coach:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
}

export default new CoachControllers();
