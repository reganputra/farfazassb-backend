import prisma from "../config/db.js";

class StudentControllers {
  // Akses publik
  async getAllStudentsPublic(req, res) {
    try {
      const students = await prisma.student.findMany({
        select: {
          id: true,
          name: true,
          photoUrl: true,
        },
      });
      return res.status(200).json(students);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data siswa:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async getAllStudentsByCoach(req, res) {
    const { coachId } = req.params;

    try {
      const students = await prisma.student.findMany({
        where: {
          coachId: parseInt(coachId),
        },
      });

      return res.status(200).json(students);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data siswa:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  // Akses admin
  async getAllStudents(req, res) {
    try {
      const students = await prisma.student.findMany({
        include: {
          grades: true,
          attendance: true,
          parent: {
            select: {
              id: true,
              email: true,
            },
          },
          coach: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });
      return res.status(200).json(students);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data siswa:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
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
          parent: {
            select: {
              id: true,
              email: true,
            },
          },
          coach: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      if (!student) {
        return res.status(404).json({ message: "Siswa tidak ditemukan" });
      }

      return res.status(200).json(student);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data siswa:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async createStudent(req, res) {
    try {
      const {
        name,
        parentId,
        coachId,
        age,
        gender,
        level,
        tanggalLahir,
        tempatLahir,
        kategoriBMI,
      } = req.body;

      const files = req.files;

      const data = {
        name,
        photoUrl: files?.photo?.[0]?.location,
        kk: files?.kk?.[0]?.location,
        koperasi: files?.koperasi?.[0]?.location,
        akta: files?.akta?.[0]?.location,
        bpjs: files?.bpjs?.[0]?.location,
        age: parseInt(age),
        gender,
        level,
        tanggalLahir: new Date(tanggalLahir),
        tempatLahir,
        kategoriBMI,
      };

      if (parentId) {
        data.parent = {
          connect: { id: parseInt(parentId) },
        };
      }

      if (coachId) {
        data.coach = {
          connect: { id: parseInt(coachId) },
        };
      }

      const student = await prisma.student.create({
        data,
        include: {
          parent: {
            select: { id: true, email: true },
          },
          coach: {
            select: { id: true, email: true },
          },
        },
      });

      return res.status(201).json(student);
    } catch (error) {
      console.error("Terjadi kesalahan saat membuat data siswa:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async updateStudent(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        parentId,
        coachId,
        age,
        gender,
        level,
        tanggalLahir,
        tempatLahir,
        kategoriBMI,
      } = req.body;

      const files = req.files;

      const data = {
        ...(name && { name }),
        ...(files?.photo?.[0]?.location && { photoUrl: files.photo[0].location }),
        ...(files?.kk?.[0]?.location && { kk: files.kk[0].location }),
        ...(files?.koperasi?.[0]?.location && { koperasi: files.koperasi[0].location }),
        ...(files?.akta?.[0]?.location && { akta: files.akta[0].location }),
        ...(files?.bpjs?.[0]?.location && { bpjs: files.bpjs[0].location }),
        ...(age && { age: parseInt(age) }),
        ...(gender && { gender }),
        ...(level && { level }),
        ...(tanggalLahir && { tanggalLahir: new Date(tanggalLahir) }),
        ...(tempatLahir && { tempatLahir }),
        ...(kategoriBMI && { kategoriBMI }),
      };

      if (parentId) {
        data.parent = {
          connect: { id: parseInt(parentId) },
        };
      }

      if (coachId) {
        data.coach = {
          connect: { id: parseInt(coachId) },
        };
      }

      const student = await prisma.student.update({
        where: { id: parseInt(id) },
        data,
        include: {
          parent: { select: { id: true, email: true } },
          coach: { select: { id: true, email: true } },
        },
      });

      return res.status(200).json(student);
    } catch (error) {
      console.error("Terjadi kesalahan saat memperbarui data siswa:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async deleteStudent(req, res) {
    try {
      const { id } = req.params;

      await prisma.$transaction([
        prisma.grade.deleteMany({ where: { studentId: parseInt(id) } }),
        prisma.attendance.deleteMany({ where: { studentId: parseInt(id) } }),
        prisma.student.delete({ where: { id: parseInt(id) } }),
      ]);

      return res.status(200).json({ message: "Siswa berhasil dihapus" });
    } catch (error) {
      console.error("Terjadi kesalahan saat menghapus data siswa:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }
}

export default new StudentControllers();
