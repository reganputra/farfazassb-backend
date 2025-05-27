import express from "express";

import StudentController from "../controllers/StudentControllers.js";
import CoachController from "../controllers/CoachControllers.js";
import AchievementController from "../controllers/AchievementControllers.js";

const router = express.Router();

// Public routes
router.get('/students', StudentController.getAllStudentsPublic);
router.get('/coaches', CoachController.getAllCoaches);
router.get('/achievements', AchievementController.getAllAchievements);

export default router;