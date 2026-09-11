// app/src/models/cinema_room_type.model.ts

/**
 * Modelo de Relación Cine - Tipo de Sala
 * --------------------------------------
 * Este archivo define el modelo `CinemaRoomType` de Sequelize, que representa
 * la tabla intermedia `cinema_room_types`.
 *
 * Esta tabla implementa una relación muchos a muchos (N:M) entre
 * los cines y los tipos de sala.
 */

import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos de la entidad `CinemaRoomType`.
 */
export interface CinemaRoomTypeAttributes {
    cinemaId: number;
    roomTypeId: number;
}

/**
 * Clase que representa la tabla intermedia.
 */
class CinemaRoomType
    extends Model<CinemaRoomTypeAttributes>
    implements CinemaRoomTypeAttributes
{
    /** Cine asociado. */
    public cinemaId!: number;

    /** Tipo de sala asociado. */
    public roomTypeId!: number;
}

/**
 * Inicialización del modelo.
 */
CinemaRoomType.init(
    {
        cinemaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "cinema_id",
            primaryKey: true,
        },

        roomTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "room_type_id",
            primaryKey: true,
        },
    },
    {
        sequelize,
        modelName: "CinemaRoomType",
        tableName: "cinema_room_types",
        timestamps: false,
    },
);

export default CinemaRoomType;