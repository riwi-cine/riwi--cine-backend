// app/src/models/activation-token.model.ts

/**
 * Modelo de Token de Activación
 * -----------------------------
 * Este archivo define el modelo `ActivationToken` de Sequelize,
 * que representa la tabla `activation_tokens` en la base de datos.
 *
 * Almacena los tokens utilizados para activar una cuenta de usuario
 * mediante un enlace enviado por correo electrónico.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface ActivationTokenAttributes {
    id: number;
    userId: number;
    token: string;
    expiresAt: Date;
    usedAt: Date | null;
}

/**
 * Atributos para creación.
 */
export interface ActivationTokenCreationAttributes
    extends Optional<ActivationTokenAttributes, "id" | "usedAt"> {}

/**
 * Clase del modelo ActivationToken.
 */
class ActivationToken
    extends Model<
        ActivationTokenAttributes,
        ActivationTokenCreationAttributes
    >
    implements ActivationTokenAttributes
{
    /** Identificador del token. */
    public id!: number;

    /** Usuario propietario del token. */
    public userId!: number;

    /** Token enviado por correo. */
    public token!: string;

    /** Fecha de expiración. */
    public expiresAt!: Date;

    /** Fecha en que fue utilizado. */
    public usedAt!: Date | null;
}

/**
 * Inicialización del modelo.
 */
ActivationToken.init(
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

        token: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },

        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "expires_at",
        },

        usedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "used_at",
        },
    },
    {
        sequelize,
        modelName: "ActivationToken",
        tableName: "activation_tokens",
        timestamps: false,
    },
);

export default ActivationToken;