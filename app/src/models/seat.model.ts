// app/src/models/seat.model.ts

/**
 * Modelo de Asiento
 * -----------------
 * Este archivo define el modelo `Seat` de Sequelize, que representa la tabla
 * `seats` en la base de datos.
 *
 * Contiene:
 *  - Atributos del modelo (`SeatAttributes`).
 *  - Atributos requeridos para la creación (`SeatCreationAttributes`).
 *  - Definición del modelo con sus columnas y restricciones.
 *
 * Cada asiento pertenece a una sala.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad `Seat`.
 */
export interface SeatAttributes {
    id: number;
    roomId: number;
    row: string;
    number: string;
    seatType: string;
}

/**
 * Atributos utilizados para la creación de un nuevo asiento.
 */
export interface SeatCreationAttributes
    extends Optional<SeatAttributes, "id"> {}

/**
 * Clase que representa el modelo `Seat`.
 */
class Seat
    extends Model<SeatAttributes, SeatCreationAttributes>
    implements SeatAttributes
{
    /** Identificador único del asiento. */
    public id!: number;

    /** Sala a la que pertenece el asiento. */
    public roomId!: number;

    /** Fila del asiento. */
    public row!: string;

    /** Número del asiento dentro de la fila. */
    public number!: string;

    /** Tipo de asiento (Estándar, Preferencial, Pareja, etc.). */
    public seatType!: string;
}

/**
 * Inicialización del modelo `Seat`.
 */
Seat.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        roomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "room_id",
        },

        row: {
            type: DataTypes.STRING(5),
            allowNull: false,
        },

        number: {
            type: DataTypes.STRING(5),
            allowNull: false,
        },

        seatType: {
            type: DataTypes.STRING(30),
            allowNull: false,
            field: "seat_type",
        },
    },
    {
        sequelize,
        modelName: "Seat",
        tableName: "seats",
        timestamps: false,
    },
);

export default Seat;