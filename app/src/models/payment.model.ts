// app/src/models/payment.model.ts

/**
 * Modelo de Pago
 * --------------
 * Este archivo define el modelo `Payment` de Sequelize,
 * que representa la tabla `payments` en la base de datos.
 *
 * Registra cada intento o confirmación de pago realizado
 * para una orden.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface PaymentAttributes {
    id: number;
    orderId: number;
    method: string;
    amount: number;
    status: string;
    gatewayReference: string;
    idempotencyKey: string;
    paidAt: Date;
}

/**
 * Atributos para creación.
 */
export interface PaymentCreationAttributes
    extends Optional<PaymentAttributes, "id"> {}

/**
 * Clase del modelo Payment.
 */
class Payment
    extends Model<PaymentAttributes, PaymentCreationAttributes>
    implements PaymentAttributes
{
    /** Identificador del pago. */
    public id!: number;

    /** Orden asociada al pago. */
    public orderId!: number;

    /** Método de pago utilizado. */
    public method!: string;

    /** Valor pagado. */
    public amount!: number;

    /** Estado del pago. */
    public status!: string;

    /** Referencia devuelta por la pasarela de pago. */
    public gatewayReference!: string;

    /** Llave para evitar pagos duplicados. */
    public idempotencyKey!: string;

    /** Fecha y hora de confirmación del pago. */
    public paidAt!: Date;
}

/**
 * Inicialización del modelo.
 */
Payment.init(
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

        method: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },

        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },

        gatewayReference: {
            type: DataTypes.STRING(150),
            allowNull: false,
            field: "gateway_reference",
        },

        idempotencyKey: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            field: "idempotency_key",
        },

        paidAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "paid_at",
        },
    },
    {
        sequelize,
        modelName: "Payment",
        tableName: "payments",

        timestamps: false,
    },
);

export default Payment;