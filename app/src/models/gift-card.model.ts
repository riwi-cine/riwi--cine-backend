// app/src/models/gift-card.model.ts

/**
 * Modelo de Gift Card
 * -------------------
 * Este archivo define el modelo `GiftCard` de Sequelize,
 * que representa la tabla `gift_cards` en la base de datos.
 *
 * Una Gift Card almacena el saldo disponible para ser utilizado
 * como método de pago en futuras compras.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface GiftCardAttributes {
    id: number;
    buyerUserId: number;
    code: string;
    initialValue: number;
    balance: number;
    recipientEmail: string;
    expiresAt: Date | string;
    status: string;
}

/**
 * Atributos para creación.
 */
export interface GiftCardCreationAttributes
    extends Optional<GiftCardAttributes, "id"> {}

/**
 * Clase del modelo GiftCard.
 */
class GiftCard
    extends Model<GiftCardAttributes, GiftCardCreationAttributes>
    implements GiftCardAttributes
{
    /** Identificador de la Gift Card. */
    public id!: number;

    /** Usuario que compró la Gift Card. */
    public buyerUserId!: number;

    /** Código único de la Gift Card. */
    public code!: string;

    /** Valor inicial cargado. */
    public initialValue!: number;

    /** Saldo disponible actual. */
    public balance!: number;

    /** Correo del destinatario. */
    public recipientEmail!: string;

    /** Fecha de expiración. */
    public expiresAt!: Date | string;

    /** Estado de la Gift Card. */
    public status!: string;
}

/**
 * Inicialización del modelo.
 */
GiftCard.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        buyerUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "buyer_user_id",
        },

        code: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },

        initialValue: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: "initial_value",
        },

        balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },

        recipientEmail: {
            type: DataTypes.STRING(150),
            allowNull: false,
            field: "recipient_email",
        },

        expiresAt: {
            type: DataTypes.DATE,   
            allowNull: false,
            field: "expires_at",
        },

        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
    },
    {
        sequelize: sequelize as any,
        modelName: "GiftCard",
        tableName: "gift_cards",
        timestamps: false,
    },
);

export default GiftCard;