// app/src/models/movie-banner.model.ts

/**
 * Modelo MovieBanner
 * ------------------
 * Representa la tabla `movie_banners` de la base de datos.
 *
 * Almacena los banners asociados a una película, permitiendo
 * tener múltiples imágenes promocionales para una misma película.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de MovieBanner.
 */
export interface MovieBannerAttributes {
    /** Identificador único del banner. */
    id: number;

    /** Película a la que pertenece el banner. */
    movieId: number;

    /** URL de la imagen del banner. */
    imageUrl: string;

    /** Texto alternativo de la imagen. */
    altText: string | null;

    /** Orden en que se mostrará el banner. */
    displayOrder: number;

    /** Indica si el banner está activo. */
    active: boolean;

    /** Fecha de creación del banner. */
    createdAt: Date;
}

/**
 * Atributos utilizados al crear un MovieBanner.
 *
 * El id es generado automáticamente.
 * createdAt es generado automáticamente por Sequelize mediante
 * el valor por defecto definido en el modelo.
 */
export interface MovieBannerCreationAttributes
    extends Optional<MovieBannerAttributes, "id" | "createdAt"> {}

/**
 * Clase que representa el modelo MovieBanner.
 */
class MovieBanner
    extends Model<MovieBannerAttributes, MovieBannerCreationAttributes>
    implements MovieBannerAttributes
{
    /** Identificador único del banner. */
    public id!: number;

    /** Película asociada al banner. */
    public movieId!: number;

    /** URL de la imagen. */
    public imageUrl!: string;

    /** Texto alternativo de la imagen. */
    public altText!: string | null;

    /** Orden de visualización del banner. */
    public displayOrder!: number;

    /** Indica si el banner está activo. */
    public active!: boolean;

    /** Fecha de creación del banner. */
    public createdAt!: Date;
}

/**
 * Inicialización del modelo MovieBanner.
 */
MovieBanner.init(
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

        imageUrl: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: "image_url",
        },

        altText: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: "alt_text",
        },

        displayOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            field: "display_order",
        },

        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },

        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "created_at",
        },
    },
    {
        sequelize,
        modelName: "MovieBanner",
        tableName: "movie_banners",

        // El MER solo define created_at, no updated_at.
        // Por eso no usamos timestamps automáticos de Sequelize.
        timestamps: false,
    },
);

export default MovieBanner;