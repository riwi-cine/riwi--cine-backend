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
import  {hash_password}  from "../utils/auth";

/**
 * Atributos principales de la entidad User.
 */
export interface UserAttributes {
    id: number;
    countryId: number;
    cityId: number | null;
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
    role: string;
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
        | "cityId"
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

    /** Ciudad seleccionada para personalizar la experiencia. */
    public cityId!: number | null;

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

    /** Rol del usuario. */
    public role!: string;
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

        cityId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "city_id",
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
            type: DataTypes.STRING(50),
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

        role: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "user",
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: true,
        paranoid: true,
        hooks: {
            beforeCreate: async (user: User) => {
                if (user.passwordHash) {
                    user.passwordHash = await hash_password(user.passwordHash);
                }
            },
            beforeUpdate: async (user: User) => {
                if (user.passwordHash) {
                    user.passwordHash = await hash_password(user.passwordHash);
                } },
        },
    },
);

export default User;
