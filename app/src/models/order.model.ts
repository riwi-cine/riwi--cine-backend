// app/src/models/order.model.ts

/**
 * Modelo de Orden
 * ---------------
 * Este archivo define el modelo `Order` de Sequelize,
 * que representa la tabla `orders` en la base de datos.
 *
 * Una orden representa una compra realizada por un usuario,
 * incluyendo el total, descuentos y estado del proceso de pago.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface OrderAttributes {
    id: number;
    userId: number;
    cartId: number;
    status: string;
    subtotal: number;
    discount: number;
    total: number;
    createdAt?: Date;
}

/**
 * Atributos para creación.
 */
export interface OrderCreationAttributes
    extends Optional<OrderAttributes, "id" | "createdAt"> {}

/**
 * Clase del modelo Order.
 */
class Order
    extends Model<OrderAttributes, OrderCreationAttributes>
    implements OrderAttributes
{
    /** Identificador de la orden. */
    public id!: number;

    /** Usuario que realizó la compra. */
    public userId!: number;

    /** Carrito del cual se generó la orden. */
    public cartId!: number;

    /** Estado de la orden. */
    public status!: string;

    /** Subtotal antes de descuentos. */
    public subtotal!: number;

    /** Valor total descontado. */
    public discount!: number;

    /** Total final pagado. */
    public total!: number;

    /** Fecha de creación. */
    public createdAt?: Date;
}

/**
 * Inicialización del modelo.
 */
Order.init(
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

        cartId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "cart_id",
        },

        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },

        subtotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },

        discount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },

        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Order",
        tableName: "orders",

        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
    },
);

export default Order;