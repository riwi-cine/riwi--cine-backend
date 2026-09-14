// app/src/models/ticket.model.ts

/**
 * Modelo de Ticket
 * ----------------
 * Representa la tabla `tickets` de la base de datos.
 *
 * Un ticket representa una entrada comprada para una función
 * específica, asociada a un asiento y a un usuario titular.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales del Ticket.
 */
export interface TicketAttributes {
    id: number;
    orderId: number;
    functionId: number;
    seatId: number;
    holderUserId: number;
    qrCode: string;
    price: number;
    status: string;
    scannedByUserId: number | null;
    scannedAt: Date | null;
}

/**
 * Atributos utilizados al crear un Ticket.
 *
 * El id es generado automáticamente por la base de datos.
 * scannedByUserId y scannedAt pueden ser null porque el ticket
 * todavía puede no haber sido escaneado.
 */
export interface TicketCreationAttributes
    extends Optional<TicketAttributes, "id" | "scannedByUserId" | "scannedAt"> {}

/**
 * Clase que representa el modelo Ticket.
 */
class Ticket
    extends Model<TicketAttributes, TicketCreationAttributes>
    implements TicketAttributes
{
    /** Identificador único del ticket. */
    public id!: number;

    /** Orden que generó el ticket. */
    public orderId!: number;

    /** Función para la cual se compró el ticket. */
    public functionId!: number;

    /** Asiento asignado al ticket. */
    public seatId!: number;

    /** Usuario titular del ticket. */
    public holderUserId!: number;

    /** Código QR utilizado para validar el ingreso. */
    public qrCode!: string;

    /** Precio final pagado por el ticket. */
    public price!: number;

    /** Estado actual del ticket. */
    public status!: string;

    /** Usuario/operador que escaneó el ticket. */
    public scannedByUserId!: number | null;

    /** Fecha y hora en que fue escaneado. */
    public scannedAt!: Date | null;
}

/**
 * Inicialización del modelo Ticket.
 */
Ticket.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "order_id",
        },

        functionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "function_id",
        },

        seatId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "seat_id",
        },

        holderUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "holder_user_id",
        },

        qrCode: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            field: "qr_code",
        },

        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },

        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },

        scannedByUserId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "scanned_by_user_id",
        },

        scannedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "scanned_at",
        },
    },
    {
        sequelize,
        modelName: "Ticket",
        tableName: "tickets",

        // El MER no define created_at ni updated_at para tickets.
        timestamps: false,
    },
);

export default Ticket;