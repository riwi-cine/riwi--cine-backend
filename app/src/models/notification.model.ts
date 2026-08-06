// app/src/models/notification.model.ts

/**
 * Modelo de Notificación
 * ----------------------
 * Este archivo define el modelo `Notification` de Sequelize,
 * que representa la tabla `notifications` en la base de datos.
 *
 * Almacena todas las notificaciones enviadas a los usuarios
 * por diferentes canales (correo, SMS, push, etc.).
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface NotificationAttributes {
    id: number;
    userId: number;
    type: string;
    channel: string;
    isTransactional: boolean;
    status: string;
    sentAt: Date;
}

/**
 * Atributos para creación.
 */
export interface NotificationCreationAttributes
    extends Optional<NotificationAttributes, "id"> {}

/**
 * Clase del modelo Notification.
 */
class Notification
    extends Model<NotificationAttributes, NotificationCreationAttributes>
    implements NotificationAttributes
{
    /** Identificador de la notificación. */
    public id!: number;

    /** Usuario destinatario. */
    public userId!: number;

    /** Tipo de notificación. */
    public type!: string;

    /** Canal de envío. */
    public channel!: string;

    /** Indica si es una notificación transaccional. */
    public isTransactional!: boolean;

    /** Estado del envío. */
    public status!: string;

    /** Fecha y hora de envío. */
    public sentAt!: Date;
}

/**
 * Inicialización del modelo.
 */
Notification.init(
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

        type: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        channel: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },

        isTransactional: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            field: "is_transactional",
        },

        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },

        sentAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "sent_at",
        },
    },
    {
        sequelize,
        modelName: "Notification",
        tableName: "notifications",

        timestamps: false,
    },
);

export default Notification;