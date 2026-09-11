// app/src/models/ticket-transfer.model.ts

/**
 * Modelo de Transferencia de Ticket
 * ----------------------------------
 * Representa la tabla `ticket_transfers` de la base de datos.
 *
 * Registra las transferencias de boletos entre usuarios.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de TicketTransfer.
 */
export interface TicketTransferAttributes {
    id: number;
    ticketId: number;
    fromUserId: number;
    toUserId: number;
    status: string;
    requestedAt: Date;
    respondedAt: Date | null;
}

/**
 * Atributos utilizados al crear una transferencia.
 *
 * El id es generado automáticamente.
 * respondedAt puede ser null mientras la transferencia
 * todavía está pendiente.
 */
export interface TicketTransferCreationAttributes
    extends Optional<TicketTransferAttributes, "id" | "respondedAt"> {}

/**
 * Clase que representa el modelo TicketTransfer.
 */
class TicketTransfer
    extends Model<
        TicketTransferAttributes,
        TicketTransferCreationAttributes
    >
    implements TicketTransferAttributes
{
    /** Identificador único de la transferencia. */
    public id!: number;

    /** Ticket que se está transfiriendo. */
    public ticketId!: number;

    /** Usuario que inicia la transferencia. */
    public fromUserId!: number;

    /** Usuario que recibe el ticket. */
    public toUserId!: number;

    /** Estado de la transferencia. */
    public status!: string;

    /** Fecha y hora en que se solicitó la transferencia. */
    public requestedAt!: Date;

    /** Fecha y hora en que se respondió la transferencia. */
    public respondedAt!: Date | null;
}

/**
 * Inicialización del modelo TicketTransfer.
 */
TicketTransfer.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        ticketId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "ticket_id",
        },

        fromUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "from_user_id",
        },

        toUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "to_user_id",
        },

        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },

        requestedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "requested_at",
        },

        respondedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "responded_at",
        },
    },
    {
        sequelize,
        modelName: "TicketTransfer",
        tableName: "ticket_transfers",

        // El MER no define created_at ni updated_at.
        timestamps: false,
    },
);

export default TicketTransfer;