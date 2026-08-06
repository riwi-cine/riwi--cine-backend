// app/src/models/snack.model.ts

/**
 * Modelo de Snack
 * ---------------
 * Este archivo define el modelo `Snack` de Sequelize,
 * que representa la tabla `snacks` en la base de datos.
 *
 * Almacena los productos de confitería disponibles
 * para su venta en la plataforma.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface SnackAttributes {
    id: number;
    name: string;
    category: string;
    active: boolean;
}

/**
 * Atributos para creación.
 */
export interface SnackCreationAttributes
    extends Optional<SnackAttributes, "id"> {}

/**
 * Clase del modelo Snack.
 */
class Snack
    extends Model<SnackAttributes, SnackCreationAttributes>
    implements SnackAttributes
{
    /** Identificador del snack. */
    public id!: number;

    /** Nombre del producto. */
    public name!: string;

    /** Categoría del producto. */
    public category!: string;

    /** Indica si el producto está disponible. */
    public active!: boolean;
}

/**
 * Inicialización del modelo.
 */
Snack.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        category: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: "Snack",
        tableName: "snacks",

        timestamps: false,
    },
);

export default Snack;