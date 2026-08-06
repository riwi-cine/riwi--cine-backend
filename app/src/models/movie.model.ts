// app/src/models/movie.model.ts

/**
 * Modelo de Película
 * ------------------
 * Este archivo define el modelo `Movie` de Sequelize, que representa
 * la tabla `movies` en la base de datos.
 *
 * Contiene toda la información principal de una película que será
 * utilizada para la cartelera y programación de funciones.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad `Movie`.
 */
export interface MovieAttributes {
    id: number;
    title: string;
    synopsis: string;
    classification: string;
    durationMin: number;
    director: string;
    posterUrl: string;
    trailerUrl: string;
    status: string;
    rating: number;
}

/**
 * Atributos utilizados durante la creación.
 */
export interface MovieCreationAttributes
    extends Optional<MovieAttributes, "id"> {}

/**
 * Clase que representa el modelo Movie.
 */
class Movie
    extends Model<MovieAttributes, MovieCreationAttributes>
    implements MovieAttributes
{
    /** Identificador único de la película. */
    public id!: number;

    /** Título de la película. */
    public title!: string;

    /** Sinopsis de la película. */
    public synopsis!: string;

    /** Clasificación por edades. */
    public classification!: string;

    /** Duración en minutos. */
    public durationMin!: number;

    /** Director de la película. */
    public director!: string;

    /** URL del póster. */
    public posterUrl!: string;

    /** URL del tráiler. */
    public trailerUrl!: string;

    /** Estado de la película. */
    public status!: string;

    /** Calificación promedio. */
    public rating!: number;
}

/**
 * Inicialización del modelo Movie.
 */
Movie.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        synopsis: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        classification: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },

        durationMin: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "duration_min",
        },

        director: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        posterUrl: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: "poster_url",
        },

        trailerUrl: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: "trailer_url",
        },

        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },

        rating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: "Movie",
        tableName: "movies",
        timestamps: true,
    },
);

export default Movie;