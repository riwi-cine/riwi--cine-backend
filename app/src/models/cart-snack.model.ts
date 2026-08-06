// app/src/models/cart-snack.model.ts

/**
 * Modelo de Snacks del Carrito
 * ----------------------------
 * Este archivo define el modelo `CartSnack` de Sequelize,
 * que representa la tabla `cart_snacks` en la base de datos.
 *
 * Cada registro representa un snack agregado por un usuario
 * a un carrito específico.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface CartSnackAttributes {
    id: number;
    cartId: number;
    snackId: number;
    cinemaId: number;
    quantity: number;
    unitPrice: number;
}

/**
 * Atributos para creación.
 */
export interface CartSnackCreationAttributes
    extends Optional<CartSnackAttributes, "id"> {}

/**
 * Clase del modelo CartSnack.
 */
class CartSnack
    extends Model<CartSnackAttributes, CartSnackCreationAttributes>
    implements CartSnackAttributes
{
    /** Identificador del registro. */
    public id!: number;

    /** Carrito asociado. */
    public cartId!: number;

    /** Snack agregado. */
    public snackId!: number;

    /** Cine donde se venderá el snack. */
    public cinemaId!: number;

    /** Cantidad agregada. */
    public quantity!: number;

    /** Precio unitario al momento de agregarlo. */
    public unitPrice!: number;
}

/**
 * Inicialización del modelo.
 */
CartSnack.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        cartId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "cart_id",
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
            defaultValue: 1,
        },

        unitPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: "unit_price",
        },
    },
    {
        sequelize,
        modelName: "CartSnack",
        tableName: "cart_snacks",

        timestamps: false,
    },
);

export default CartSnack;