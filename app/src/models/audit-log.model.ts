// app/src/models/audit-log.model.ts

/**
 * Modelo de Auditoría
 * -------------------
 * Este archivo define el modelo `AuditLog` de Sequelize,
 * que representa la tabla `audit_logs` en la base de datos.
 *
 * Registra todas las acciones importantes realizadas por los
 * usuarios dentro del sistema para fines de auditoría y seguridad.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface AuditLogAttributes {
    id: number;
    userId: number;
    action: string;
    entityType: string;
    entityId: string;
    ipAddress: string;
    createdAt?: Date;
}

/**
 * Atributos para creación.
 */
export interface AuditLogCreationAttributes
    extends Optional<AuditLogAttributes, "id" | "createdAt"> {}

/**
 * Clase del modelo AuditLog.
 */
class AuditLog
    extends Model<AuditLogAttributes, AuditLogCreationAttributes>
    implements AuditLogAttributes
{
    /** Identificador del registro. */
    public id!: number;

    /** Usuario que realizó la acción. */
    public userId!: number;

    /** Acción realizada. */
    public action!: string;

    /** Tipo de entidad afectada. */
    public entityType!: string;

    /** Identificador de la entidad afectada. */
    public entityId!: string;

    /** Dirección IP desde donde se realizó la acción. */
    public ipAddress!: string;

    /** Fecha del evento. */
    public createdAt!: Date;
}

/**
 * Inicialización del modelo.
 */
AuditLog.init(
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

        action: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        entityType: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: "entity_type",
        },

        entityId: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: "entity_id",
        },

        ipAddress: {
            type: DataTypes.STRING(45),
            allowNull: false,
            field: "ip_address",
        },
    },
    {
        sequelize,
        modelName: "AuditLog",
        tableName: "audit_logs",

        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
    },
);

export default AuditLog;