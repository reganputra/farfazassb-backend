import express from "express";
import { authenticate, isCoachAndAdmin } from "../middleware/auth.js";
import { validateBody } from "../middleware/validateBody.js";
import Validate from "../middleware/validation.js";

import UserController from "../controllers/UserControllers.js";
import StudentController from "../controllers/StudentControllers.js";
import StaffController from "../controllers/StaffControllers.js";
import GradeController from "../controllers/GradeControllers.js";
import AchievementController from "../controllers/AchievementControllers.js";
import CoachController from "../controllers/CoachControllers.js";
import AttendanceController from "../controllers/AttendanceControllers.js";
import upload from "../middleware/uploadS3.js";
import { parseArrayFields } from "../middleware/parsedArrayField.js";

const router = express.Router();

router.use(authenticate, isCoachAndAdmin);

// Student routes
router.get("/students", StudentController.getAllStudents);
router.get("/students/coach/:coachId", StudentController.getAllStudentsByCoach);
router.get("/students/:id", StudentController.getStudentById);
router.post(
  "/students",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "kk", maxCount: 1 },
    { name: "koperasi", maxCount: 1 },
    { name: "akta", maxCount: 1 },
    { name: "bpjs", maxCount: 1 },
  ]),
  parseArrayFields(["parentIds"]),
  validateBody(Validate.studentSchema),
  StudentController.createStudent
);
router.put(
  "/students/:id",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "kk", maxCount: 1 },
    { name: "koperasi", maxCount: 1 },
    { name: "akta", maxCount: 1 },
    { name: "bpjs", maxCount: 1 },
  ]),
  StudentController.updateStudent
);
router.delete("/students/:id", StudentController.deleteStudent);

// Staff routes
router.get("/staff", StaffController.getAllStaff);
router.get("/staff/:id", StaffController.getStaffById);
router.post("/staff", StaffController.createStaff);
router.put("/staff/:id", StaffController.updateStaff);
router.delete("/staff/:id", StaffController.deleteStaff);

// Coach routes
router.get("/coaches", CoachController.getAllCoaches);
router.get("/coaches/:id", CoachController.getCoachesById);
router.post(
  "/coaches",
  upload.single("photo"),
  validateBody(Validate.coachSchema),
  CoachController.createCoach
);
router.put("/coaches/:id", upload.single("photo"), CoachController.updateCoach);
router.delete("/coaches/:id", CoachController.deleteCoach);

// Achievement routes
router.get("/achievements",AchievementController.getAllAchievements)
router.get("/achievements/:id", AchievementController.getAchievementById);
router.post(
  "/achievements",
  validateBody(Validate.achievementSchema),
  AchievementController.createAchievement
);
router.put("/achievements/:id", AchievementController.updateAchievement);
router.delete("/achievements/:id", AchievementController.deleteAchievement);

// Tests
router.get("/tests", GradeController.getAllTests);
router.get("/tests/:id", GradeController.getTestById);
router.post(
  "/tests",
  validateBody(Validate.createTestSchema),
  GradeController.createTest
);
router.patch("/tests/:id", GradeController.editTest);
router.delete("/tests/:id", GradeController.removeTest);


// Grade routes
router.get("/students/:studentId/grades", GradeController.getGradesByStudentId);
router.get("/grades/:id", GradeController.getGradeById);
router.post(
  "/grades",
  validateBody(Validate.gradeSchema),
  GradeController.addGrade
);
router.put(
  "/grades/:id",
  validateBody(Validate.updateGradeSchema),
  GradeController.updateGrade
);
router.delete("/grades/:id", GradeController.deleteGrade);

// Attendance routes
router.get(
  "/students/:studentId/attendance",
  AttendanceController.getAttendanceByStudentId
);
router.get("/attendance/:id", AttendanceController.getAttendanceById);
router.get("/attendance/date/:date", AttendanceController.getAttendanceByDate);
router.post(
  "/attendance",
  validateBody(Validate.attendanceSchema),
  AttendanceController.createAttendance
);
router.put("/attendance/:id", AttendanceController.updateAttendance);
router.delete("/attendance/:id", AttendanceController.deleteAttendance);

// User management routes
router.get("/users", UserController.getAllUsers);
router.get("/users/:id", UserController.getUserById);
router.post(
  "/users",
  validateBody(Validate.userSchema),
  UserController.createUser
);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deleteUser);

export default router;
