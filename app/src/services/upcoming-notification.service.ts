// app/src/services/upcoming-notification.service.ts

import { Op } from "sequelize";
import repository from "../repositories/upcoming-notification.repository";
import Movie from "../models/movie.model";
import MovieRelease from "../models/movie-release.model";
import User from "../models/user.model";

class UpcomingNotificationService {
    /**
     * Crea una solicitud para notificar al usuario cuando la película esté disponible.
     * Valida existencia de película y que exista un estreno futuro para el país del usuario.
     */
    async register(userId: number, movieId: number, cityId?: number) {
        // Validar usuario
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error("Usuario no encontrado.");
        }

        // Validar película
        const movie = await Movie.findByPk(movieId);
        if (!movie) {
            throw new Error("Película no encontrada.");
        }

        // Validar que exista un estreno futuro para el país del usuario
        const countryId = (user as any).countryId;
        const todayStr = new Date().toISOString().slice(0, 10);

        const release = await MovieRelease.findOne({
            where: {
                movieId,
                countryId,
                releaseDate: {
                    [Op.gt]: todayStr,
                },
            },
        });

        if (!release) {
            throw new Error("La película no corresponde a un próximo estreno en el país del usuario.");
        }

        // Evitar duplicados
        const existing = await repository.findByUserAndMovie(userId, movieId);
        if (existing) {
            return { created: false, upcomingNotification: existing };
        }

        const created = await repository.create({ userId, movieId, cityId: cityId ?? (user as any).cityId });

        return { created: true, upcomingNotification: created };
    }
}

export default new UpcomingNotificationService();
