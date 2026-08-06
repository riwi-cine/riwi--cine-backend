// app/src/models/gift-card-redemption.model.ts

/**
 * Modelo de Redención de Gift Card
 * -------------------------------
 * Este archivo define el modelo `GiftCardRedemption` de Sequelize,
 * que representa la tabla `gift_card_redemptions` en la base de datos.
 *
 * Cada registro representa un uso (total o parcial)
 * de una Gift Card para pagar una orden.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface GiftCardRedemptionAttributes {
    id: number;
    giftCardId: number;
    orderId: number;
    amountUsed: number;
    redeemedAt: Date;
}

/**
 * Atributos para creación.
 */
export interface GiftCardRedemptionCreationAttributes
    extends Optional<GiftCardRedemptionAttributes, "id"> {}

/**
 * Clase del modelo GiftCardRedemption.
 */
class GiftCardRedemption
    extends Model<
        GiftCardRedemptionAttributes,
        GiftCardRedemptionCreationAttributes
    >
    implements GiftCardRedemptionAttributes
{
    /** Identificador del movimiento. */
    public id!: number;

    /** Gift Card utilizada. */
    public giftCardId!: number;

    /** Orden pagada. */
    public orderId!: number;

    /** Valor utilizado. */
    public amountUsed!: number;

    /** Fecha del movimiento. */
    public redeemedAt!: Date;
}

/**
 * Inicialización del modelo.
 */
GiftCardRedemption.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        giftCardId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "gift_card_id",
        },

        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "order_id",
        },

        amountUsed: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: "amount_used",
        },

        redeemedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "redeemed_at",
        },
    },
    {
        sequelize,
        modelName: "GiftCardRedemption",
        tableName: "gift_card_redemptions",

        timestamps: false,
    },
);

export default GiftCardRedemption;