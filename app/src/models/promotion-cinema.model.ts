// app/src/models/promotion-cinema.model.ts

/**
 * Modelo de Relación Promoción - Cine
 * -----------------------------------
 * Este archivo define el modelo `PromotionCinema` de Sequelize,
 * que representa la tabla `promotion_cinemas`.
 *
 * Esta tabla indica en qué cines está disponible una promoción.
 *
 * Si una promoción no tiene registros en esta tabla,
 * se interpreta que aplica a todos los cines.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface PromotionCinemaAttributes {
    id: number;
    promotionId: number;
    cinemaId: number;
}

/**
 * Atributos para creación.
 */
export interface PromotionCinemaCreationAttributes
    extends Optional<PromotionCinemaAttributes, "id"> {}

/**
 * Clase del modelo PromotionCinema.
 */
class PromotionCinema
    extends Model<
        PromotionCinemaAttributes,
        PromotionCinemaCreationAttributes
    >
    implements PromotionCinemaAttributes
{
    /** Identificador del registro. */
    public id!: number;

    /** Promoción asociada. */
    public promotionId!: number;

    /** Cine donde aplica la promoción. */
    public cinemaId!: number;
}

/**
 * Inicialización del modelo.
 */
PromotionCinema.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        promotionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "promotion_id",
        },

        cinemaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "cinema_id",
        },
    },
    {
        sequelize,
        modelName: "PromotionCinema",
        tableName: "promotion_cinemas",

        timestamps: false,

        indexes: [
            {
                unique: true,
                fields: ["promotion_id", "cinema_id"],
            },
        ],
    },
);

export default PromotionCinema;
