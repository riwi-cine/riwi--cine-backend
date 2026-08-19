// app/src/routes/notifications.routes.ts

import { Router } from "express";
import notificationsController from "../controllers/notifications.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/** POST /api/notifications/upcoming */
router.post("/upcoming", authMiddleware, notificationsController.registerUpcomingNotification);

export default router;
