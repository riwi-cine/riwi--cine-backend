// app/src/models/user-role.model.ts

/**
 * Modelo de Rol de Usuario
 * ------------------------
 * Este archivo define el modelo `UserRole` de Sequelize, que representa
 * la tabla `user_roles` en la base de datos.
 *
 * Permite asignar uno o varios roles a un usuario.
 * Además registra la fecha en que fue asignado el rol.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface UserRoleAttributes {
    id: number;
    userId: number;
    roleId: number;
    assignedAt: Date;
}

/**
 * Atributos para creación.
 */
export interface UserRoleCreationAttributes
    extends Optional<UserRoleAttributes, "id" | "assignedAt"> {}

/**
 * Clase del modelo UserRole.
 */
class UserRole
    extends Model<UserRoleAttributes, UserRoleCreationAttributes>
    implements UserRoleAttributes
{
    /** Identificador del registro. */
    public id!: number;

    /** Usuario al que pertenece el rol. */
    public userId!: number;

    /** Rol asignado. */
    public roleId!: number;

    /** Fecha de asignación del rol. */
    public assignedAt!: Date;
}

/**
 * Inicialización del modelo.
 */
UserRole.init(
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

        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "role_id",
        },

        assignedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "assigned_at",
        },
    },
    {
        sequelize,
        modelName: "UserRole",
        tableName: "user_roles",
        timestamps: false,

        indexes: [
            {
                unique: true,
                fields: ["user_id", "role_id"],
            },
        ],
    },
);

export default UserRole;