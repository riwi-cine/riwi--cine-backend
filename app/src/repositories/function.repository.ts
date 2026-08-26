import Function, {FunctionCreationAttributes, FunctionDetail, FunctionPriceDetail} from "../models/function.model";
import { IfunctionRepository } from "./interfaces/function.repository.interface";
import FunctionType from "../models/function-type.model";
import Room from "../models/room.model";
import RoomType from "../models/room-type.model";
import Cinema from "../models/cinema.model";
import MovieRelease from "../models/movie-release.model";
import Movie from "../models/movie.model";
import City from "../models/city.model";
import Ticket from "../models/ticket.model";
import SeatLock from "../models/seat-lock.model";
import { Op } from "sequelize";

/**
 * Repository de entidad Function
 * ------------------------------
 * Implementa el patrón Repository para encapsular todas las operaciones
 * de persistencia relacionadas con la entidad Function.
 * 
 * Esta clase es la única responsable de interactuar con Sequelize.
 */
class FunctionRepository implements IfunctionRepository {

    /**
     * 
     * @param {FunctionCreationAttributes} data 
     * @returns {Promise<Function>}
     */
    async create(data: FunctionCreationAttributes): Promise<Function> {
        return await Function.create(data);
    }

    /**
     * 
     * @returns La lista de todas las funciones
     */
    async findAll(): Promise<Function[]> {
        return await Function.findAll();
    }

    /**
     * 
     * @param {number} id -ID de la función a localizar
     * @returns {FunctionDetail} retorna un objeto de clase FunctionDetail
     */
    async findOne(id: number): Promise<FunctionDetail | null> {
        const cineFunction = await Function.findOne({
            where: { 
                id,
                active: true,
                startsAt: {
                    [Op.gt]: new Date(),
                },
            },
            include: [
                {
                    model: FunctionType,
                    as: "functionType"
                },
                {
                    model: Room,
                    as: "room",
                    include: [
                        {
                            model: RoomType,
                            as: "roomType"
                        },
                        {
                            model: Cinema,
                            as: "cinema",
                            include: [
                                {
                                    model: City,
                                    as: "city"
                                }
                            ]
                        }
                    ]
                },
                {
                    model: MovieRelease,
                    as: "movieRelease",
                    include: [
                        {
                            model: Movie,
                            as: "movie"
                        }
                    ]
                }
            ]
        });

        if (!cineFunction) {
            return null;
        }
        const ticketsCount = await Ticket.count({
            where: {
                functionId: id
            }
        });

        const seatLocksCount = await SeatLock.count({
            where: {
                functionId: id
            }
        });

        const isSoldOut = cineFunction.room
            ? ticketsCount >= cineFunction.room.capacity
            : null;

        const functionDetail: FunctionDetail = {
            id: cineFunction.id,
            startsAt: cineFunction.startsAt,
            basePrice: cineFunction.basePrice,
            active: cineFunction.active,

            functionType: cineFunction.functionType
                ? {
                    id: cineFunction.functionType.id,
                    name: cineFunction.functionType.name,
                    projection: cineFunction.functionType.projection,
                    language: cineFunction.functionType.language
                }
                : null,

            room: cineFunction.room
                ? {
                    id: cineFunction.room.id,
                    name: cineFunction.room.name,
                    capacity: cineFunction.room.capacity,
                    extraPrice: cineFunction.room.extraPrice,

                    roomType: cineFunction.room.roomType
                        ? {
                            id: cineFunction.room.roomType.id,
                            name: cineFunction.room.roomType.name,
                            description: cineFunction.room.roomType.description
                        }
                        : null,

                    cinema: cineFunction.room.cinema
                        ? {
                            id: cineFunction.room.cinema.id,
                            name: cineFunction.room.cinema.name,
                            address: cineFunction.room.cinema.address,

                            city: cineFunction.room.cinema.city
                                ? {
                                    id: cineFunction.room.cinema.city.id,
                                    name: cineFunction.room.cinema.city.name
                                }
                                : null
                        }
                        : null
                }
                : null,

            movieRelease: cineFunction.movieRelease
                ? {
                    id: cineFunction.movieRelease.id,
                    releaseDate: cineFunction.movieRelease.releaseDate,
                    countryId: cineFunction.movieRelease.countryId,

                    movie: cineFunction.movieRelease.movie
                        ? {
                            id: cineFunction.movieRelease.movie.id,
                            title: cineFunction.movieRelease.movie.title
                        }
                        : undefined
                }
                : undefined,

            ticketsCount,
            seatLocksCount,
            isSoldOut
        };

        return functionDetail;
    }

    /**
     * Obtiene las funciones futuras de una película.
     *
     * Las funciones pueden filtrarse según la ciudad seleccionada.
     */
    async findFutureFunctions(
        movieId: number,
        cityId?: number
    ): Promise<FunctionDetail[]> {

        const whereClause: any = {
            movieId,
            active: true,
            startsAt: {
                [Op.gt]: new Date(),
            },
        };

        const cineFunctions = await Function.findAll({
            where: whereClause,

            include: [
                {
                    model: FunctionType,
                    as: "functionType",
                },
                {
                    model: Room,
                    as: "room",
                    include: [
                        {
                            model: RoomType,
                            as: "roomType",
                        },
                        {
                            model: Cinema,
                            as: "cinema",
                            include: [
                                {
                                    model: City,
                                    as: "city",
                                    ...(cityId !== undefined
                                        ? { where: { id: cityId } }
                                        : {}),
                                },
                            ],
                        },
                    ],
                },
                {
                    model: MovieRelease,
                    as: "movieRelease",
                    include: [
                        {
                            model: Movie,
                            as: "movie",
                        },
                    ],
                },
            ],

            order: [["startsAt", "ASC"]],
        });

        const functionsWithCounts: FunctionDetail[] = await Promise.all(
            cineFunctions.map(async (func) => {

                const ticketsCount = await Ticket.count({
                    where: {
                        functionId: func.id,
                    },
                });

                const seatLocksCount = await SeatLock.count({
                    where: {
                        functionId: func.id,
                    },
                });

                const base = func.get({ plain: true }) as any;

                const roomCapacity = base.room?.capacity ?? null;

                const isSoldOut =
                    roomCapacity !== null
                        ? ticketsCount >= roomCapacity
                        : null;

                return {
                    id: base.id,
                    startsAt: base.startsAt,
                    basePrice: base.basePrice,
                    active: base.active,

                    functionType: base.functionType
                        ? {
                            id: base.functionType.id,
                            name: base.functionType.name,
                            projection: base.functionType.projection,
                            language: base.functionType.language,
                        }
                        : null,

                    room: base.room
                        ? {
                            id: base.room.id,
                            name: base.room.name,
                            capacity: base.room.capacity,
                            extraPrice: base.room.extraPrice,

                            roomType: base.room.roomType
                                ? {
                                    id: base.room.roomType.id,
                                    name: base.room.roomType.name,
                                    description: base.room.roomType.description,
                                }
                                : null,

                            cinema: base.room.cinema
                                ? {
                                    id: base.room.cinema.id,
                                    name: base.room.cinema.name,
                                    address: base.room.cinema.address,

                                    city: base.room.cinema.city
                                        ? {
                                            id: base.room.cinema.city.id,
                                            name: base.room.cinema.city.name,
                                        }
                                        : null,
                                }
                                : null,
                        }
                        : null,

                    movieRelease: base.movieRelease
                        ? {
                            id: base.movieRelease.id,
                            releaseDate: base.movieRelease.releaseDate,
                            countryId: base.movieRelease.countryId,

                            movie: base.movieRelease.movie
                                ? {
                                    id: base.movieRelease.movie.id,
                                    title: base.movieRelease.movie.title,
                                }
                                : undefined,
                        }
                        : undefined,

                    ticketsCount,
                    seatLocksCount,
                    isSoldOut,
                };
            })
        );

        return functionsWithCounts;
    }


    async getPrices(id: number): Promise<FunctionPriceDetail | null> {
        const cineFunction = await Function.findOne({
            where: {
                id,
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

        if (!cineFunction) {
            return null;
        }

        const roomExtraPrice = cineFunction.room?.extraPrice ?? 0;

        const finalPrice = cineFunction.basePrice + roomExtraPrice;

        return {
            functionId: cineFunction.id,
            basePrice: cineFunction.basePrice,
            roomExtraPrice,
            finalPrice,
        };
    }
    /**
     * 
     * @param {number} id -ID de la entidad a actualizar 
     * @param {FunctionCreationAttributes} data -Son los elementos que vamos a actualizar 
     * @returns {FunctionDetail} -Retorna una entidad de tipo FunctionDetail.
     */
    async update( id: number, data: FunctionCreationAttributes): Promise<Function | null> {
        const cineFunction = await Function.findOne({ where: { id } });
        if (!cineFunction) {
            return null;
        }
        await cineFunction.update(data);
        return await cineFunction.findOne(id);
    }

    /**
     * 
     * @param {number} id -ID de la entidad a liminar 
     * @returns {boolean} -Realiza un soft-delete el cual retorna true para eliminado y falso para no.
     */
    async delete(id: number): Promise<boolean> {
        const row = await Function.destroy({where: {id}});
        return row > 0;
    }

    /**
     * 
     * @param {number} id -ID de la entidad a restaurar que se eliminó anteriormente con un soft-delete. 
     */
    async restore(id: number): Promise<void> {
    const cineFunction = await Function.findOne({ where: { id }, paranoid: false });
        if (cineFunction) {
            await cineFunction.restore();
        } else {
            throw new Error("Función no encontrada");
        }
    }  
}

export default new FunctionRepository();