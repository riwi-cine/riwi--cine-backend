// app/src/models/pqrs.model.ts

/**
 * Modelo de PQRS
 * --------------
 * Este archivo define el modelo `PQRS` de Sequelize,
 * que representa la tabla `pqrs` en la base de datos.
 *
 * Permite registrar las Peticiones, Quejas, Reclamos y
 * Sugerencias realizadas por los usuarios.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface PQRSAttributes {
    id: number;
    userId: number;
    consecutiveNumber: number;
    category: string;
    status: string;
    slaDueAt: Date;
    createdAt?: Date;
}

/**
 * Atributos para creación.
 */
export interface PQRSCreationAttributes
    extends Optional<PQRSAttributes, "id" | "createdAt"> {}

/**
 * Clase del modelo PQRS.
 */
class PQRS
    extends Model<PQRSAttributes, PQRSCreationAttributes>
    implements PQRSAttributes
{
    /** Identificador del caso. */
    public id!: number;

    /** Usuario que creó el caso. */
    public userId!: number;

    /** Número consecutivo del caso. */
    public consecutiveNumber!: number;

    /** Categoría del caso. */
    public category!: string;

    /** Estado actual del caso. */
    public status!: string;

    /** Fecha límite de atención según SLA. */
    public slaDueAt!: Date;

    /** Fecha de creación del caso. */
    public createdAt?: Date;
}

/**
 * Inicialización del modelo.
 */
PQRS.init(
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

        consecutiveNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            field: "consecutive_number",
        },

        category: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },

        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },

        slaDueAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "sla_due_at",
        },
    },
    {
        sequelize,
        modelName: "PQRS",
        tableName: "pqrs",

        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
    },
);

export default PQRS;