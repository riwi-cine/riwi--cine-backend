// app/src/models/movie-actor.model.ts

/**
 * Modelo MovieActor
 * -----------------
 * Representa la tabla intermedia `movie_actors` de la base de datos.
 *
 * Esta tabla resuelve la relación N:M entre películas y actores.
 * Una película puede tener varios actores y un actor puede participar
 * en varias películas.
 */

import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de MovieActor.
 *
 * movieId y actorId forman conjuntamente la clave primaria
 * compuesta de la tabla.
 */
export interface MovieActorAttributes {
    /** Película asociada. */
    movieId: number;

    /** Actor asociado. */
    actorId: number;

    /** Nombre del personaje interpretado por el actor. */
    characterName: string | null;

    /** Orden en que se mostrará el actor dentro de la película. */
    displayOrder: number;
}

/**
 * Clase que representa el modelo MovieActor.
 *
 * No necesita CreationAttributes porque sus campos forman parte
 * de la información proporcionada al crear la relación.
 */
class MovieActor
    extends Model<MovieActorAttributes>
    implements MovieActorAttributes
{
    /** Identificador de la película. */
    public movieId!: number;

    /** Identificador del actor. */
    public actorId!: number;

    /** Nombre del personaje interpretado. */
    public characterName!: string | null;

    /** Orden de visualización del actor. */
    public displayOrder!: number;
}

/**
 * Inicialización del modelo MovieActor.
 */
MovieActor.init(
    {
        movieId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            field: "movie_id",
        },

        actorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            field: "actor_id",
        },

        characterName: {
            type: DataTypes.STRING(150),
            allowNull: true,
            field: "character_name",
        },

        displayOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            field: "display_order",
        },
    },
    {
        sequelize,
        modelName: "MovieActor",
        tableName: "movie_actors",

        // El MER no define created_at ni updated_at.
        timestamps: false,
    },
);

export default MovieActor;