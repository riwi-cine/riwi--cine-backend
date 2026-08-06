// app/src/models/order-snack.model.ts

/**
 * Modelo de Snacks de la Orden
 * ----------------------------
 * Este archivo define el modelo `OrderSnack` de Sequelize,
 * que representa la tabla `order_snacks` en la base de datos.
 *
 * Almacena los snacks comprados dentro de una orden,
 * conservando el precio y la cantidad al momento de la compra.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface OrderSnackAttributes {
    id: number;
    orderId: number;
    snackId: number;
    cinemaId: number;
    quantity: number;
    unitPrice: number;
}

/**
 * Atributos para creación.
 */
export interface OrderSnackCreationAttributes
    extends Optional<OrderSnackAttributes, "id"> {}

/**
 * Clase del modelo OrderSnack.
 */
class OrderSnack
    extends Model<OrderSnackAttributes, OrderSnackCreationAttributes>
    implements OrderSnackAttributes
{
    /** Identificador del registro. */
    public id!: number;

    /** Orden asociada. */
    public orderId!: number;

    /** Snack comprado. */
    public snackId!: number;

    /** Cine donde fue adquirido. */
    public cinemaId!: number;

    /** Cantidad comprada. */
    public quantity!: number;

    /** Precio unitario al momento de la compra. */
    public unitPrice!: number;
}

/**
 * Inicialización del modelo.
 */
OrderSnack.init(
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

        snackId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "snack_id",
        },

        cinemaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "cinema_id",
        },

        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        unitPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: "unit_price",
        },
    },
    {
        sequelize,
        modelName: "OrderSnack",
        tableName: "order_snacks",

        timestamps: false,
    },
);

export default OrderSnack;