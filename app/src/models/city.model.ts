// app/src/models/city.model.ts

/**
 * Modelo de Ciudad
 * ----------------
 * Este archivo define el modelo `City` de Sequelize, que representa la tabla
 * `cities` en la base de datos.
 *
 * Contiene:
 *  - Atributos del modelo (`CityAttributes`).
 *  - Atributos requeridos para la creación (`CityCreationAttributes`).
 *  - Definición del modelo con sus columnas y restricciones.
 *
 * Cada ciudad pertenece a un departamento.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad `City`.
 */
export interface CityAttributes {
    id: number;
    departmentId: number;
    name: string;
    active: boolean;
}

/**
 * Atributos utilizados para la creación de una nueva ciudad.
 */
export interface CityCreationAttributes
    extends Optional<CityAttributes, "id"> {}

/**
 * Clase que representa el modelo `City`.
 */
class City
    extends Model<CityAttributes, CityCreationAttributes>
    implements CityAttributes
{
    /** Identificador único de la ciudad. */
    public id!: number;

    /** Departamento al que pertenece la ciudad. */
    public departmentId!: number;

    /** Nombre de la ciudad. */
    public name!: string;

    /** Estado de la ciudad. */
    public active!: boolean;
}

/**
 * Inicialización del modelo `City`.
 */
City.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "department_id",
        },

        name: {
            type: DataTypes.STRING(100),
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
        modelName: "City",
        tableName: "cities",
        timestamps: false,
    },
);

export default City;