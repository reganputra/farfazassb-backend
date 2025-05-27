import express from "express";

import { authenticate, isAll } from "../middleware/auth.js";
import UserController from "../controllers/UserControllers.js";

const router = express.Router();

router.use(authenticate, isAll);

// Parent routes
router.get('/my-children', UserController.getCurrentUserChildren);
router.get('/my-children/:childId', UserController.getChildDetails);

export default router;