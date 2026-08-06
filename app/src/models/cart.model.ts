// app/src/models/cart.model.ts

/**
 * Modelo de Carrito
 * -----------------
 * Este archivo define el modelo `Cart` de Sequelize,
 * que representa la tabla `carts` en la base de datos.
 *
 * Un carrito pertenece a un usuario y almacena temporalmente
 * los productos y boletos antes de generar una orden.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface CartAttributes {
    id: number;
    userId: number;
    status: string;
    expiresAt: Date;
    createdAt?: Date;
}

/**
 * Atributos para creación.
 */
export interface CartCreationAttributes
    extends Optional<CartAttributes, "id" | "createdAt"> {}

/**
 * Clase del modelo Cart.
 */
class Cart
    extends Model<CartAttributes, CartCreationAttributes>
    implements CartAttributes
{
    /** Identificador del carrito. */
    public id!: number;

    /** Usuario propietario. */
    public userId!: number;

    /** Estado del carrito. */
    public status!: string;

    /** Fecha de expiración. */
    public expiresAt!: Date;

    /** Fecha de creación. */
    public createdAt?: Date;
}

/**
 * Inicialización del modelo.
 */
Cart.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "user_id",
        },

        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },

        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "expires_at",
        },
    },
    {
        sequelize,
        modelName: "Cart",
        tableName: "carts",

        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
    },
);

export default Cart;