// app/src/models/room_type.model.ts

/**
 * Modelo de Tipo de Sala
 * ----------------------
 * Este archivo define el modelo `RoomType` de Sequelize, que representa la tabla
 * `room_types` en la base de datos.
 *
 * Contiene:
 *  - Atributos del modelo (`RoomTypeAttributes`).
 *  - Atributos requeridos para la creación (`RoomTypeCreationAttributes`).
 *  - Definición del modelo con sus columnas y restricciones.
 *
 * Este modelo representa los diferentes tipos de sala disponibles
 * (2D, 3D, IMAX, VIP, etc.).
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad `RoomType`.
 */
export interface RoomTypeAttributes {
    id: number;
    name: string;
    description: string;
}

/**
 * Atributos utilizados para la creación de un nuevo tipo de sala.
 */
export interface RoomTypeCreationAttributes
    extends Optional<RoomTypeAttributes, "id"> {}

/**
 * Clase que representa el modelo `RoomType`.
 */
class RoomType
    extends Model<RoomTypeAttributes, RoomTypeCreationAttributes>
    implements RoomTypeAttributes
{
    /** Identificador único del tipo de sala. */
    public id!: number;

    /** Nombre del tipo de sala. */
    public name!: string;

    /** Descripción del tipo de sala. */
    public description!: string;
}

/**
 * Inicialización del modelo `RoomType`.
 */
RoomType.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },

        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "RoomType",
        tableName: "room_types",
        timestamps: false,
    },
);

export default RoomType;