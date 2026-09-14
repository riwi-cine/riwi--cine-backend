// app/src/models/seat-lock.model.ts

/**
 * Modelo de Bloqueo de Asientos
 * -----------------------------
 * Este archivo define el modelo `SeatLock` de Sequelize,
 * que representa la tabla `seat_locks` en la base de datos.
 *
 * Permite reservar temporalmente un asiento mientras el usuario
 * completa el proceso de compra.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface SeatLockAttributes {
    id: number;
    cartId: number;
    functionId: number;
    seatId: number;
    expiresAt: Date;
}

/**
 * Atributos para creación.
 */
export interface SeatLockCreationAttributes
    extends Optional<SeatLockAttributes, "id"> {}

/**
 * Clase del modelo SeatLock.
 */
class SeatLock
    extends Model<SeatLockAttributes, SeatLockCreationAttributes>
    implements SeatLockAttributes
{
    /** Identificador del bloqueo. */
    public id!: number;

    /** Carrito propietario del bloqueo. */
    public cartId!: number;

    /** Función donde se reserva el asiento. */
    public functionId!: number;

    /** Asiento reservado. */
    public seatId!: number;

    /** Fecha y hora de expiración del bloqueo. */
    public expiresAt!: Date;
}

/**
 * Inicialización del modelo.
 */
SeatLock.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        cartId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "cart_id",
        },

        functionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "function_id",
        },

        seatId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "seat_id",
        },

        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "expires_at",
        },
    },
    {
        sequelize,
        modelName: "SeatLock",
        tableName: "seat_locks",

        timestamps: false,

        indexes: [
            {
                unique: true,
                fields: ["function_id", "seat_id"],
            },
        ],
    },
);

export default SeatLock;