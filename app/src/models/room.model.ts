// app/src/models/room.model.ts

/**
 * Modelo de Sala
 * --------------
 * Este archivo define el modelo `Room` de Sequelize, que representa la tabla
 * `rooms` en la base de datos.
 *
 * Contiene:
 *  - Atributos del modelo (`RoomAttributes`).
 *  - Atributos requeridos para la creación (`RoomCreationAttributes`).
 *  - Definición del modelo con sus columnas y restricciones.
 *
 * Cada sala pertenece a un cine y tiene asociado un tipo de sala.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad `Room`.
 */
export interface RoomAttributes {
    id: number;
    cinemaId: number;
    roomTypeId: number;
    name: string;
    capacity: number;
    extraPrice: number;
}

/**
 * Atributos utilizados para la creación de una nueva sala.
 */
export interface RoomCreationAttributes
    extends Optional<RoomAttributes, "id"> {}

/**
 * Clase que representa el modelo `Room`.
 */
class Room
    extends Model<RoomAttributes, RoomCreationAttributes>
    implements RoomAttributes
{
    /** Identificador único de la sala. */
    public id!: number;

    /** Cine al que pertenece la sala. */
    public cinemaId!: number;

    /** Tipo de sala (2D, IMAX, VIP, etc.). */
    public roomTypeId!: number;

    /** Nombre o número de la sala. */
    public name!: string;

    /** Capacidad total de la sala. */
    public capacity!: number;

    /** Recargo adicional por utilizar esta sala. */
    public extraPrice!: number;
}

/**
 * Inicialización del modelo `Room`.
 */
Room.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        cinemaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "cinema_id",
        },

        roomTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "room_type_id",
        },

        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        extraPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
            field: "extra_price",
        },
    },
    {
        sequelize,
        modelName: "Room",
        tableName: "rooms",
        timestamps: false,
    },
);

export default Room;