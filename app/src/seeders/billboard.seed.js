'use strict';

// Cargar variables de entorno
require('dotenv').config();

// Requerir la instancia de Sequelize y los modelos
const sequelize = require('../config/database').default || require('../config/database');
require('../models/associations');

const Cart = require('../models/cart.model').default || require('../models/cart.model');
const Cinema = require('../models/cinema.model').default || require('../models/cinema.model');
const City = require('../models/city.model').default || require('../models/city.model');
const Country = require('../models/country.model').default || require('../models/country.model');
const Currency = require('../models/currency.model').default || require('../models/currency.model');
const Department = require('../models/department.model').default || require('../models/department.model');
const FunctionType = require('../models/function-type.model').default || require('../models/function-type.model');
const FunctionModel = require('../models/function.model').default || require('../models/function.model');
const Genre = require('../models/genre.model').default || require('../models/genre.model');
const MovieGenre = require('../models/movie-genre.model').default || require('../models/movie-genre.model');
const MovieRelease = require('../models/movie-release.model').default || require('../models/movie-release.model');
const Movie = require('../models/movie.model').default || require('../models/movie.model');
const Order = require('../models/order.model').default || require('../models/order.model');
const RoomType = require('../models/room-type.model').default || require('../models/room-type.model');
const Room = require('../models/room.model').default || require('../models/room.model');
const SeatLock = require('../models/seat-lock.model').default || require('../models/seat-lock.model');
const Seat = require('../models/seat.model').default || require('../models/seat.model');
const Ticket = require('../models/ticket.model').default || require('../models/ticket.model');
const User = require('../models/user.model').default || require('../models/user.model');

// Helper functions
const addDays = (date, days) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
};

const atHour = (base, daysFromToday, hour) => {
  const date = addDays(base, daysFromToday);
  date.setHours(hour, 0, 0, 0);
  return date;
};

const toDateOnly = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [currency] = await Currency.findOrCreate({
      where: { code: 'COP' },
      defaults: { code: 'COP', name: 'Peso Colombiano', symbol: '$' },
    });

    const [country] = await Country.findOrCreate({
      where: { code: 'CO' },
      defaults: { currencyId: currency.id, name: 'Colombia', code: 'CO', active: true },
    });

    const [department] = await Department.findOrCreate({
      where: { countryId: country.id, name: 'Antioquia' },
      defaults: { countryId: country.id, name: 'Antioquia', active: true },
    });

    const [city] = await City.findOrCreate({
      where: { departmentId: department.id, name: 'Medellin' },
      defaults: { departmentId: department.id, name: 'Medellin', active: true },
    });

    const cinemas = await Promise.all([
      Cinema.findOrCreate({
        where: { cityId: city.id, name: 'Riwi Cine Medellin Centro' },
        defaults: { cityId: city.id, name: 'Riwi Cine Medellin Centro', address: 'Centro comercial principal de Medellin', active: true },
      }),
      Cinema.findOrCreate({
        where: { cityId: city.id, name: 'Riwi Cine Medellin Norte' },
        defaults: { cityId: city.id, name: 'Riwi Cine Medellin Norte', address: 'Avenida norte #45-20', active: true },
      }),
    ]);

    const [cinemaCentro] = cinemas[0];
    const [cinemaNorte] = cinemas[1];

    const [standard] = await RoomType.findOrCreate({
      where: { name: 'Standard' },
      defaults: { name: 'Standard', description: 'Sala tradicional con sillas estándar.' },
    });

    const [imax] = await RoomType.findOrCreate({
      where: { name: 'IMAX' },
      defaults: { name: 'IMAX', description: 'Sala de gran formato con sonido inmersivo.' },
    });

    const [vip] = await RoomType.findOrCreate({
      where: { name: 'VIP' },
      defaults: { name: 'VIP', description: 'Sala premium con sillas reclinables.' },
    });

    const [roomStandard] = await Room.findOrCreate({
      where: { cinemaId: cinemaCentro.id, name: 'Sala 1' },
      defaults: { cinemaId: cinemaCentro.id, roomTypeId: standard.id, name: 'Sala 1', capacity: 4, extraPrice: 0 },
    });

    const [roomImax] = await Room.findOrCreate({
      where: { cinemaId: cinemaCentro.id, name: 'Sala IMAX' },
      defaults: { cinemaId: cinemaCentro.id, roomTypeId: imax.id, name: 'Sala IMAX', capacity: 8, extraPrice: 5000 },
    });

    const [roomVip] = await Room.findOrCreate({
      where: { cinemaId: cinemaNorte.id, name: 'Sala VIP' },
      defaults: { cinemaId: cinemaNorte.id, roomTypeId: vip.id, name: 'Sala VIP', capacity: 6, extraPrice: 8000 },
    });

    // Crear sillas
    for (const [roomId, cap] of [[roomStandard.id, 4], [roomImax.id, 8], [roomVip.id, 6]]) {
      for (let i = 1; i <= cap; i++) {
        await Seat.findOrCreate({
          where: { roomId, row: 'A', number: String(i) },
          defaults: { roomId, row: 'A', number: String(i), seatType: 'Standard' },
        });
      }
    }

    const [ft2dDub] = await FunctionType.findOrCreate({
      where: { name: 'General 2D Doblada' },
      defaults: { name: 'General 2D Doblada', projection: '2D', language: 'Doblada' },
    });

    const [ft3dSub] = await FunctionType.findOrCreate({
      where: { name: 'General 3D Subtitulada' },
      defaults: { name: 'General 3D Subtitulada', projection: '3D', language: 'Subtitulada' },
    });

    const [ftImaxSub] = await FunctionType.findOrCreate({
      where: { name: 'IMAX Subtitulada' },
      defaults: { name: 'IMAX Subtitulada', projection: 'IMAX', language: 'Subtitulada' },
    });

    const movieData = [
      { title: 'El Ultimo Portal', synopsis: 'Una científica abre una ruta hacia una ciudad imposible.', classification: '12+', durationMin: 128, director: 'Ana Torres', posterUrl: 'https://example.com/posters/ultimo-portal.jpg', trailerUrl: 'https://example.com/trailers/ultimo-portal', status: 'ACTIVE', rating: 4.6, genres: ['Ciencia ficcion', 'Aventura'], releaseDate: toDateOnly(addDays(today, -3)) },
      { title: 'Risas en la Avenida', synopsis: 'Dos amigos convierten un error laboral en una aventura.', classification: '7+', durationMin: 98, director: 'Luis Pardo', posterUrl: 'https://example.com/posters/risas-avenida.jpg', trailerUrl: 'https://example.com/trailers/risas-avenida', status: 'ACTIVE', rating: 4.1, genres: ['Comedia'], releaseDate: toDateOnly(addDays(today, -20)) },
      { title: 'Noche en Silencio', synopsis: 'Una familia descubre que su nueva casa guarda un secreto.', classification: '15+', durationMin: 112, director: 'Maria Gomez', posterUrl: 'https://example.com/posters/noche-silencio.jpg', trailerUrl: 'https://example.com/trailers/noche-silencio', status: 'ACTIVE', rating: 4.3, genres: ['Terror', 'Suspenso'], releaseDate: toDateOnly(addDays(today, -2)) },
      { title: 'Camino Dorado', synopsis: 'Una atleta intenta volver a competir despues de una lesion.', classification: 'Todo publico', durationMin: 105, director: 'Sofia Mejia', posterUrl: 'https://example.com/posters/camino-dorado.jpg', trailerUrl: 'https://example.com/trailers/camino-dorado', status: 'ACTIVE', rating: 3.9, genres: ['Drama'], releaseDate: toDateOnly(addDays(today, -45)) },
    ];

    const movies = new Map();

    for (const data of movieData) {
      const { genres, releaseDate, ...movieDefaults } = data;
      const [movie] = await Movie.findOrCreate({
        where: { title: data.title },
        defaults: movieDefaults,
      });

      movies.set(data.title, movie);

      await MovieRelease.findOrCreate({
        where: { movieId: movie.id, countryId: country.id },
        defaults: { movieId: movie.id, countryId: country.id, releaseDate: new Date(`${releaseDate}T00:00:00`) },
      });

      for (const genreName of genres) {
        const [genre] = await Genre.findOrCreate({
          where: { name: genreName },
          defaults: { name: genreName },
        });

        await MovieGenre.findOrCreate({
          where: { movieId: movie.id, genreId: genre.id },
          defaults: { movieId: movie.id, genreId: genre.id },
        });
      }
    }

    const portal = movies.get('El Ultimo Portal');
    const risas = movies.get('Risas en la Avenida');
    const noche = movies.get('Noche en Silencio');
    const camino = movies.get('Camino Dorado');

    const [soldOutFunction] = await FunctionModel.findOrCreate({
      where: { movieId: portal.id, roomId: roomStandard.id, functionTypeId: ft2dDub.id, startsAt: atHour(today, 0, 18) },
      defaults: { movieId: portal.id, roomId: roomStandard.id, functionTypeId: ft2dDub.id, startsAt: atHour(today, 0, 18), basePrice: 18000, active: true },
    });

    await FunctionModel.findOrCreate({
      where: { movieId: portal.id, roomId: roomImax.id, functionTypeId: ftImaxSub.id, startsAt: atHour(today, 1, 20) },
      defaults: { movieId: portal.id, roomId: roomImax.id, functionTypeId: ftImaxSub.id, startsAt: atHour(today, 1, 20), basePrice: 28000, active: true },
    });

    await FunctionModel.findOrCreate({
      where: { movieId: risas.id, roomId: roomVip.id, functionTypeId: ft2dDub.id, startsAt: atHour(today, 2, 17) },
      defaults: { movieId: risas.id, roomId: roomVip.id, functionTypeId: ft2dDub.id, startsAt: atHour(today, 2, 17), basePrice: 24000, active: true },
    });

    await FunctionModel.findOrCreate({
      where: { movieId: noche.id, roomId: roomImax.id, functionTypeId: ft3dSub.id, startsAt: atHour(today, 4, 21) },
      defaults: { movieId: noche.id, roomId: roomImax.id, functionTypeId: ft3dSub.id, startsAt: atHour(today, 4, 21), basePrice: 26000, active: true },
    });

    await FunctionModel.findOrCreate({
      where: { movieId: camino.id, roomId: roomStandard.id, functionTypeId: ft2dDub.id, startsAt: atHour(today, 6, 16) },
      defaults: { movieId: camino.id, roomId: roomStandard.id, functionTypeId: ft2dDub.id, startsAt: atHour(today, 6, 16), basePrice: 16000, active: true },
    });

    // Sold out data
    const [user] = await User.findOrCreate({
      where: { email: 'seed.billboard@example.com' },
      defaults: {
        countryId: country.id, cityId: city.id, email: 'seed.billboard@example.com', passwordHash: 'seed-password-hash',
        firstName: 'Seed', lastName: 'Billboard', phone: '3000000000', birthDate: new Date('1995-01-01T00:00:00'),
        emailVerified: true, marketingOptIn: false, status: 'ACTIVE', failedAttempts: 0, lockedUntil: null,
      },
    });

    const [cart] = await Cart.findOrCreate({
      where: { userId: user.id, status: 'SEED_BILLBOARD' },
      defaults: { userId: user.id, status: 'SEED_BILLBOARD', expiresAt: addDays(new Date(), 1) },
    });

    const [order] = await Order.findOrCreate({
      where: { cartId: cart.id, status: 'PAID' },
      defaults: { userId: user.id, cartId: cart.id, status: 'PAID', subtotal: 72000, discount: 0, total: 72000 },
    });

    const seats = await Seat.findAll({ where: { roomId: roomStandard.id }, order: [['id', 'ASC']] });

    for (const seat of seats.slice(0, 4)) {
      await Ticket.findOrCreate({
        where: { qrCode: `SEED-BILLBOARD-${soldOutFunction.id}-${seat.id}` },
        defaults: { orderId: order.id, functionId: soldOutFunction.id, seatId: seat.id, holderUserId: user.id, qrCode: `SEED-BILLBOARD-${soldOutFunction.id}-${seat.id}`, price: 18000, status: 'SOLD' },
      });
    }

    if (seats[0]) {
      await SeatLock.findOrCreate({
        where: { functionId: soldOutFunction.id, seatId: seats[0].id },
        defaults: { cartId: cart.id, functionId: soldOutFunction.id, seatId: seats[0].id, expiresAt: addDays(new Date(), 1) },
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Lógica opcional para limpiar/revertir datos
    await queryInterface.bulkDelete('tickets', null, {});
    await queryInterface.bulkDelete('seat_locks', null, {});
  }
};