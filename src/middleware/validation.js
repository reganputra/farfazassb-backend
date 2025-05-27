
import Joi from 'joi';


class Validate {
    // Auth
    static get registerSchema() {
        return Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            childrenIds: Joi.array().items(Joi.number()).optional()
        });
    }

    static get loginSchema() {
        return Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });
    }

    // Student
    static get studentSchema() {
        return Joi.object({
            name: Joi.string().required(),
            parentIds: Joi.array().items(Joi.number()).optional()
        });
    }

    // Grade
    static get gradeSchema() {
        return Joi.object({
            subject: Joi.string().required(),
            score: Joi.number().min(0).max(100).required(),
            studentId: Joi.number().required()
        });
    }

    // Attendance
    static get attendanceSchema() {
        return Joi.object({
            date: Joi.date().required(),
            present: Joi.boolean().required(),
            studentId: Joi.number().required()
        });
    }

    // Coach
    static get coachSchema() {
        return Joi.object({
            name: Joi.string().required()
        });
    }

    // Achievement
    static get achievementSchema() {
        return Joi.object({
            title: Joi.string().required(),
            year: Joi.number().required(),
            studentId: Joi.number().allow(null).optional()
        });
    }

    // Staff
    static get staffSchema() {
        return Joi.object({
            name: Joi.string().required(),
            role: Joi.string().required()
        });
    }

    // User
    static get userSchema() {
        return Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            role: Joi.string().valid('SUPER_ADMIN',"COACH", 'USER').required(),
            childrenIds: Joi.array().items(Joi.number()).optional()
        });
    }
}

export default Validate;