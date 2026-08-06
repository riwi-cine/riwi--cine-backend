// app/src/models/country.model.ts

/**
 * Modelo de País
 * -----------------
 * Este archivo define el modelo `Country` de Sequelize, que representa la tabla
 * `countries` en la base de datos.
 *
 * Contiene:
 *  - Atributos del modelo (`CountryAttributes`).
 *  - Atributos requeridos para la creación (`CountryCreationAttributes`).
 *  - Definición del modelo con sus columnas y restricciones.
 *
 * Este modelo será utilizado por la entidad Department, ya que un país
 * puede tener múltiples departamentos.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad `Country`.
 */
export interface CountryAttributes {
    id: number;
    currencyId: number;
    name: string;
    code: string;
    active: boolean;
}

/**
 * Atributos utilizados para la creación de un nuevo país.
 *
 * Se utiliza `Optional` para indicar que `id` no es requerido al momento
 * de la creación, ya que es generado automáticamente por la base de datos.
 */
export interface CountryCreationAttributes
    extends Optional<CountryAttributes, "id"> {}

/**
 * Clase que representa el modelo `Country` en Sequelize.
 *
 * Implementa los atributos definidos en `CountryAttributes`
 * y `CountryCreationAttributes`.
 */
class Country
    extends Model<CountryAttributes, CountryCreationAttributes>
    implements CountryAttributes
{
    /** Identificador único del país. */
    public id!: number;

    /** Moneda utilizada por el país. */
    public currencyId!: number;

    /** Nombre del país. */
    public name!: string;

    /** Código ISO del país. */
    public code!: string;

    /** Estado del país (activo/inactivo). */
    public active!: boolean;
}

/**
 * Inicialización del modelo `Country`.
 */
Country.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        currencyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "currency_id",
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },

        code: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
        },

        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: "Country",
        tableName: "countries",
        timestamps: false,
    },
);

export default Country;