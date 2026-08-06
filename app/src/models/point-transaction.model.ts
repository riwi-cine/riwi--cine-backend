// app/src/models/point-transaction.model.ts

/**
 * Modelo de Transacción de Puntos
 * -------------------------------
 * Este archivo define el modelo `PointTransaction` de Sequelize,
 * que representa la tabla `points_transactions` en la base de datos.
 *
 * Registra cada movimiento de puntos realizado por una membresía,
 * ya sea acumulación, redención o ajuste.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface PointTransactionAttributes {
    id: number;
    membershipId: number;
    orderId: number;
    points: number;
    type: string;
    expiresAt: Date;
    createdAt?: Date;
}

/**
 * Atributos para creación.
 */
export interface PointTransactionCreationAttributes
    extends Optional<PointTransactionAttributes, "id" | "createdAt"> {}

/**
 * Clase del modelo PointTransaction.
 */
class PointTransaction
    extends Model<
        PointTransactionAttributes,
        PointTransactionCreationAttributes
    >
    implements PointTransactionAttributes
{
    /** Identificador de la transacción. */
    public id!: number;

    /** Membresía asociada. */
    public membershipId!: number;

    /** Orden asociada. */
    public orderId!: number;

    /** Cantidad de puntos. */
    public points!: number;

    /** Tipo de transacción. */
    public type!: string;

    /** Fecha de expiración de los puntos. */
    public expiresAt!: Date;

    /** Fecha de creación del registro. */
    public createdAt?: Date;
}

/**
 * Inicialización del modelo.
 */
PointTransaction.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        membershipId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "membership_id",
        },

        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "order_id",
        },

        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        type: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },

        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "expires_at",
        },
    },
    {
        sequelize,
        modelName: "PointTransaction",
        tableName: "points_transactions",

        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
    },
);

export default PointTransaction;