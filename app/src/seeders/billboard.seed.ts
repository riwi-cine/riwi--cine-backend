// app/src/seeders/billboard.seed.ts

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
import Genre from "../models/genre.model";
import MovieGenre from "../models/movie-genre.model";
import MovieRelease from "../models/movie-release.model";
import Movie from "../models/movie.model";
import Order from "../models/order.model";
import RoomType from "../models/room-type.model";
import Room from "../models/room.model";
import SeatLock from "../models/seat-lock.model";
import Seat from "../models/seat.model";
import Ticket from "../models/ticket.model";
import User from "../models/user.model";

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

const toDateOnly = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const seedBillboard = async () => {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [currency] = await Currency.findOrCreate({
        where: { code: "COP" },
        defaults: {
            code: "COP",
            name: "Peso Colombiano",
            symbol: "$",
        },
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
        where: {
            countryId: country.id,
            name: "Antioquia",
        },
        defaults: {
            countryId: country.id,
            name: "Antioquia",
            active: true,
        },
    });

    const [city] = await City.findOrCreate({
        where: {
            departmentId: department.id,
            name: "Medellin",
        },
        defaults: {
            departmentId: department.id,
            name: "Medellin",
            active: true,
        },
    });

    const cinemas = await Promise.all([
        Cinema.findOrCreate({
            where: { cityId: city.id, name: "Riwi Cine Medellin Centro" },
            defaults: {
                cityId: city.id,
                name: "Riwi Cine Medellin Centro",
                address: "Centro comercial principal de Medellin",
                active: true,
            },
        }),
        Cinema.findOrCreate({
            where: { cityId: city.id, name: "Riwi Cine Medellin Norte" },
            defaults: {
                cityId: city.id,
                name: "Riwi Cine Medellin Norte",
                address: "Avenida norte #45-20",
                active: true,
            },
        }),
    ]);

    const [cinemaCentro] = cinemas[0];
    const [cinemaNorte] = cinemas[1];

    const [standard] = await RoomType.findOrCreate({
        where: { name: "Standard" },
        defaults: {
            name: "Standard",
            description: "Sala tradicional con sillas estándar.",
        },
    });

    const [imax] = await RoomType.findOrCreate({
        where: { name: "IMAX" },
        defaults: {
            name: "IMAX",
            description: "Sala de gran formato con sonido inmersivo.",
        },
    });

    const [vip] = await RoomType.findOrCreate({
        where: { name: "VIP" },
        defaults: {
            name: "VIP",
            description: "Sala premium con sillas reclinables.",
        },
    });

    const [roomStandard] = await Room.findOrCreate({
        where: { cinemaId: cinemaCentro.id, name: "Sala 1" },
        defaults: {
            cinemaId: cinemaCentro.id,
            roomTypeId: standard.id,
            name: "Sala 1",
            capacity: 4,
            extraPrice: 0,
        },
    });

    const [roomImax] = await Room.findOrCreate({
        where: { cinemaId: cinemaCentro.id, name: "Sala IMAX" },
        defaults: {
            cinemaId: cinemaCentro.id,
            roomTypeId: imax.id,
            name: "Sala IMAX",
            capacity: 8,
            extraPrice: 5000,
        },
    });

    const [roomVip] = await Room.findOrCreate({
        where: { cinemaId: cinemaNorte.id, name: "Sala VIP" },
        defaults: {
            cinemaId: cinemaNorte.id,
            roomTypeId: vip.id,
            name: "Sala VIP",
            capacity: 6,
            extraPrice: 8000,
        },
    });

    await createSeats(roomStandard.id, 4);
    await createSeats(roomImax.id, 8);
    await createSeats(roomVip.id, 6);

    const [ft2dDub] = await FunctionType.findOrCreate({
        where: { name: "General 2D Doblada" },
        defaults: {
            name: "General 2D Doblada",
            projection: "2D",
            language: "Doblada",
        },
    });

    const [ft3dSub] = await FunctionType.findOrCreate({
        where: { name: "General 3D Subtitulada" },
        defaults: {
            name: "General 3D Subtitulada",
            projection: "3D",
            language: "Subtitulada",
        },
    });

    const [ftImaxSub] = await FunctionType.findOrCreate({
        where: { name: "IMAX Subtitulada" },
        defaults: {
            name: "IMAX Subtitulada",
            projection: "IMAX",
            language: "Subtitulada",
        },
    });

    const movieData = [
        {
            title: "El Ultimo Portal",
            synopsis: "Una científica abre una ruta hacia una ciudad imposible.",
            classification: "12+",
            durationMin: 128,
            director: "Ana Torres",
            posterUrl: "https://example.com/posters/ultimo-portal.jpg",
            trailerUrl: "https://example.com/trailers/ultimo-portal",
            status: "ACTIVE",
            rating: 4.6,
            genres: ["Ciencia ficcion", "Aventura"],
            releaseDate: toDateOnly(addDays(today, -3)),
        },
        {
            title: "Risas en la Avenida",
            synopsis: "Dos amigos convierten un error laboral en una aventura.",
            classification: "7+",
            durationMin: 98,
            director: "Luis Pardo",
            posterUrl: "https://example.com/posters/risas-avenida.jpg",
            trailerUrl: "https://example.com/trailers/risas-avenida",
            status: "ACTIVE",
            rating: 4.1,
            genres: ["Comedia"],
            releaseDate: toDateOnly(addDays(today, -20)),
        },
        {
            title: "Noche en Silencio",
            synopsis: "Una familia descubre que su nueva casa guarda un secreto.",
            classification: "15+",
            durationMin: 112,
            director: "Maria Gomez",
            posterUrl: "https://example.com/posters/noche-silencio.jpg",
            trailerUrl: "https://example.com/trailers/noche-silencio",
            status: "ACTIVE",
            rating: 4.3,
            genres: ["Terror", "Suspenso"],
            releaseDate: toDateOnly(addDays(today, -2)),
        },
        {
            title: "Camino Dorado",
            synopsis: "Una atleta intenta volver a competir despues de una lesion.",
            classification: "Todo publico",
            durationMin: 105,
            director: "Sofia Mejia",
            posterUrl: "https://example.com/posters/camino-dorado.jpg",
            trailerUrl: "https://example.com/trailers/camino-dorado",
            status: "ACTIVE",
            rating: 3.9,
            genres: ["Drama"],
            releaseDate: toDateOnly(addDays(today, -45)),
        },
    ];

    const movies = new Map<string, Movie>();

    for (const data of movieData) {
        const { genres, releaseDate, ...movieDefaults } = data;
        const [movie] = await Movie.findOrCreate({
            where: { title: data.title },
            defaults: movieDefaults,
        });

        movies.set(data.title, movie);

        await MovieRelease.findOrCreate({
            where: {
                movieId: movie.id,
                countryId: country.id,
            },
            defaults: {
                movieId: movie.id,
                countryId: country.id,
                releaseDate: new Date(`${releaseDate}T00:00:00`),
            },
        });

        for (const genreName of genres) {
            const [genre] = await Genre.findOrCreate({
                where: { name: genreName },
                defaults: { name: genreName },
            });

            await MovieGenre.findOrCreate({
                where: {
                    movieId: movie.id,
                    genreId: genre.id,
                },
                defaults: {
                    movieId: movie.id,
                    genreId: genre.id,
                },
            });
        }
    }

    const portal = movies.get("El Ultimo Portal") as Movie;
    const risas = movies.get("Risas en la Avenida") as Movie;
    const noche = movies.get("Noche en Silencio") as Movie;
    const camino = movies.get("Camino Dorado") as Movie;

    const soldOutFunction = await createFunction({
        movieId: portal.id,
        roomId: roomStandard.id,
        functionTypeId: ft2dDub.id,
        startsAt: atHour(today, 0, 18),
        basePrice: 18000,
    });

    await createFunction({
        movieId: portal.id,
        roomId: roomImax.id,
        functionTypeId: ftImaxSub.id,
        startsAt: atHour(today, 1, 20),
        basePrice: 28000,
    });

    await createFunction({
        movieId: risas.id,
        roomId: roomVip.id,
        functionTypeId: ft2dDub.id,
        startsAt: atHour(today, 2, 17),
        basePrice: 24000,
    });

    await createFunction({
        movieId: noche.id,
        roomId: roomImax.id,
        functionTypeId: ft3dSub.id,
        startsAt: atHour(today, 4, 21),
        basePrice: 26000,
    });

    await createFunction({
        movieId: camino.id,
        roomId: roomStandard.id,
        functionTypeId: ft2dDub.id,
        startsAt: atHour(today, 6, 16),
        basePrice: 16000,
    });

    await createSoldOutData(soldOutFunction.id, roomStandard.id, country.id, city.id);
};

const createSeats = async (roomId: number, capacity: number): Promise<void> => {
    for (let index = 1; index <= capacity; index++) {
        await Seat.findOrCreate({
            where: {
                roomId,
                row: "A",
                number: String(index),
            },
            defaults: {
                roomId,
                row: "A",
                number: String(index),
                seatType: "Standard",
            },
        });
    }
};

const createFunction = async (data: {
    movieId: number;
    roomId: number;
    functionTypeId: number;
    startsAt: Date;
    basePrice: number;
}): Promise<FunctionModel> => {
    const [movieFunction] = await FunctionModel.findOrCreate({
        where: {
            movieId: data.movieId,
            roomId: data.roomId,
            functionTypeId: data.functionTypeId,
            startsAt: data.startsAt,
        },
        defaults: {
            ...data,
            active: true,
        },
    });

    return movieFunction;
};

const createSoldOutData = async (
    functionId: number,
    roomId: number,
    countryId: number,
    cityId: number,
): Promise<void> => {
    const [user] = await User.findOrCreate({
        where: { email: "seed.billboard@example.com" },
        defaults: {
            countryId,
            cityId,
            email: "seed.billboard@example.com",
            passwordHash: "seed-password-hash",
            firstName: "Seed",
            lastName: "Billboard",
            phone: "3000000000",
            birthDate: "1995-01-01",
            emailVerified: true,
            marketingOptIn: false,
            status: "ACTIVE",
            failedAttempts: 0,
            lockedUntil: null,
        },
    });

    const [cart] = await Cart.findOrCreate({
        where: {
            userId: user.id,
            status: "SEED_BILLBOARD",
        },
        defaults: {
            userId: user.id,
            status: "SEED_BILLBOARD",
            expiresAt: addDays(new Date(), 1),
        },
    });

    const [order] = await Order.findOrCreate({
        where: {
            cartId: cart.id,
            status: "PAID",
        },
        defaults: {
            userId: user.id,
            cartId: cart.id,
            status: "PAID",
            subtotal: 72000,
            discount: 0,
            total: 72000,
        },
    });

    const seats = await Seat.findAll({
        where: { roomId },
        order: [["id", "ASC"]],
    });

    for (const seat of seats.slice(0, 4)) {
        await Ticket.findOrCreate({
            where: {
                qrCode: `SEED-BILLBOARD-${functionId}-${seat.id}`,
            },
            defaults: {
                orderId: order.id,
                functionId,
                seatId: seat.id,
                holderUserId: user.id,
                qrCode: `SEED-BILLBOARD-${functionId}-${seat.id}`,
                price: 18000,
                status: "SOLD",
                scannedByUserId: null,
                scannedAt: null,
            },
        });
    }

    const lockTarget = seats[0];

    if (lockTarget) {
        await SeatLock.findOrCreate({
            where: {
                functionId,
                seatId: lockTarget.id,
            },
            defaults: {
                cartId: cart.id,
                functionId,
                seatId: lockTarget.id,
                expiresAt: addDays(new Date(), 1),
            },
        });
    }
};

seedBillboard()
    .then(async () => {
        console.log("Seed de cartelera ejecutado correctamente.");
        await sequelize.close();
    })
    .catch(async error => {
        console.error("Error ejecutando seed de cartelera:", error);
        await sequelize.close();
        process.exit(1);
    });
