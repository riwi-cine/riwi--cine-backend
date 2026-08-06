// app/src/models/department.model.ts

/**
 * Modelo de Departamento
 * ----------------------
 * Este archivo define el modelo `Department` de Sequelize, que representa la tabla
 * `departments` en la base de datos.
 *
 * Contiene:
 *  - Atributos del modelo (`DepartmentAttributes`).
 *  - Atributos requeridos para la creación (`DepartmentCreationAttributes`).
 *  - Definición del modelo con sus columnas y restricciones.
 *
 * Cada departamento pertenece a un país.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad `Department`.
 */
export interface DepartmentAttributes {
    id: number;
    countryId: number;
    name: string;
    active: boolean;
}

/**
 * Atributos utilizados para la creación de un nuevo departamento.
 */
export interface DepartmentCreationAttributes
    extends Optional<DepartmentAttributes, "id"> {}

/**
 * Clase que representa el modelo `Department`.
 */
class Department
    extends Model<DepartmentAttributes, DepartmentCreationAttributes>
    implements DepartmentAttributes
{
    /** Identificador único del departamento. */
    public id!: number;

    /** País al que pertenece. */
    public countryId!: number;

    /** Nombre del departamento. */
    public name!: string;

    /** Estado del departamento. */
    public active!: boolean;
}

/**
 * Inicialización del modelo `Department`.
 */
Department.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        countryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "country_id",
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
        modelName: "Department",
        tableName: "departments",
        timestamps: false,
    },
);

export default Department;