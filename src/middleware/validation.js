import Joi from "joi";

class Validate {
  // Auth
  static get registerSchema() {
    return Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      childrenIds: Joi.array().items(Joi.number()).optional(),
    });
  }

  static get loginSchema() {
    return Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
  }

  // Student
  static get studentSchema() {
    return Joi.object({
      name: Joi.string().required(),
      parentId: Joi.number().optional(),
      coachId: Joi.number().optional(),
      age: Joi.string().required(),
      gender: Joi.string().valid("L", "P").required(),
      level: Joi.string().required(),
      tanggalLahir: Joi.date().required(),
      tempatLahir: Joi.string().required(),
      kategoriBMI: Joi.string().required(),
    });
  }
  // Test
  static get createTestSchema() {
    return Joi.object({
      name: Joi.string().min(3).max(100).required(),
      date: Joi.date().iso().required(),
      coachId: Joi.number().integer().positive().required(),
    });
  }

  // Grade
  static get gradeSchema() {
    return Joi.object({
      date: Joi.date().required(),
      studentId: Joi.number().required(),
      testId: Joi.number().required(),

      // Antropometri
      tinggiBadan: Joi.number().required(),
      beratBadan: Joi.number().required(),
      bmi: Joi.number().required(),
      kategoriBMI: Joi.string()
        .valid("NORMAL", "UNDERWEIGHT", "OVERWEIGHT")
        .required(),
      tinggiDuduk: Joi.number().required(),
      panjangTungkai: Joi.number().required(),
      rentangLengan: Joi.number().required(),

      // Fisiologi
      denyutNadiIstirahat: Joi.number().required(),
      saturasiOksigen: Joi.number().required(),

      // Biomotor
      standingBoardJump: Joi.number().required(),
      kecepatan: Joi.number().required(),
      dayaTahan: Joi.number().required(),

      // Keterampilan (1–4)
      controllingKanan: Joi.number().integer().min(1).max(4).required(),
      controllingKiri: Joi.number().integer().min(1).max(4).required(),
      dribbling: Joi.number().integer().min(1).max(4).required(),
      longpassKanan: Joi.number().integer().min(1).max(4).required(),
      longpassKiri: Joi.number().integer().min(1).max(4).required(),
      shortpassKanan: Joi.number().integer().min(1).max(4).required(),
      shortpassKiri: Joi.number().integer().min(1).max(4).required(),
      shootingKanan: Joi.number().integer().min(1).max(4).required(),
      shootingKiri: Joi.number().integer().min(1).max(4).required(),

      // Psikologi (1–4)
      disiplin: Joi.number().integer().min(1).max(4).required(),
      komitmen: Joi.number().integer().min(1).max(4).required(),
      percayaDiri: Joi.number().integer().min(1).max(4).required(),

      // Tambahan
      injuryDetail: Joi.string().optional().allow(""),
      comment: Joi.string().optional().allow(""),
    });
  }

  static get updateGradeSchema() {
    return Joi.object({
      date: Joi.date().optional(),
      studentId: Joi.number().optional(),

      tinggiBadan: Joi.number().optional(),
      beratBadan: Joi.number().optional(),
      bmi: Joi.number().optional(),
      kategoriBMI: Joi.string()
        .valid("NORMAL", "UNDERWEIGHT", "OVERWEIGHT")
        .optional(),
      tinggiDuduk: Joi.number().optional(),
      panjangTungkai: Joi.number().optional(),
      rentangLengan: Joi.number().optional(),

      denyutNadiIstirahat: Joi.number().optional(),
      saturasiOksigen: Joi.number().optional(),

      standingBoardJump: Joi.number().optional(),
      kecepatan: Joi.number().optional(),
      dayaTahan: Joi.number().optional(),

      controllingKanan: Joi.number().integer().min(1).max(4).optional(),
      controllingKiri: Joi.number().integer().min(1).max(4).optional(),
      dribbling: Joi.number().integer().min(1).max(4).optional(),
      longpassKanan: Joi.number().integer().min(1).max(4).optional(),
      longpassKiri: Joi.number().integer().min(1).max(4).optional(),
      shortpassKanan: Joi.number().integer().min(1).max(4).optional(),
      shortpassKiri: Joi.number().integer().min(1).max(4).optional(),
      shootingKanan: Joi.number().integer().min(1).max(4).optional(),
      shootingKiri: Joi.number().integer().min(1).max(4).optional(),

      disiplin: Joi.number().integer().min(1).max(4).optional(),
      komitmen: Joi.number().integer().min(1).max(4).optional(),
      percayaDiri: Joi.number().integer().min(1).max(4).optional(),

      injuryDetail: Joi.string().allow("").optional(),
      comment: Joi.string().allow("").optional(),
    });
  }

  // Attendance
  static get attendanceSchema() {
    return Joi.object({
      date: Joi.date().required(),
      present: Joi.boolean().required(),
      studentId: Joi.number().required(),
    });
  }

  // Coach
  static get coachSchema() {
    return Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      telp: Joi.string()
        .pattern(/^[0-9]+$/)
        .min(10)
        .max(15)
        .required(),
      gender: Joi.string().valid("Laki-Laki", "Perempuan").required(),
      password: Joi.string().min(6).required().messages({
        "string.min": "Kata sandi minimal terdiri dari 6 karakter",
        "any.required": "Kata sandi wajib diisi",
      }),
    });
  }

  // Achievement
  static get achievementSchema() {
    return Joi.object({
      title: Joi.string().required(),
      event: Joi.string().required(),
      date: Joi.date().required(),
      desc: Joi.string().required(),
      level: Joi.string().required(),
      place: Joi.number().integer().required(),
      studentId: Joi.number().integer().allow(null).optional(),
    });
  }

  // Staff
  static get staffSchema() {
    return Joi.object({
      name: Joi.string().required(),
      role: Joi.string().required(),
    });
  }

  // User
  static get userSchema() {
    return Joi.object({
      name: Joi.string().min(2).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required().messages({
        "string.min": "Kata sandi minimal terdiri dari 6 karakter",
        "any.required": "Kata sandi wajib diisi",
      }),
      role: Joi.string().valid("SUPER_ADMIN", "COACH", "USER").required(),
      telp: Joi.string().min(8).required(),
      address: Joi.string().min(5).required(),
    });
  }
}

export default Validate;
