import prisma from "../config/db.js";
import { hashPassword } from "../utils/passwordUtil.js";

class UserControllers {
  async getAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany({
        where: {
          role: "USER",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          telp: true,
          status: true,
          address: true,
          createAt: true,
          parentOf: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return res.status(200).json(users);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data pengguna:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(id),
          AND: {
            role: "USER",
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          telp: true,
          status: true,
          address: true,
          parentOf: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ message: "Pengguna tidak ditemukan" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data pengguna:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async createUser(req, res) {
    try {
      const { name, email, password, role, address, telp } = req.body;

      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res.status(400).json({ message: "Pengguna sudah terdaftar" });
      }

      const data = {
        name,
        email,
        password: await hashPassword(password),
        role,
        address,
        status: true,
        telp,
      };

      const user = await prisma.user.create({
        data,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          address: true,
          status: true,
          telp: true,
        },
      });

      return res.status(201).json(user);
    } catch (error) {
      console.error("Terjadi kesalahan saat membuat pengguna:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { email, password, role, status, childrenIds } = req.body;

      let updateData = {};
      if (email) updateData.email = email;
      if (password) updateData.password = await hashPassword(password);
      if (role) updateData.role = role;
      if (status !== undefined) {
        if (status === "true") updateData.status = true;
        else if (status === "false") updateData.status = false;
        else updateData.status = status;
      }

      if (Array.isArray(childrenIds)) {
        if (childrenIds.length > 0) {
          updateData.parentOf = {
            set: childrenIds.map((id) => ({ id: parseInt(id) })),
          };
        } else {
          updateData.parentOf = {
            set: [],
          };
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: updateData,
        select: {
          id: true,
          email: true,
          role: true,
          parentOf: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Terjadi kesalahan saat memperbarui data pengguna:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          parentOf: {
            set: [],
          },
        },
      });

      await prisma.user.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({ message: "Pengguna berhasil dihapus" });
    } catch (error) {
      console.error("Terjadi kesalahan saat menghapus pengguna:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async getCurrentUserChildren(req, res) {
    try {
      const userId = req.user.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          parentOf: {
            select: {
              id: true,
              name: true,
              gender: true,
              age: true,
              level : true,
              tanggalLahir: true,
              tempatLahir: true,
              kategoriBMI: true,
              photoUrl: true,
            },
          },
        },
      });

      return res.status(200).json(user.parentOf);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data anak:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async getChildDetails(req, res) {
    try {
      const userId = req.user.id;
      const { childId } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          parentOf: {
            select: {
              id: true,
            },
          },
        },
      });

      const isParent = user.parentOf.some(
        (child) => child.id === parseInt(childId)
      );
      if (!isParent) {
        return res.status(403).json({ message: "Akses ditolak" });
      }

      const child = await prisma.student.findUnique({
        where: { id: parseInt(childId) },
        include: {
          grades: true,
          attendance: {
            orderBy: {
              date: "desc",
            },
          },
        },
      });

      if (!child) {
        return res.status(404).json({ message: "Siswa tidak ditemukan" });
      }

      return res.status(200).json(child);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil detail anak:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }
}

export default new UserControllers();
