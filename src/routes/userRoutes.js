import express from "express";

import { authenticate, isUser } from "../middleware/auth.js";
import UserController from "../controllers/UserControllers.js";




const router = express.Router();

// Apply authentication and user middleware to all routes
router.use(authenticate, isUser);

// User (Parent) routes
router.get('/my-children', UserController.getCurrentUserChildren);
router.get('/my-children/:childId', UserController.getChildDetails);

export default router;