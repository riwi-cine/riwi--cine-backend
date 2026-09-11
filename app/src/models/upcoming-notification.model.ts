// app/src/models/upcoming-notification.model.ts

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface UpcomingNotificationAttributes {
    id: number;
    userId: number;
    movieId: number;
    cityId: number | null;
    notifiedAt: Date | null;
}

export interface UpcomingNotificationCreationAttributes
    extends Optional<UpcomingNotificationAttributes, "id" | "cityId" | "notifiedAt"> {}

class UpcomingNotification
    extends Model<UpcomingNotificationAttributes, UpcomingNotificationCreationAttributes>
    implements UpcomingNotificationAttributes
{
    public id!: number;
    public userId!: number;
    public movieId!: number;
    public cityId!: number | null;
    public notifiedAt!: Date | null;
}

UpcomingNotification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "user_id",
        },

        movieId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "movie_id",
        },

        cityId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "city_id",
        },

        notifiedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "notified_at",
        },
    },
    {
        sequelize,
        modelName: "UpcomingNotification",
        tableName: "upcoming_notifications",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ["user_id", "movie_id"],
            },
        ],
    },
);

export default UpcomingNotification;
