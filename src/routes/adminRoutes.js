
import express from 'express';
import {authenticate, isAdmin} from "../middleware/auth.js";


import UserController from "../controllers/UserControllers.js";
import StudentController from "../controllers/StudentControllers.js";
import StaffController from "../controllers/StaffControllers.js";
import GradeController from "../controllers/GradeControllers.js";
import AchievementController from "../controllers/AchievementControllers.js";
import CoachController from "../controllers/CoachControllers.js";
import AttendanceController from "../controllers/AttendanceControllers.js";

const router = express.Router();

router.use(authenticate, isAdmin);

// Student routes
router.get('/students', StudentController.getAllStudents);
router.get('/students/:id', StudentController.getStudentById);
router.post('/students', StudentController.createStudent);
router.put('/students/:id', StudentController.updateStudent);
router.delete('/students/:id', StudentController.deleteStudent);

// Staff routes
router.get('/staff', StaffController.getAllStaff);
router.get('/staff/:id', StaffController.getStaffById);
router.post('/staff', StaffController.createStaff);
router.put('/staff/:id', StaffController.updateStaff);
router.delete('/staff/:id', StaffController.deleteStaff);

// Coach routes
router.get('/coaches/:id', CoachController.getCoachesById);
router.post('/coaches', CoachController.createCoach);
router.put('/coaches/:id', CoachController.updateCoach);
router.delete('/coaches/:id', CoachController.deleteCoach);

// Achievement routes
router.get('/achievements/:id', AchievementController.getAchievementById);
router.post('/achievements', AchievementController.createAchievement);
router.put('/achievements/:id', AchievementController.updateAchievement);
router.delete('/achievements/:id', AchievementController.deleteAchievement);

// Grade routes
router.get('/students/:studentId/grades', GradeController.getGradesByStudentId);
router.get('/grades/:id', GradeController.getGradeById);
router.post('/grades', GradeController.addGrade);
router.put('/grades/:id', GradeController.updateGrade);
router.delete('/grades/:id', GradeController.deleteGrade);

// Attendance routes
router.get('/students/:studentId/attendance', AttendanceController.getAttendanceByStudentId);
router.get('/attendance/:id', AttendanceController.getAttendanceById);
router.post('/attendance', AttendanceController.createAttendance);
router.put('/attendance/:id', AttendanceController.updateAttendance);
router.delete('/attendance/:id', AttendanceController.deleteAttendance);

// User management routes
router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/users', UserController.createUser);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

export default router;