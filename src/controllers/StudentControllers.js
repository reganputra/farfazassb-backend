import prisma from "../config/db.js";

class StudentControllers {
  // Guest access
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
      console.error("Error fetching students:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  async getAllStudentsByCoach(req,res){

    const { coachId } = req.params;

    try {
      const students = await prisma.student.findMany({
        where : {
          coachId: parseInt(coachId)
        }
      })

      return res.status(200).json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Admin access
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
      console.error("Error fetching students:", error);
      return res.status(500).json({ message: "Server error" });
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
        return res.status(404).json({ message: "Student not found" });
      }

      return res.status(200).json(student);
    } catch (error) {
      console.error("Error fetching student:", error);
      return res.status(500).json({ message: "Server error" });
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

    const data = {
      name,
      photoUrl: req.file?.location,
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
    console.error("Error creating student:", error);
    return res.status(500).json({ message: "Server error" });
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

    const data = {
      ...(name && { name }),
      ...(req.file?.location && { photoUrl: req.file.location }),
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
    console.error("Error updating student:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

  async deleteStudent(req, res) {
    try {
      const { id } = req.params;

      await prisma.$transaction([
        prisma.grade.deleteMany({ where: { studentId: parseInt(id) } }),
        prisma.attendance.deleteMany({ where: { studentId: parseInt(id) } }),
        prisma.student.delete({ where: { id: parseInt(id) } }),
      ]); // delete all related grades and attendance records before deleting the student

      return res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
      console.error("Error deleting student:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
}

export default new StudentControllers();
