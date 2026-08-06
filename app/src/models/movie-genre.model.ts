// app/src/models/movie-genre.model.ts

/**
 * Modelo MovieGenre
 * -----------------
 * Este archivo define el modelo `MovieGenre`, que representa la tabla
 * intermedia `movie_genres`.
 *
 * Esta tabla implementa la relación Muchos a Muchos (N:M)
 * entre películas y géneros.
 */

import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos de la entidad MovieGenre.
 */
export interface MovieGenreAttributes {
    movieId: number;
    genreId: number;
}

/**
 * Clase que representa la relación entre Movie y Genre.
 */
class MovieGenre
    extends Model<MovieGenreAttributes>
    implements MovieGenreAttributes
{
    /** Película asociada. */
    public movieId!: number;

    /** Género asociado. */
    public genreId!: number;
}

/**
 * Inicialización del modelo MovieGenre.
 */
MovieGenre.init(
    {
        movieId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            field: "movie_id",
        },

        genreId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            field: "genre_id",
        },
    },
    {
        sequelize,
        modelName: "MovieGenre",
        tableName: "movie_genres",
        timestamps: false,
    },
);

export default MovieGenre;