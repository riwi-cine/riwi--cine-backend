// app/src/models/user.model.ts

/**
 * Modelo de Usuario
 * -----------------
 * Este archivo define el modelo `User` de Sequelize, que representa
 * la tabla `users` en la base de datos.
 *
 * Un usuario representa cualquier persona registrada en la plataforma,
 * ya sea un cliente, administrador o empleado del cine.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad User.
 */
export interface UserAttributes {
    id: number;
    countryId: number;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone: string;
    birthDate: Date;
    emailVerified: boolean;
    marketingOptIn: boolean;
    status: string;
    failedAttempts: number;
    lockedUntil: Date | null;
}

/**
 * Atributos utilizados durante la creación.
 */
export interface UserCreationAttributes
    extends Optional<
        UserAttributes,
        | "id"
        | "emailVerified"
        | "countryId"
        | "status"
        | "marketingOptIn"
        | "failedAttempts"
        | "lockedUntil"
    > {}

/**
 * Clase que representa el modelo User.
 */
class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
{
    /** Identificador del usuario. */
    public id!: number;

    /** País de residencia. */
    public countryId!: number;

    /** Correo electrónico. */
    public email!: string;

    /** Hash de la contraseña. */
    public passwordHash!: string;

    /** Nombre del usuario. */
    public firstName!: string;

    /** Apellido del usuario. */
    public lastName!: string;

    /** Número telefónico. */
    public phone!: string;

    /** Fecha de nacimiento. */
    public birthDate!: Date;

    /** Indica si el correo fue verificado. */
    public emailVerified!: boolean;

    /** Aceptación de marketing. */
    public marketingOptIn!: boolean;

    /** Estado de la cuenta. */
    public status!: string;

    /** Intentos fallidos de login. */
    public failedAttempts!: number;

    /** Fecha hasta la que permanece bloqueada la cuenta. */
    public lockedUntil!: Date | null;
}

/**
 * Inicialización del modelo User.
 */
User.init(
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

        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },

        passwordHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: "password_hash",
        },

        firstName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "first_name",
        },

        lastName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "last_name",
        },

        phone: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },

        birthDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            field: "birth_date",
        },

        emailVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: "email_verified",
        },

        marketingOptIn: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: "marketing_opt_in",
        },

        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "ACTIVE",
        },

        failedAttempts: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: "failed_attempts",
        },

        lockedUntil: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "locked_until",
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
    },
);

export default User;