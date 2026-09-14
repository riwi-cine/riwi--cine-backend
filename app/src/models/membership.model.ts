// app/src/models/membership.model.ts

/**
 * Modelo de Membresía
 * -------------------
 * Este archivo define el modelo `Membership` de Sequelize,
 * que representa la tabla `memberships` en la base de datos.
 *
 * Cada usuario puede tener una membresía asociada para
 * acumular y redimir puntos dentro de la plataforma.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface MembershipAttributes {
    id: number;
    userId: number;
    code: string;
    level: string;
    status: string;
    createdAt?: Date;
}

/**
 * Atributos para creación.
 */
export interface MembershipCreationAttributes
    extends Optional<MembershipAttributes, "id" | "createdAt"> {}

/**
 * Clase del modelo Membership.
 */
class Membership
    extends Model<MembershipAttributes, MembershipCreationAttributes>
    implements MembershipAttributes
{
    /** Identificador de la membresía. */
    public id!: number;

    /** Usuario propietario. */
    public userId!: number;

    /** Código único de membresía. */
    public code!: string;

    /** Nivel de la membresía. */
    public level!: string;

    /** Estado actual. */
    public status!: string;

    /** Fecha de creación. */
    public createdAt?: Date;
}

/**
 * Inicialización del modelo.
 */
Membership.init(
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

        code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },

        level: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },

        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Membership",
        tableName: "memberships",

        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
    },
);

export default Membership;