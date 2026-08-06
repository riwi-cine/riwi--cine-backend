// app/src/models/role.model.ts

/**
 * Modelo de Rol
 * -------------
 * Este archivo define el modelo `Role` de Sequelize, que representa
 * la tabla `roles` en la base de datos.
 *
 * Un rol define el conjunto de permisos que puede tener un usuario
 * dentro de la plataforma.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad Role.
 */
export interface RoleAttributes {
    id: number;
    name: string;
    description: string;
}

/**
 * Atributos utilizados durante la creación.
 */
export interface RoleCreationAttributes
    extends Optional<RoleAttributes, "id"> {}

/**
 * Clase que representa el modelo Role.
 */
class Role
    extends Model<RoleAttributes, RoleCreationAttributes>
    implements RoleAttributes
{
    /** Identificador único del rol. */
    public id!: number;

    /** Nombre del rol. */
    public name!: string;

    /** Descripción del rol. */
    public description!: string;
}

/**
 * Inicialización del modelo Role.
 */
Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },

        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Role",
        tableName: "roles",
        timestamps: false,
    },
);

export default Role;