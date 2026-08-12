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

//MODULO DE GEOGRAFIA

import Country from "./country.model";
import Department from "./department.model";
import City from "./city.model";

import Cinema from "./cinema.model";
import RoomType from "./room-type.model";
import CinemaRoomType from "./cinema-room-type.model";
import Room from "./room.model";
import Seat from "./seat.model";

//MODULO DE INFRAESTRUCTURA

import Movie from "./movie.model";
import Genre from "./genre.model";
import MovieGenre from "./movie-genre.model";
import MovieRelease from "./movie-release.model";
import FunctionType from "./function-type.model";
import Function from "./function.model";
import CineFlashActivation from "./cineflash-activation.model";

//MODULO DE USUARIOS Y SEGURIDAD

import DocumentType from "./document-type.model";
import User from "./user.model";
import UserDocument from "./user-document.model";
import Role from "./role.model";
import UserRole from "./user-role.model";
import ActivationToken from "./activation-token.model";
import RefreshToken from "./refresh-token.model";

//MODELO DE MEMBRESIAS Y PUNTOS

import Membership from "./membership.model";
import PointsTransaction from "./points-transaction.model";

//MODELO DE ORDENES
import Order from "./order.model";

//MODELO DE CARRITO Y CONFITERIA

import Snack from "./snack.model";
import CinemaSnack from "./cinema-snack.model";
import Cart from "./cart.model";
import CartSnack from "./cart-snack.model";
import SeatLock from "./seat-lock.model";

//MODELO DE ORDENES Y PAGOS

import OrderSnack from "./order-snack.model";
import Promotion from "./promotion.model";
import PromotionFunctionType from "./promotion-function-type.model";
import PromotionCinema from "./promotion-cinema.model";
import OrderPromotion from "./order-promotion.model";
import GiftCard from "./gift-card.model";
import GiftCardRedemption from "./gift-card-redemption.model";
import Payment from "./payment.model";

//MODELO DE ENTRADAS/TICKETS

import Ticket from "./ticket.model";
import TicketTransfer from "./ticket-transfer.model";

//MODELO DE SOPORTE / CX/ AUDITORIA

import Notification from "./notification.model";
import AuditLog from "./audit-log.model";
import Survey from "./survey.model";
import PQRS from "./pqrs.model";

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

//Movie <---> Genre (N:M)

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

//USUARIOS Y SEGURIDAD

//Country ---> User

Country.hasMany(User, {
    foreignKey: "countryId",
    as: "users",
});

User.belongsTo(Country, {
    foreignKey: "countryId",
    as: "country",
});

//City ---> User

City.hasMany(User, {
    foreignKey: "cityId",
    as: "users",
});

User.belongsTo(City, {
    foreignKey: "cityId",
    as: "city",
});

//User ---> UserDocument

User.hasMany(UserDocument, {
    foreignKey: "userId",
    as: "documents",
});

UserDocument.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

//DocumentType ---> UserDocument

DocumentType.hasMany(UserDocument, {
    foreignKey: "documentTypeId",
    as: "userDocuments",
});

UserDocument.belongsTo(DocumentType, {
    foreignKey: "documentTypeId",
    as: "documentType",
});

//User <---> Role (N:M)

User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: "userId",
    otherKey: "roleId",
    as: "roles",
});

Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: "roleId",
    otherKey: "userId",
    as: "users",
});

//User ---> ActivationToken

User.hasMany(ActivationToken, {
    foreignKey: "userId",
    as: "activationTokens",
});

ActivationToken.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

//User ---> RefreshToken

User.hasMany(RefreshToken, {
    foreignKey: "userId",
    as: "refreshTokens",
});

RefreshToken.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

//MEMBRESIAS

//User ---> Membership

User.hasMany(Membership, {
    foreignKey: "userId",
    as: "memberships",
});

Membership.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

//User ---> PointsTransaction

User.hasMany(PointsTransaction, {
    foreignKey: "userId",
    as: "pointsTransactions",
});

PointsTransaction.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

//order ---> PointsTransaction

Order.hasMany(PointsTransaction, {
    foreignKey: "orderId",
    as: "pointsTransactions",
});

PointsTransaction.belongsTo(Order, {
    foreignKey: "orderId",
    as: "order",
});

//CARRITO Y CONFITERIA

//Cinema ---> CinemaSnack

Cinema.hasMany(CinemaSnack, {
    foreignKey: "cinemaId",
    as: "cinemaSnacks",
});

CinemaSnack.belongsTo(Cinema, {
    foreignKey: "cinemaId",
    as: "cinema",
});

//Snack ---> CinemaSnack

Snack.hasMany(CinemaSnack, {
    foreignKey: "snackId",
    as: "cinemaSnacks",
});

CinemaSnack.belongsTo(Snack, {
    foreignKey: "snackId",
    as: "snack",
});

//User ---> Cart

User.hasMany(Cart, {
    foreignKey: "userId",
    as: "carts",
});

Cart.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

//Cart ---> CartSnack

Cart.hasMany(CartSnack, {
    foreignKey: "cartId",
    as: "cartSnacks",
});     

CartSnack.belongsTo(Cart, {
    foreignKey: "cartId",
    as: "cart",
});

//snack ---> CartSnack

Snack.hasMany(CartSnack, {
    foreignKey: "snackId",
    as: "cartSnacks",
});

CartSnack.belongsTo(Snack, {
    foreignKey: "snackId",
    as: "snack",
});

//cinema ---> CartSnack

Cinema.hasMany(CartSnack, {
    foreignKey: "cinemaId",
    as: "cartSnacks",
});

CartSnack.belongsTo(Cinema, {
    foreignKey: "cinemaId",
    as: "cinema",
});

//Cart ---> SeatLock

Cart.hasMany(SeatLock, {
    foreignKey: "cartId",
    as: "seatLocks",
});

SeatLock.belongsTo(Cart, {
    foreignKey: "cartId",
    as: "cart",
});

//Function ---> SeatLock

Function.hasMany(SeatLock, {
    foreignKey: "functionId",
    as: "seatLocks",
});

SeatLock.belongsTo(Function, {
    foreignKey: "functionId",
    as: "function",
});

//Seat ---> SeatLock

Seat.hasMany(SeatLock, {
    foreignKey: "seatId",
    as: "seatLocks",
});

SeatLock.belongsTo(Seat, {
    foreignKey: "seatId",
    as: "seat",
});

//ORDENES Y PAGOS

//User ---> Order

User.hasMany(Order, {
    foreignKey: "userId",
    as: "orders",
});

Order.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

//Cart <---> Order (N:M)

Cart.hasOne(Order, {
    foreignKey: "cartId",
    as: "order",
});

Order.belongsTo(Cart, {
    foreignKey: "cartId",
    as: "cart",
});

//Order ---> OrderSnack

Order.hasMany(OrderSnack, {
    foreignKey: "orderId",
    as: "orderSnacks",
});

OrderSnack.belongsTo(Order, {
    foreignKey: "orderId",
    as: "order",
});

//Snack ---> OrderSnack

Snack.hasMany(OrderSnack, {
    foreignKey: "snackId",
    as: "orderSnacks",
});

OrderSnack.belongsTo(Snack, {
    foreignKey: "snackId",
    as: "snack",
});


//Cinema ---> OrderSnack

Cinema.hasMany(OrderSnack, {
    foreignKey: "cinemaId",
    as: "orderSnacks",
});

OrderSnack.belongsTo(Cinema, {
    foreignKey: "cinemaId",
    as: "cinema",
});

//Promotion ---> OrderPromotion

Promotion.hasMany(OrderPromotion, {
    foreignKey: "promotionId",
    as: "orderPromotions",
});

OrderPromotion.belongsTo(Promotion, {
    foreignKey: "promotionId",
    as: "promotion",
});

//Order ---> OrderPromotion

Order.hasMany(OrderPromotion, {
    foreignKey: "orderId",
    as: "orderPromotions",
});

OrderPromotion.belongsTo(Order, {
    foreignKey: "orderId",
    as: "order",
});

//Promotion <---> FunctionType (N:M)

Promotion.belongsToMany(FunctionType, {
    through: PromotionFunctionType,
    foreignKey: "promotionId",
    otherKey: "functionTypeId",
    as: "functionTypes",
});

FunctionType.belongsToMany(Promotion, {
    through: PromotionFunctionType,
    foreignKey: "functionTypeId",
    otherKey: "promotionId",
    as: "promotions",
});

//Promotion <---> Cinema (N:M)

Promotion.belongsToMany(Cinema, {
    through: PromotionCinema,
    foreignKey: "promotionId",
    otherKey: "cinemaId",
    as: "cinemas",
});

Cinema.belongsToMany(Promotion, {
    through: PromotionCinema,
    foreignKey: "cinemaId",
    otherKey: "promotionId",
    as: "promotions",
});

//User ---> GiftCard

User.hasMany(GiftCard, {
    foreignKey: "BuyerUserId",
    as: "purchasedGiftCards",
});

GiftCard.belongsTo(User, {
    foreignKey: "BuyerUserId",
    as: "buyer",
});

//GiftCard ---> GiftCardRedemption

GiftCard.hasMany(GiftCardRedemption, {
    foreignKey: "giftCardId",
    as: "redemptions",
});

GiftCardRedemption.belongsTo(GiftCard, {
    foreignKey: "giftCardId",
    as: "giftCard",
});

//Order ---> GiftCardRedemption

Order.hasMany(GiftCardRedemption, {
    foreignKey: "orderId",
    as: "giftCardRedemptions",
});

GiftCardRedemption.belongsTo(Order, {
    foreignKey: "orderId",
    as: "order",
});

//Order ---> Payment

Order.hasMany(Payment, {
    foreignKey: "orderId",
    as: "payments",
});

Payment.belongsTo(Order, {
    foreignKey: "orderId",
    as: "order",
});

//ENTRADAS/TICKETS

//Order ---> Ticket

Order.hasMany(Ticket, {
    foreignKey: "orderId",
    as: "tickets",
});

Ticket.belongsTo(Order, {
    foreignKey: "orderId",
    as: "order",
});

// Function ---> Ticket

Function.hasMany(Ticket, {
    foreignKey: "functionId",
    as: "tickets",
});

Ticket.belongsTo(Function, {
    foreignKey: "functionId",
    as: "function",
});

// Seat ---> Ticket

Seat.hasMany(Ticket, {
    foreignKey: "seatId",
    as: "tickets",
});

Ticket.belongsTo(Seat, {
    foreignKey: "seatId",
    as: "seat",
});

// User ---> Ticket (titular del ticket)

User.hasMany(Ticket, {
    foreignKey: "holderUserId",
    as: "heldTickets",
});

Ticket.belongsTo(User, {
    foreignKey: "holderUserId",
    as: "holder",
});

// User ---> Ticket (usuario que escaneó el ticket)

User.hasMany(Ticket, {
    foreignKey: "scannedByUserId",
    as: "scannedTickets",
});

Ticket.belongsTo(User, {
    foreignKey: "scannedByUserId",
    as: "scanner",
});

// Ticket ---> TicketTransfer

Ticket.hasMany(TicketTransfer, {
    foreignKey: "ticketId",
    as: "transfers",
});

TicketTransfer.belongsTo(Ticket, {
    foreignKey: "ticketId",
    as: "ticket",
});

// User ---> TicketTransfer 

User.hasMany(TicketTransfer, {
    foreignKey: "fromUserId",
    as: "sentTicketTransfers",
});

TicketTransfer.belongsTo(User, {
    foreignKey: "fromUserId",
    as: "fromUser",
});

// User ---> TicketTransfer 

User.hasMany(TicketTransfer, {
    foreignKey: "toUserId",
    as: "receivedTicketTransfers",
});

TicketTransfer.belongsTo(User, {
    foreignKey: "toUserId",
    as: "toUser",
});

//SOPORTE / CX/ AUDITORIA

// User ---> Notification

User.hasMany(Notification, {
    foreignKey: "userId",
    as: "notifications",
});

Notification.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});


// User ---> AuditLog

User.hasMany(AuditLog, {
    foreignKey: "userId",
    as: "auditLogs",
});

AuditLog.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});


// Order ---> Survey

Order.hasOne(Survey, {
    foreignKey: "orderId",
    as: "survey",
});

Survey.belongsTo(Order, {
    foreignKey: "orderId",
    as: "order",
});

// User ---> PQRS

User.hasMany(PQRS, {
    foreignKey: "userId",
    as: "pqrs",
});

PQRS.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});
