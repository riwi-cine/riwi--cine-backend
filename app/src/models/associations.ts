// app/src/models/associations.ts

/**
 * ============================================================================
 * ASOCIACIONES DE SEQUELIZE
 * ============================================================================
 * Este archivo centraliza todas las relaciones entre los modelos
 * utilizando:
 *
 * - belongsTo
 * - hasMany
 * - belongsToMany
 *
 * Debe importarse una única vez al iniciar la aplicación para que
 * Sequelize conozca todas las relaciones del proyecto.
 * ============================================================================
 */

import Country from "./country.model";
import Department from "./department.model";
import City from "./city.model";

import Cinema from "./cinema.model";
import RoomType from "./room-type.model";
import CinemaRoomType from "./cinema-room-type.model";
import Room from "./room.model";
import Seat from "./seat.model";

import Movie from "./movie.model";
import Genre from "./genre.model";
import MovieGenre from "./movie-genre.model";
import MovieRelease from "./movie-release.model";
import FunctionType from "./function-type.model";
import Function from "./function.model";
import CineFlashActivation from "./cineflash-activation.model";

//GEOGRAFIA

//País ---> Departamentos

Country.hasMany(Department, {
    foreignKey: "countryId",
    as: "departments",
});

Department.belongsTo(Country, {
    foreignKey: "countryId",
    as: "country",
});

//Departamento ---> Ciudades

Department.hasMany(City, {
    foreignKey: "departmentId",
    as: "cities",
});

City.belongsTo(Department, {
    foreignKey: "departmentId",
    as: "department",
});

//INFRAESTRUCTURA

//Ciudad ---> Cines

City.hasMany(Cinema, {
    foreignKey: "cityId",
    as: "cinemas",
});

Cinema.belongsTo(City, {
    foreignKey: "cityId",
    as: "city",
});

//Cine ---> Salas

Cinema.hasMany(Room, {
    foreignKey: "cinemaId",
    as: "rooms",
});

Room.belongsTo(Cinema, {
    foreignKey: "cinemaId",
    as: "cinema",
});

//Tipo de sala ---> Salas

RoomType.hasMany(Room, {
    foreignKey: "roomTypeId",
    as: "rooms",
});

Room.belongsTo(RoomType, {
    foreignKey: "roomTypeId",
    as: "roomType",
});

//Sala ---> Asientos

Room.hasMany(Seat, {
    foreignKey: "roomId",
    as: "seats",
});

Seat.belongsTo(Room, {
    foreignKey: "roomId",
    as: "room",
});

//Cine <---> Tipo de sala (N:M)

Cinema.belongsToMany(RoomType, {
    through: CinemaRoomType,
    foreignKey: "cinemaId",
    otherKey: "roomTypeId",
    as: "roomTypes",
});

RoomType.belongsToMany(Cinema, {
    through: CinemaRoomType,
    foreignKey: "roomTypeId",
    otherKey: "cinemaId",
    as: "cinemas",
});

//CATALOGO

//Movie<--->Genre (N:M)

Movie.belongsToMany(Genre, {
    through: MovieGenre,
    foreignKey: "movieId",
    otherKey: "genreId",
    as: "genres",
});

Genre.belongsToMany(Movie, {
    through: MovieGenre,
    foreignKey: "genreId",
    otherKey: "movieId",
    as: "movies",
});

//Movie ---> MovieRelease

Movie.hasMany(MovieRelease, {
    foreignKey: "movieId",
    as: "releases",
});

MovieRelease.belongsTo(Movie, {
    foreignKey: "movieId",
    as: "movie",
});

//Country ---> MovieRelease

Country.hasMany(MovieRelease, {
    foreignKey: "countryId",
    as: "movieReleases",
});

MovieRelease.belongsTo(Country, {
    foreignKey: "countryId",
    as: "country",
});

//MovieRelease ---> Functions

MovieRelease.hasMany(Function, {
    foreignKey: "movieReleaseId",
    as: "functions",
});

Function.belongsTo(MovieRelease, {
    foreignKey: "movieReleaseId",
    as: "movieRelease",
});

//FunctionType --> Function

FunctionType.hasMany(Function, {
    foreignKey: "functionTypeId",
    as: "functions",
});

Function.belongsTo(FunctionType, {
    foreignKey: "functionTypeId",
    as: "functionType",
});

//Room ---> Function

Room.hasMany(Function, {
    foreignKey: "roomId",
    as: "functions",
});

Function.belongsTo(Room, {
    foreignKey: "roomId",
    as: "room",
});

//Function ---> CineFlashActivation

Function.hasMany(CineFlashActivation, {
    foreignKey: "functionId",
    as: "cineFlashActivations",
});

CineFlashActivation.belongsTo(Function, {
    foreignKey: "functionId",
    as: "function",
});