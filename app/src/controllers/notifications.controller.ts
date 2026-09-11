// app/src/controllers/notifications.controller.ts

import { Request, Response } from "express";
import upcomingNotificationService from "../services/upcoming-notification.service";

export const registerUpcomingNotification = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = (req as any).user;
        if (!user || !user.id) {
            return res.status(401).json({ message: "Usuario no autenticado." });
        }

        const { movieId, cityId } = req.body;

        const parsedMovieId = Number(movieId);
        if (Number.isNaN(parsedMovieId) || parsedMovieId <= 0) {
            return res.status(400).json({ message: "movieId debe ser un número válido." });
        }

        const result = await upcomingNotificationService.register(user.id, parsedMovieId, cityId);

        if (!result.created) {
            return res.status(200).json({ message: "Ya existe una solicitud para esta película.", data: result.upcomingNotification });
        }

        return res.status(201).json({ message: "Solicitud creada.", data: result.upcomingNotification });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export default {
    registerUpcomingNotification,
};
