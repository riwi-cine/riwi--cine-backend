import { Op } from "sequelize";
import Function from "../models/function.model";
import Room from "../models/room.model";
import Seat from "../models/seat.model";
import SeatLock from "../models/seat-lock.model";
import Ticket from "../models/ticket.model";
import { ISeatRepository } from "./interfaces/seat.repository.interface";

/**
 * Estados de ticket que dejan una silla ocupada de forma definitiva.
 * Cualquier ticket en uno de estos estados hace que la silla sea "Vendida".
 */
const OCCUPYING_TICKET_STATUSES = ["SOLD", "PAID", "USED", "SCANNED"];

/**
 * Repository de Sillas (HU-010)
 * ----------------------------
 * Única capa responsable de hablar con Sequelize para el mapa de la sala
 * y para el ciclo de vida de los bloqueos temporales (`seat_locks`).
 */
class SeatRepository implements ISeatRepository {
    async findFunctionForSelection(functionId: number): Promise<any | null> {
        return await Function.findOne({
            where: {
                id: functionId,
                active: true,
                startsAt: {
                    [Op.gt]: new Date(),
                },
            },
            include: [
                {
                    model: Room,
                    as: "room",
                },
            ],
        });
    }

    async findSeatsByRoom(roomId: number): Promise<Seat[]> {
        return await Seat.findAll({
            where: { roomId },
            order: [
                ["row", "ASC"],
                ["id", "ASC"],
            ],
        });
    }

    async findSeatsByIds(seatIds: number[]): Promise<Seat[]> {
        if (seatIds.length === 0) {
            return [];
        }
        return await Seat.findAll({
            where: {
                id: {
                    [Op.in]: seatIds,
                },
            },
        });
    }

    async findSoldSeatIds(functionId: number): Promise<number[]> {
        const tickets = await Ticket.findAll({
            where: {
                functionId,
                status: {
                    [Op.in]: OCCUPYING_TICKET_STATUSES,
                },
            },
        });
        return tickets.map((ticket: any) => ticket.seatId);
    }

    async findActiveLocks(functionId: number, seatIds?: number[]): Promise<SeatLock[]> {
        const where: any = {
            functionId,
            expiresAt: {
                [Op.gt]: new Date(),
            },
        };
        if (seatIds && seatIds.length > 0) {
            where.seatId = { [Op.in]: seatIds };
        }
        return await SeatLock.findAll({ where });
    }

    async findCartLocks(
        functionId: number,
        cartId: number,
        seatIds?: number[],
    ): Promise<SeatLock[]> {
        const where: any = {
            functionId,
            cartId,
            expiresAt: {
                [Op.gt]: new Date(),
            },
        };
        if (seatIds && seatIds.length > 0) {
            where.seatId = { [Op.in]: seatIds };
        }
        return await SeatLock.findAll({ where });
    }

    async deleteExpiredLocks(functionId: number, seatIds: number[]): Promise<number> {
        if (seatIds.length === 0) {
            return 0;
        }
        return await SeatLock.destroy({
            where: {
                functionId,
                seatId: {
                    [Op.in]: seatIds,
                },
                expiresAt: {
                    [Op.lte]: new Date(),
                },
            },
        });
    }

    async refreshLocks(
        functionId: number,
        cartId: number,
        seatIds: number[],
        expiresAt: Date,
    ): Promise<void> {
        if (seatIds.length === 0) {
            return;
        }
        await SeatLock.update(
            { expiresAt },
            {
                where: {
                    functionId,
                    cartId,
                    seatId: {
                        [Op.in]: seatIds,
                    },
                },
            },
        );
    }

    async createLocksIgnoreDuplicates(
        rows: { cartId: number; functionId: number; seatId: number; expiresAt: Date }[],
    ): Promise<void> {
        if (rows.length === 0) {
            return;
        }
        await SeatLock.bulkCreate(rows, { ignoreDuplicates: true });
    }

    async deleteCartLocks(
        functionId: number,
        cartId: number,
        seatIds?: number[],
    ): Promise<number> {
        const where: any = { functionId, cartId };
        if (seatIds && seatIds.length > 0) {
            where.seatId = { [Op.in]: seatIds };
        }
        return await SeatLock.destroy({ where });
    }
}

export default new SeatRepository();
