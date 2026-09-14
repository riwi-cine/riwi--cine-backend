// app/src/models/refresh-token.model.ts

/**
 * Modelo de Refresh Token
 * -----------------------
 * Este archivo define el modelo `RefreshToken` de Sequelize,
 * que representa la tabla `refresh_tokens` en la base de datos.
 *
 * Almacena los refresh tokens utilizados para renovar el JWT
 * sin necesidad de que el usuario vuelva a iniciar sesión.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface RefreshTokenAttributes {
    id: number;
    userId: number;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt?: Date;
}

/**
 * Atributos para creación.
 */
export interface RefreshTokenCreationAttributes
    extends Optional<
        RefreshTokenAttributes,
        "id" | "revokedAt" | "createdAt"
    > {}

/**
 * Clase del modelo RefreshToken.
 */
class RefreshToken
    extends Model<
        RefreshTokenAttributes,
        RefreshTokenCreationAttributes
    >
    implements RefreshTokenAttributes
{
    /** Identificador del token. */
    public id!: number;

    /** Usuario propietario del token. */
    public userId!: number;

    /** Hash del refresh token. */
    public tokenHash!: string;

    /** Fecha de expiración. */
    public expiresAt!: Date;

    /** Fecha de revocación. */
    public revokedAt!: Date | null;

    /** Fecha de creación. */
    public createdAt!: Date;
}

/**
 * Inicialización del modelo.
 */
RefreshToken.init(
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

        tokenHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            field: "token_hash",
        },

        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "expires_at",
        },

        revokedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "revoked_at",
        },
    },
    {
        sequelize,
        modelName: "RefreshToken",
        tableName: "refresh_tokens",

        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
    },
);

export default RefreshToken;