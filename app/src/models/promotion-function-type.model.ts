// app/src/models/promotion-function-type.model.ts

/**
 * Modelo de Relación Promoción - Tipo de Función
 * ----------------------------------------------
 * Este archivo define el modelo `PromotionFunctionType` de Sequelize,
 * que representa la tabla `promotion_function_types`.
 *
 * Esta tabla indica sobre qué tipos de función puede aplicarse una promoción.
 *
 * Ejemplo:
 * - Promoción "2x1 Miércoles" → Solo aplica a funciones 2D.
 * - Promoción "IMAX20" → Solo aplica a funciones IMAX.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface PromotionFunctionTypeAttributes {
    id: number;
    promotionId: number;
    functionTypeId: number;
}

/**
 * Atributos para creación.
 */
export interface PromotionFunctionTypeCreationAttributes
    extends Optional<PromotionFunctionTypeAttributes, "id"> {}

/**
 * Clase del modelo PromotionFunctionType.
 */
class PromotionFunctionType
    extends Model<
        PromotionFunctionTypeAttributes,
        PromotionFunctionTypeCreationAttributes
    >
    implements PromotionFunctionTypeAttributes
{
    /** Identificador del registro. */
    public id!: number;

    /** Promoción asociada. */
    public promotionId!: number;

    /** Tipo de función asociado. */
    public functionTypeId!: number;
}

/**
 * Inicialización del modelo.
 */
PromotionFunctionType.init(
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

        functionTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "function_type_id",
        },
    },
    {
        sequelize,
        modelName: "PromotionFunctionType",
        tableName: "promotion_function_types",

        timestamps: false,

        indexes: [
            {
                unique: true,
                fields: ["promotion_id", "function_type_id"],
            },
        ],
    },
);

export default PromotionFunctionType;