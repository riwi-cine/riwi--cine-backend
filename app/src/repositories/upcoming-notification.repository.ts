// app/src/repositories/upcoming-notification.repository.ts

import UpcomingNotification, { UpcomingNotificationCreationAttributes } from "../models/upcoming-notification.model";

class UpcomingNotificationRepository {
    async create(data: UpcomingNotificationCreationAttributes): Promise<typeof UpcomingNotification> {
        return await UpcomingNotification.create(data as any);
    }

    async findByUserAndMovie(userId: number, movieId: number) {
        return await UpcomingNotification.findOne({ where: { userId, movieId } });
    }

    async findById(id: number) {
        return await UpcomingNotification.findByPk(id);
    }
}

export default new UpcomingNotificationRepository();
