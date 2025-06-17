import express from "express";

import { authenticate, isAll } from "../middleware/auth.js";
import UserController from "../controllers/UserControllers.js";
import GradeControllers from "../controllers/GradeControllers.js";

const router = express.Router();

router.use(authenticate, isAll);

// Parent routes
router.get("/me/:id",UserController.getUserById)
router.get('/my-children', UserController.getCurrentUserChildren);
router.get('/my-children/:childId', UserController.getChildDetails);
router.get("/test/child/:id",GradeControllers.getTestsByStudentId)
router.get("/test/:id/:studentId",GradeControllers.getTestGradeByStudentId)

export default router;