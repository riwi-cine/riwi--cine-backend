// app/src/models/order-promotion.model.ts

/**
 * Modelo de Promociones Aplicadas a una Orden
 * -------------------------------------------
 * Este archivo define el modelo `OrderPromotion` de Sequelize,
 * que representa la tabla `order_promotions`.
 *
 * Esta tabla registra las promociones que fueron aplicadas
 * a una orden y el valor real del descuento otorgado.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface OrderPromotionAttributes {
    id: number;
    orderId: number;
    promotionId: number;
    discountApplied: number;
}

/**
 * Atributos para creación.
 */
export interface OrderPromotionCreationAttributes
    extends Optional<OrderPromotionAttributes, "id"> {}

/**
 * Clase del modelo OrderPromotion.
 */
class OrderPromotion
    extends Model<
        OrderPromotionAttributes,
        OrderPromotionCreationAttributes
    >
    implements OrderPromotionAttributes
{
    /** Identificador del registro. */
    public id!: number;

    /** Orden a la que pertenece la promoción. */
    public orderId!: number;

    /** Promoción aplicada. */
    public promotionId!: number;

    /** Valor real descontado. */
    public discountApplied!: number;
}

/**
 * Inicialización del modelo.
 */
OrderPromotion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "order_id",
        },

        promotionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "promotion_id",
        },

        discountApplied: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: "discount_applied",
        },
    },
    {
        sequelize,
        modelName: "OrderPromotion",
        tableName: "order_promotions",

        timestamps: false,

        indexes: [
            {
                unique: true,
                fields: ["order_id", "promotion_id"],
            },
        ],
    },
);

export default OrderPromotion;