import prisma from "../config/db.js";

class GradeControllers {
  async createTest(req, res) {
    try {
      const { name, date, coachId } = req.body;

      if (!name || !date || !coachId) {
        return res
          .status(400)
          .json({ message: "Nama, tanggal, dan ID pelatih wajib diisi." });
      }

      const newTest = await prisma.test.create({
        data: {
          name,
          date: new Date(date),
          coach: {
            connect: { id: coachId },
          },
        },
      });

      return res.status(201).json(newTest);
    } catch (error) {
      console.error("Terjadi kesalahan saat membuat tes:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async editTest(req, res) {
    try {
      const { id } = req.params;
      const { name, date, coachId } = req.body;

      const existingTest = await prisma.test.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingTest) {
        return res.status(404).json({ message: "Tes tidak ditemukan" });
      }

      const updateData = {};

      if (name) updateData.name = name;
      if (date) updateData.date = new Date(date);
      if (coachId) updateData.coach = { connect: { id: parseInt(coachId) } };

      if (Object.keys(updateData).length === 0) {
        return res
          .status(400)
          .json({ message: "Tidak ada data yang valid untuk diperbarui." });
      }

      const updatedTest = await prisma.test.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      return res.status(200).json(updatedTest);
    } catch (error) {
      console.error("Terjadi kesalahan saat memperbarui tes:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async getTestsByStudentId(req, res) {
    try {
      const { id } = req.params;

      const tests = await prisma.test.findMany({
        where: {
          grades: {
            some: {
              studentId: parseInt(id),
            },
          },
        },
        orderBy: {
          date: "desc",
        },
        select: {
          id: true,
          name: true,
          date: true,
          coach: {
            select: {
              id: true,
              name: true,
            },
          },
          grades: {
            where: {
              studentId: parseInt(id),
            },
            select: {
              id: true,
              date: true,
              kategoriBMI: true,
              bmi: true,
              disiplin: true,
              komitmen: true,
              percayaDiri: true,
            },
          },
        },
      });

      return res.status(200).json(tests);
    } catch (error) {
      console.error(
        "Terjadi kesalahan saat mengambil tes berdasarkan studentId:",
        error
      );
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async getAllTests(req, res) {
    try {
      const tests = await prisma.test.findMany({
        orderBy: {
          date: "desc",
        },
        select: {
          id: true,
          name: true,
          date: true,
          coach: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          grades: {
            select: {
              id: true,
              date: true,
              student: {
                select: {
                  id: true,
                  name: true,
                  gender: true,
                  age: true,
                },
              },
            },
          },
        },
      });

      return res.status(200).json(tests);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil semua tes:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async getTestGradeByStudentId(req, res) {
    try {
      const { id, studentId } = req.params;

      const test = await prisma.test.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          name: true,
          date: true,
          coach: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          grades: {
            where: {
              studentId: parseInt(studentId),
            },
            select: {
              id: true,
              date: true,
              tinggiBadan: true,
              beratBadan: true,
              bmi: true,
              kategoriBMI: true,
              tinggiDuduk: true,
              panjangTungkai: true,
              rentangLengan: true,
              denyutNadiIstirahat: true,
              saturasiOksigen: true,
              standingBoardJump: true,
              kecepatan: true,
              dayaTahan: true,
              controllingKanan: true,
              controllingKiri: true,
              dribbling: true,
              longpassKanan: true,
              longpassKiri: true,
              shortpassKanan: true,
              shortpassKiri: true,
              shootingKanan: true,
              shootingKiri: true,
              disiplin: true,
              komitmen: true,
              percayaDiri: true,
              injuryDetail: true,
              comment: true,
              student: {
                select: {
                  id: true,
                  name: true,
                  gender: true,
                  age: true,
                  level: true,
                },
              },
            },
          },
        },
      });

      if (!test) {
        return res.status(404).json({ message: "Tes tidak ditemukan" });
      }

      const grade = test.grades[0];

      if (!grade) {
        return res
          .status(404)
          .json({ message: "Siswa tidak ditemukan dalam tes ini" });
      }

      const { student, ...gradeWithoutStudent } = grade;

      return res.status(200).json({
        id: test.id,
        name: test.name,
        date: test.date,
        coach: test.coach,
        student,
        ...gradeWithoutStudent,
      });
    } catch (error) {
      console.error(
        "Terjadi kesalahan saat mengambil nilai tes berdasarkan siswa:",
        error
      );
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async getTestById(req, res) {
    try {
      const { id } = req.params;

      const test = await prisma.test.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          name: true,
          date: true,
          coach: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          grades: {
            select: {
              id: true,
              date: true,
              student: {
                select: {
                  id: true,
                  name: true,
                  gender: true,
                  age: true,
                  level: true,
                },
              },
            },
          },
        },
      });

      if (!test) {
        return res.status(404).json({ message: "Tes tidak ditemukan" });
      }

      return res.status(200).json(test);
    } catch (error) {
      console.error(
        "Terjadi kesalahan saat mengambil tes berdasarkan ID:",
        error
      );
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async removeTest(req, res) {
    try {
      const { id } = req.params;

      const existingTest = await prisma.test.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingTest) {
        return res.status(404).json({ message: "Tes tidak ditemukan" });
      }

      await prisma.test.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({ message: "Tes berhasil dihapus" });
    } catch (error) {
      console.error("Terjadi kesalahan saat menghapus tes:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async getGradesByStudentId(req, res) {
    try {
      const { studentId } = req.params;

      const grades = await prisma.grade.findMany({
        where: { studentId: parseInt(studentId) },
        include: {
          student: { select: { id: true, name: true } },
          coach: { select: { id: true, name: true } },
        },
      });

      return res.status(200).json(grades);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data nilai:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async getGradeById(req, res) {
    try {
      const { id } = req.params;

      const grade = await prisma.grade.findUnique({
        where: { id: parseInt(id) },
        include: {
          student: { select: { id: true, name: true } },
          coach: { select: { id: true, name: true } },
        },
      });

      if (!grade) {
        return res.status(404).json({ message: "Nilai tidak ditemukan" });
      }

      return res.status(200).json(grade);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil nilai:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async addGrade(req, res) {
    try {
      const {
        studentId,
        testId,
        date,
        tinggiBadan,
        beratBadan,
        bmi,
        kategoriBMI,
        tinggiDuduk,
        panjangTungkai,
        rentangLengan,
        denyutNadiIstirahat,
        saturasiOksigen,
        standingBoardJump,
        kecepatan,
        dayaTahan,
        controllingKanan,
        controllingKiri,
        dribbling,
        longpassKanan,
        longpassKiri,
        shortpassKanan,
        shortpassKiri,
        shootingKanan,
        shootingKiri,
        disiplin,
        komitmen,
        percayaDiri,
        injuryDetail,
        comment,
      } = req.body;

      const test = await prisma.test.findUnique({
        where: { id: parseInt(testId) },
        select: { coachId: true },
      });

      if (!test) {
        return res.status(404).json({ message: "Tes tidak ditemukan" });
      }

      const grade = await prisma.grade.create({
        data: {
          date: new Date(date),
          test: { connect: { id: parseInt(testId) } },
          student: { connect: { id: parseInt(studentId) } },
          coach: { connect: { id: test.coachId } },

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
          comment,
        },
        include: {
          student: { select: { id: true, name: true } },
          coach: { select: { id: true, name: true } },
          test: { select: { id: true, name: true } },
        },
      });

      return res.status(201).json(grade);
    } catch (error) {
      console.error("Terjadi kesalahan saat membuat nilai:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async updateGrade(req, res) {
    try {
      const { id } = req.params;
      const body = req.body;
      const data = {};

      if (body.date) data.date = new Date(body.date);
      if (body.studentId)
        data.student = { connect: { id: parseInt(body.studentId) } };
      if (body.coachId)
        data.coach = { connect: { id: parseInt(body.coachId) } };

      const floatFields = [
        "tinggiBadan",
        "beratBadan",
        "bmi",
        "tinggiDuduk",
        "panjangTungkai",
        "rentangLengan",
        "denyutNadiIstirahat",
        "saturasiOksigen",
        "standingBoardJump",
        "kecepatan",
        "dayaTahan",
      ];
      const intFields = [
        "controllingKanan",
        "controllingKiri",
        "dribbling",
        "longpassKanan",
        "longpassKiri",
        "shortpassKanan",
        "shortpassKiri",
        "shootingKanan",
        "shootingKiri",
        "disiplin",
        "komitmen",
        "percayaDiri",
      ];

      floatFields.forEach((field) => {
        if (body[field] !== undefined) data[field] = parseFloat(body[field]);
      });

      intFields.forEach((field) => {
        if (body[field] !== undefined) data[field] = parseInt(body[field]);
      });

      if (body.kategoriBMI) data.kategoriBMI = body.kategoriBMI;
      if (body.injuryDetail !== undefined)
        data.injuryDetail = body.injuryDetail;
      if (body.comment !== undefined) data.comment = body.comment;

      const grade = await prisma.grade.update({
        where: { id: parseInt(id) },
        data,
        include: {
          student: { select: { id: true, name: true } },
          coach: { select: { id: true, name: true } },
        },
      });

      return res.status(200).json(grade);
    } catch (error) {
      console.error("Terjadi kesalahan saat memperbarui nilai:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  async deleteGrade(req, res) {
    try {
      const { id } = req.params;

      await prisma.grade.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({ message: "Nilai berhasil dihapus" });
    } catch (error) {
      console.error("Terjadi kesalahan saat menghapus nilai:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }
}

export default new GradeControllers();
