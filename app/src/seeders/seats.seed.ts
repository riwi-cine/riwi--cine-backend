// app/src/seeders/seats.seed.ts

/**
 * Seeder de Sillas — HU-010 (Selección Interactiva de Sillas)
 * =========================================================
 * Crea un escenario completo y aislado para probar los endpoints de la HU-010:
 *
 *   - GET    /api/functions/:id/seats
 *   - POST   /api/reservations/lock-seats
 *   - DELETE /api/reservations/release-seats
 *   - GET    /api/reservations/summary
 *
 * Genera:
 *   - Un cine y una sala ("Sala HU-010") con 40 sillas (filas A-E, 1-8).
 *   - Sillas de varias categorías: fila A preferencial (movilidad reducida),
 *     fila D VIP y el resto estándar.
 *   - Una película con su función futura y activa.
 *   - Un bloque de 10 sillas de demostración con 2 sillas en cada estado
 *     posible: AVAILABLE (B1, B2), SELECTED (B3, B4), LOCKED (B5, B6),
 *     SOLD (B7, B8) y DISABLED (C1, C2).
 *   - Un carrito "de otro usuario" (bloquea las sillas LOCKED) y un carrito
 *     de pruebas (bloquea las SELECTED y sirve como `cartId` para probar).
 *
 * Uso:
 *   npm run seed:seats
 *
 * Es idempotente: puede ejecutarse varias veces sin duplicar datos.
 */

import { Op } from "sequelize";
import sequelize from "../config/database";
import "../models/associations";
import Cart from "../models/cart.model";
import Cinema from "../models/cinema.model";
import City from "../models/city.model";
import Country from "../models/country.model";
import Currency from "../models/currency.model";
import Department from "../models/department.model";
import FunctionType from "../models/function-type.model";
import FunctionModel from "../models/function.model";
import MovieRelease from "../models/movie-release.model";
import Movie from "../models/movie.model";
import Order from "../models/order.model";
import RoomType from "../models/room-type.model";
import Room from "../models/room.model";
import SeatLock from "../models/seat-lock.model";
import Seat from "../models/seat.model";
import Ticket from "../models/ticket.model";
import User from "../models/user.model";

const ROWS = ["A", "B", "C", "D", "E"];
const SEATS_PER_ROW = 8;

/**
 * Bloque de 10 sillas de demostración: 2 sillas por cada estado posible.
 * Todas viven en las filas B y C (categoría STANDARD) para que el estado
 * mostrado no dependa de la categoría de la silla.
 */
const DEMO_SEATS = {
    AVAILABLE: ["B1", "B2"], // sin bloqueo ni ticket
    SELECTED: ["B3", "B4"], // bloqueadas por el carrito de pruebas
    LOCKED: ["B5", "B6"], // bloqueadas por "otro usuario"
    SOLD: ["B7", "B8"], // con ticket vendido
    DISABLED: ["C1", "C2"], // seat_type = DISABLED
};

/** Devuelve la categoría (`seat_type`) que le corresponde a una silla concreta. */
const seatTypeFor = (row: string, seatNumber: number): string => {
    const label = `${row}${seatNumber}`;
    if (DEMO_SEATS.DISABLED.includes(label)) {
        return "DISABLED"; // silla fuera de servicio
    }
    if (row === "A") {
        return "PREFERENTIAL"; // fila accesible para movilidad reducida
    }
    if (row === "D") {
        return "VIP";
    }
    return "STANDARD";
};

const addDays = (date: Date, days: number): Date => {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
};

const atHour = (base: Date, daysFromToday: number, hour: number): Date => {
    const date = addDays(base, daysFromToday);
    date.setHours(hour, 0, 0, 0);
    return date;
};

const seedSeats = async () => {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // --- Geografía mínima -------------------------------------------------
    const [currency] = await Currency.findOrCreate({
        where: { code: "COP" },
        defaults: { code: "COP", name: "Peso Colombiano", symbol: "$" },
    });

    const [country] = await Country.findOrCreate({
        where: { code: "CO" },
        defaults: {
            currencyId: currency.id,
            name: "Colombia",
            code: "CO",
            active: true,
        },
    });

    const [department] = await Department.findOrCreate({
        where: { countryId: country.id, name: "Antioquia" },
        defaults: { countryId: country.id, name: "Antioquia", active: true },
    });

    const [city] = await City.findOrCreate({
        where: { departmentId: department.id, name: "Medellin" },
        defaults: { departmentId: department.id, name: "Medellin", active: true },
    });

    // --- Cine, tipo de sala y sala -------------------------------------------
    const [cinema] = await Cinema.findOrCreate({
        where: { cityId: city.id, name: "Riwi Cine HU-010" },
        defaults: {
            cityId: city.id,
            name: "Riwi Cine HU-010",
            address: "Sede de pruebas de la HU-010",
            active: true,
        },
    });

    const [roomType] = await RoomType.findOrCreate({
        where: { name: "Standard" },
        defaults: {
            name: "Standard",
            description: "Sala tradicional con sillas estándar.",
        },
    });

    const [room] = await Room.findOrCreate({
        where: { cinemaId: cinema.id, name: "Sala HU-010" },
        defaults: {
            cinemaId: cinema.id,
            roomTypeId: roomType.id,
            name: "Sala HU-010",
            capacity: ROWS.length * SEATS_PER_ROW,
            extraPrice: 6000,
        },
    });

    // --- Sillas de la sala -------------------------------------------------
    const seatByLabel = new Map<string, Seat>();

    for (const row of ROWS) {
        for (let seatNumber = 1; seatNumber <= SEATS_PER_ROW; seatNumber++) {
            const [seat] = await Seat.findOrCreate({
                where: { roomId: room.id, row, number: String(seatNumber) },
                defaults: {
                    roomId: room.id,
                    row,
                    number: String(seatNumber),
                    seatType: seatTypeFor(row, seatNumber),
                },
            });

            // Asegura la categoría correcta aunque la silla ya existiera.
            const expectedType = seatTypeFor(row, seatNumber);
            if (seat.seatType !== expectedType) {
                seat.seatType = expectedType;
                await seat.save();
            }

            seatByLabel.set(`${row}${seatNumber}`, seat);
        }
    }

    // --- Película y función activa/futura ----------------------------------
    const [functionType] = await FunctionType.findOrCreate({
        where: { name: "General 2D Doblada" },
        defaults: {
            name: "General 2D Doblada",
            projection: "2D",
            language: "Doblada",
        },
    });

    const [movie] = await Movie.findOrCreate({
        where: { title: "Sillas en Vivo (HU-010)" },
        defaults: {
            title: "Sillas en Vivo (HU-010)",
            synopsis: "Película de prueba para la selección interactiva de sillas.",
            classification: "Todo publico",
            durationMin: 100,
            director: "Equipo Riwi",
            posterUrl: "https://example.com/posters/hu-010.jpg",
            trailerUrl: "https://example.com/trailers/hu-010",
            status: "ACTIVE",
            rating: 4.0,
        },
    });

    await MovieRelease.findOrCreate({
        where: { movieId: movie.id, countryId: country.id },
        defaults: {
            movieId: movie.id,
            countryId: country.id,
            releaseDate: addDays(today, -5),
        },
    });

    const startsAt = atHour(today, 2, 19);

    const [cineFunction] = await FunctionModel.findOrCreate({
        where: {
            movieId: movie.id,
            roomId: room.id,
            functionTypeId: functionType.id,
            startsAt,
        },
        defaults: {
            movieId: movie.id,
            roomId: room.id,
            functionTypeId: functionType.id,
            startsAt,
            basePrice: 20000,
            active: true,
        },
    });

    // --- Usuarios y carritos --------------------------------------------------
    const [otherUser] = await User.findOrCreate({
        where: { email: "hu010.other@example.com" },
        defaults: {
            countryId: country.id,
            cityId: city.id,
            email: "hu010.other@example.com",
            passwordHash: "seed-password-hash",
            firstName: "Otro",
            lastName: "Usuario",
            phone: "3000000010",
            birthDate: "1995-01-01",
            emailVerified: true,
            marketingOptIn: false,
            status: "ACTIVE",
            failedAttempts: 0,
            lockedUntil: null,
        },
    });

    const [testerUser] = await User.findOrCreate({
        where: { email: "hu010.tester@example.com" },
        defaults: {
            countryId: country.id,
            cityId: city.id,
            email: "hu010.tester@example.com",
            passwordHash: "seed-password-hash",
            firstName: "Tester",
            lastName: "HU010",
            phone: "3000000011",
            birthDate: "1995-01-01",
            emailVerified: true,
            marketingOptIn: false,
            status: "ACTIVE",
            failedAttempts: 0,
            lockedUntil: null,
        },
    });

    const [otherCart] = await Cart.findOrCreate({
        where: { userId: otherUser.id, status: "HU010_OTHER" },
        defaults: {
            userId: otherUser.id,
            status: "HU010_OTHER",
            expiresAt: addDays(new Date(), 1),
        },
    });

    const [testerCart] = await Cart.findOrCreate({
        where: { userId: testerUser.id, status: "HU010_TESTER" },
        defaults: {
            userId: testerUser.id,
            status: "HU010_TESTER",
            expiresAt: addDays(new Date(), 1),
        },
    });

    // --- Reinicia el bloque de demostración para dejarlo exacto -----------
    // Borra los bloqueos y tickets previos de las sillas de demo de esta
    // función, de modo que cada ejecución deje exactamente 2 sillas por estado.
    const demoSeatIds = [
        ...DEMO_SEATS.SELECTED,
        ...DEMO_SEATS.LOCKED,
        ...DEMO_SEATS.SOLD,
    ]
        .map((label) => seatByLabel.get(label)?.id)
        .filter((id): id is number => typeof id === "number");

    await SeatLock.destroy({
        where: {
            functionId: cineFunction.id,
            seatId: { [Op.in]: demoSeatIds },
        },
    });
    await Ticket.destroy({
        where: {
            functionId: cineFunction.id,
            qrCode: { [Op.like]: "SEED-HU010-%" },
        },
    });

    const lockExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    /** Bloquea las sillas indicadas a nombre de un carrito. */
    const lockSeatsForCart = async (
        labels: string[],
        cartId: number,
    ): Promise<void> => {
        for (const label of labels) {
            const seat = seatByLabel.get(label);
            if (!seat) {
                continue;
            }
            await SeatLock.create({
                cartId,
                functionId: cineFunction.id,
                seatId: seat.id,
                expiresAt: lockExpiresAt,
            });
        }
    };

    // Estado SELECTED: bloqueadas por el carrito de pruebas (B3, B4).
    await lockSeatsForCart(DEMO_SEATS.SELECTED, testerCart.id);

    // Estado LOCKED: bloqueadas por "otro usuario" (B5, B6).
    await lockSeatsForCart(DEMO_SEATS.LOCKED, otherCart.id);

    // --- Estado SOLD: tickets vendidos para B7 y B8 ----------------------
    const [order] = await Order.findOrCreate({
        where: { cartId: otherCart.id, status: "PAID" },
        defaults: {
            userId: otherUser.id,
            cartId: otherCart.id,
            status: "PAID",
            subtotal: 52000,
            discount: 0,
            total: 52000,
        },
    });

    for (const label of DEMO_SEATS.SOLD) {
        const seat = seatByLabel.get(label);
        if (!seat) {
            continue;
        }
        await Ticket.create({
            orderId: order.id,
            functionId: cineFunction.id,
            seatId: seat.id,
            holderUserId: otherUser.id,
            qrCode: `SEED-HU010-${cineFunction.id}-${seat.id}`,
            price: 26000,
            status: "SOLD",
            scannedByUserId: null,
            scannedAt: null,
        });
    }

    // --- Resumen para el desarrollador -------------------------------------
    const idsOf = (labels: string[]): string =>
        labels.map((l) => `${l} (id ${seatByLabel.get(l)?.id})`).join(", ");

    const availableSeat = seatByLabel.get(DEMO_SEATS.AVAILABLE[0]) as Seat;
    const anotherAvailableSeat = seatByLabel.get(DEMO_SEATS.AVAILABLE[1]) as Seat;

    console.log("\n====================  HU-010 · datos de prueba  ====================");
    console.log(`Función (functionId)      : ${cineFunction.id}`);
    console.log(`Sala (roomId)             : ${room.id}  ("Sala HU-010", 40 sillas)`);
    console.log(`Inicia el                 : ${startsAt.toISOString()}`);
    console.log(`Precio base / recargo sala: 20000 / 6000  -> precio unitario 26000`);
    console.log("-------------------------------------------------------------------");
    console.log(`Carrito de pruebas (cartId)   : ${testerCart.id}   <-- úsalo para lock-seats`);
    console.log(`Carrito de "otro usuario"     : ${otherCart.id}`);
    console.log("-------------------------------------------------------------------");
    console.log("Bloque de demostración (10 sillas, 2 por estado):");
    console.log(`  AVAILABLE : ${idsOf(DEMO_SEATS.AVAILABLE)}`);
    console.log(`  SELECTED  : ${idsOf(DEMO_SEATS.SELECTED)}   (bloqueadas por el carrito de pruebas)`);
    console.log(`  LOCKED    : ${idsOf(DEMO_SEATS.LOCKED)}   (bloqueadas por "otro usuario")`);
    console.log(`  SOLD      : ${idsOf(DEMO_SEATS.SOLD)}`);
    console.log(`  DISABLED  : ${idsOf(DEMO_SEATS.DISABLED)}`);
    console.log(`Categorías: fila A = PREFERENTIAL · fila D = VIP · resto = STANDARD`);
    console.log(`(consulta el mapa con ?cartId=${testerCart.id} para ver SELECTED en vez de LOCKED)`);
    console.log("-------------------------------------------------------------------");
    console.log("Ejemplos:");
    console.log(`  curl "http://localhost:3000/api/functions/${cineFunction.id}/seats?cartId=${testerCart.id}"`);
    console.log(
        `  curl -X POST http://localhost:3000/api/reservations/lock-seats \\\n` +
            `       -H "Content-Type: application/json" \\\n` +
            `       -d '{"functionId": ${cineFunction.id}, "cartId": ${testerCart.id}, "seatIds": [${availableSeat.id}, ${anotherAvailableSeat.id}]}'`,
    );
    console.log(
        `  curl "http://localhost:3000/api/reservations/summary?functionId=${cineFunction.id}&cartId=${testerCart.id}"`,
    );
    console.log(
        `  curl -X DELETE http://localhost:3000/api/reservations/release-seats \\\n` +
            `       -H "Content-Type: application/json" \\\n` +
            `       -d '{"functionId": ${cineFunction.id}, "cartId": ${testerCart.id}}'`,
    );
    console.log("===================================================================\n");
};

seedSeats()
    .then(async () => {
        console.log("Seed de sillas (HU-010) ejecutado correctamente.");
        await sequelize.close();
    })
    .catch(async (error) => {
        console.error("Error ejecutando seed de sillas (HU-010):", error);
        await sequelize.close();
        process.exit(1);
    });
