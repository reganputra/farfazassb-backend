
import Joi from 'joi';

// Auth schema validation
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    childrenIds: Joi.array().items(Joi.number()).optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// Student schema validation
const studentSchema = Joi.object({
    name: Joi.string().required(),
    parentIds: Joi.array().items(Joi.number()).optional()
});

// Grade schema validation
const gradeSchema = Joi.object({
    subject: Joi.string().required(),
    score: Joi.number().min(0).max(100).required(),
    studentId: Joi.number().required()
});

// Attendance schema validation
const attendanceSchema = Joi.object({
    date: Joi.date().required(),
    present: Joi.boolean().required(),
    studentId: Joi.number().required()
});

// Coach schema validation
const coachSchema = Joi.object({
    name: Joi.string().required()
});

// Achievement schema validation
const achievementSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().required(),
    studentId: Joi.number().allow(null).optional()
});

// Staff schemas validation
const staffSchema = Joi.object({
    name: Joi.string().required(),
    role: Joi.string().required()
});

// User schemas validation
const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('ADMIN', 'USER').required(),
    childrenIds: Joi.array().items(Joi.number()).optional()
});

export {
    registerSchema,
    loginSchema,
    studentSchema,
    gradeSchema,
    attendanceSchema,
    coachSchema,
    achievementSchema,
    staffSchema,
    userSchema
};