// app/src/models/genre.model.ts

/**
 * Modelo de Género
 * ----------------
 * Este archivo define el modelo `Genre` de Sequelize, que representa
 * la tabla `genres` en la base de datos.
 *
 * Una película puede pertenecer a varios géneros y un género puede
 * estar asociado a múltiples películas.
 *
 * Esta relación N:M se implementará mediante la tabla intermedia
 * `movie_genres`.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad `Genre`.
 */
export interface GenreAttributes {
    id: number;
    name: string;
}

/**
 * Atributos utilizados durante la creación.
 */
export interface GenreCreationAttributes
    extends Optional<GenreAttributes, "id"> {}

/**
 * Clase que representa el modelo Genre.
 */
class Genre
    extends Model<GenreAttributes, GenreCreationAttributes>
    implements GenreAttributes
{
    /** Identificador único del género. */
    public id!: number;

    /** Nombre del género. */
    public name!: string;
}

/**
 * Inicialización del modelo Genre.
 */
Genre.init(
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
    },
    {
        sequelize,
        modelName: "Genre",
        tableName: "genres",
        timestamps: true,
    },
);

export default Genre;