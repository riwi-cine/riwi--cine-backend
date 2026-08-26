// app/src/models/movie-release.model.ts

/**
 * Modelo de Estreno de Película
 * -----------------------------
 * Este archivo define el modelo `MovieRelease`, que representa la tabla
 * `movie_releases` en la base de datos.
 *
 * Esta entidad registra la fecha de estreno de una película en un país.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad MovieRelease.
 */
export interface MovieReleaseAttributes {
    id: number;
    movieId: number;
    countryId: number;
    releaseDate: Date | string;
}

/**
 * Atributos utilizados durante la creación.
 */
export interface MovieReleaseCreationAttributes
    extends Optional<MovieReleaseAttributes, "id"> {}

/**
 * Clase que representa el modelo MovieRelease.
 */
class MovieRelease
    extends Model<MovieReleaseAttributes, MovieReleaseCreationAttributes>
    implements MovieReleaseAttributes
{
    /** Identificador único del estreno. */
    public id!: number;

    /** Película que será estrenada. */
    public movieId!: number;

    /** País donde se estrenará. */
    public countryId!: number;

    /** Fecha de estreno. */
    public releaseDate!: Date | string;
}

/**
 * Inicialización del modelo MovieRelease.
 */
MovieRelease.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        movieId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "movie_id",
        },

        countryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "country_id",
        },

        releaseDate: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "release_date",
        },
    },
    {
        sequelize: sequelize as any,
        modelName: "MovieRelease",
        tableName: "movie_releases",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["movie_id", "country_id"],
            },
        ],
    },
);

export default MovieRelease;