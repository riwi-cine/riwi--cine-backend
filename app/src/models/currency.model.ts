// app/src/models/currency.model.ts

/**
 * Modelo de Moneda
 * ----------------
 * Este archivo define el modelo `Currency` de Sequelize, que representa
 * la tabla `currencies` en la base de datos.
 *
 * Cada moneda puede estar asociada a uno o varios países.
 *
 * Ejemplos:
 * - Peso Colombiano (COP)
 * - Peso Mexicano (MXN)
 * - Dólar Estadounidense (USD)
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad `Currency`.
 */
export interface CurrencyAttributes {
    id: number;
    code: string;
    symbol: string;
    name: string;
}

/**
 * Atributos utilizados durante la creación.
 */
export interface CurrencyCreationAttributes
    extends Optional<CurrencyAttributes, "id"> {}

/**
 * Clase que representa el modelo Currency.
 */
class Currency
    extends Model<CurrencyAttributes, CurrencyCreationAttributes>
    implements CurrencyAttributes
{
    /** Identificador único de la moneda. */
    public id!: number;

    /** Código ISO (COP, USD, MXN...). */
    public code!: string;

    /** Símbolo de la moneda ($, €, etc.). */
    public symbol!: string;

    /** Nombre de la moneda. */
    public name!: string;
}

/**
 * Inicialización del modelo.
 */
Currency.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        code: {
            type: DataTypes.STRING(3),
            allowNull: false,
            unique: true,
        },

        symbol: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Currency",
        tableName: "currencies",
        timestamps: true,
        paranoid: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
    },
);

export default Currency;