// app/src/repositories/movie.repository.ts

import { Op } from "sequelize";
import Movie from "../models/movie.model";
import Actor from "../models/actor.model";
import Genre from "../models/genre.model";
import FunctionModel from "../models/function.model";
import Room from "../models/room.model";
import Cinema from "../models/cinema.model";
import City from "../models/city.model";
import FunctionType from "../models/function-type.model";
import RoomType from "../models/room-type.model";
import MovieBanner from "../models/movie-banner.model";
import MovieRelease from "../models/movie-release.model";
import Ticket from "../models/ticket.model";
import SeatLock from "../models/seat-lock.model";
import {
    IMovieRepository,
    MovieFunctionDetail,
} from "./interfaces/movie.repository.interface";

const MovieModel: any = Movie;
const FunctionEntity: any = FunctionModel;
const TicketModel: any = Ticket;
const SeatLockModel: any = SeatLock;

/**
 * Repositorio de Películas
 * ------------------------
 * Implementa el patrón Repository para encapsular las operaciones
 * de persistencia y consulta relacionadas con la entidad Movie.
 *
 * Esta clase es la única responsable de interactuar con Sequelize.
 */
class MovieRepository implements IMovieRepository {

    /**
     * Obtiene todas las películas ordenadas alfabéticamente.
     */
    async findAll(): Promise<Movie[]> {
        return await Movie.findAll({
            order: [["title", "ASC"]],
        });
    }

    /**
     * Obtiene una película por ID.
     */
    async findById(id: number): Promise<Movie | null> {
        return await Movie.findByPk(id);
    }

    /**
     * Busca películas por coincidencia parcial de título.
     */
    async findByTitle(title: string): Promise<Movie[]> {
        return await Movie.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${title}%`,
                },
            },
            order: [["title", "ASC"]],
        });
    }

    /**
     * Obtiene el detalle completo de una película.
     *
     * Incluye las relaciones necesarias para mostrar la información
     * principal y los datos relacionados de la película.
     */
    async findDetailById(id: number): Promise<Movie | null> {
        return await MovieModel.findByPk(id, {
            include: [
                {
                    model: Actor,
                    as: "actors",
                    through: {
                        attributes: [],
                    },
                },
                {
                    model: Genre,
                    as: "genres",
                    through: {
                        attributes: [],
                    },
                },
                {
                    model: MovieBanner,
                    as: "banners",
                },
                {
                    model: MovieRelease,
                    as: "releases",
                },
            ],
        });
    }

    /**
     * Obtiene las funciones futuras de una película.
     *
     * Las funciones pueden filtrarse según la ciudad seleccionada.
     */
    async findFutureFunctions(
        movieId: number,
        cityId?: number
    ): Promise<MovieFunctionDetail[]> {
        const whereClause: any = {
            movieId,
            active: true,
            startsAt: {
                [Op.gt]: new Date(),
            },
        };

        const functions = await FunctionEntity.findAll({
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
                                    ...(cityId !== undefined ? { where: { id: cityId } } : {}),
                                },
                            ],
                        },
                    ],
                },
                {
                    model: MovieRelease,
                    as: "movieRelease",
                },
            ],
            order: [["startsAt", "ASC"]],
        });

        const functionsWithCounts = await Promise.all(
            functions.map(async (func: any) => {
                const ticketsCount = await TicketModel.count({
                    where: {
                        functionId: func.id,
                    },
                });

                const seatLocksCount = await SeatLockModel.count({
                    where: {
                        functionId: func.id,
                    },
                });

                const base = func.get({ plain: true }) as any;
                return {
                    id: base.id,
                    startsAt: base.startsAt,
                    basePrice: base.basePrice,
                    active: base.active,
                    functionType: base.functionType ?? null,
                    room: base.room ?? null,
                    movieRelease: base.movieRelease ? {
                        id: base.movieRelease.id,
                        releaseDate: base.movieRelease.releaseDate,
                        countryId: base.movieRelease.countryId,
                    } : undefined,
                    ticketsCount,
                    seatLocksCount,
                };
            }),
        );

        return functionsWithCounts;
    }

    /**
     * Obtiene recomendaciones de películas similares.
     *
     * La consulta será implementada posteriormente según
     * los criterios definidos para las recomendaciones.
     */
    async findRecommendations(movieId: number): Promise<Movie[]> {
        const movie = await MovieModel.findByPk(movieId, {
            include: [
                {
                    model: Genre,
                    as: "genres",
                    through: {
                        attributes: [],
                    },
                },
            ],
        });

        if (!movie) {
            return [];
        }

        const genreIds = (movie.get({ plain: true }) as any).genres?.map(
            (genre: any) => genre.id,
        );

        if (!genreIds || !genreIds.length) {
            return [];
        }

        const recommendations = await MovieModel.findAll({
            include: [
                {
                    model: Genre,
                    as: "genres",
                    where: {
                        id: {
                            [Op.in]: genreIds,
                        },
                    },
                    through: {
                        attributes: [],
                    },
                },
            ],
            where: {
                id: {
                    [Op.ne]: movieId,
                },
            },
            limit: 12,
        }) as Movie[];

        const uniqueRecommendations = Array.from<Movie>(
            new Map(recommendations.map((movieItem: Movie) => [movieItem.id, movieItem])).values(),
        ).slice(0, 6);

        return uniqueRecommendations;
    }

    /**
     * Obtiene próximos estrenos para un país (opcionalmente contexto de ciudad).
     * Devuelve una lista de películas única ordenadas por fecha de estreno asc.
     */
    async findUpcoming(countryId: number): Promise<any[]> {
        const releases = await MovieRelease.findAll({
            where: {
                countryId,
                releaseDate: {
                    [Op.gt]: new Date().toISOString().slice(0, 10),
                },
            },
            include: [
                {
                    model: Movie,
                    as: "movie",
                    include: [
                        {
                            model: Genre,
                            as: "genres",
                            through: { attributes: [] },
                        },
                        {
                            model: MovieBanner,
                            as: "banners",
                        },
                    ],
                },
            ],
            order: [["releaseDate", "ASC"]],
        });

        // Mapear a películas únicas
        const map = new Map<number, any>();

        releases.forEach((r: any) => {
            const mv = r.movie ? r.movie.get({ plain: true }) : null;
            if (mv && !map.has(mv.id)) {
                map.set(mv.id, {
                    movieId: mv.id,
                    title: mv.title,
                    posterUrl: mv.posterUrl,
                    releaseDate: r.releaseDate,
                    genres: mv.genres ? mv.genres.map((g: any) => g.name) : [],
                    classification: mv.classification,
                    durationMin: mv.durationMin,
                    trailerUrl: mv.trailerUrl,
                    synopsis: mv.synopsis,
                });
            }
        });

        return Array.from(map.values());
    }

    /**
     * Obtiene detalle de un próximo estreno para una película y país.
     */
    async findUpcomingDetail(movieId: number, countryId: number): Promise<any | null> {
        const release = await MovieRelease.findOne({
            where: {
                movieId,
                countryId,
                releaseDate: {
                    [Op.gt]: new Date().toISOString().slice(0, 10),
                },
            },
            include: [
                {
                    model: Movie,
                    as: "movie",
                    include: [
                        { model: Genre, as: "genres", through: { attributes: [] } },
                        { model: MovieBanner, as: "banners" },
                        { model: Actor, as: "actors", through: { attributes: [] } },
                    ],
                },
            ],
        });

        if (!release) return null;

        const mv = (release as any).movie.get({ plain: true });

        return {
            movieId: mv.id,
            title: mv.title,
            posterUrl: mv.posterUrl,
            banners: mv.banners || [],
            trailerUrl: mv.trailerUrl,
            synopsis: mv.synopsis,
            director: mv.director,
            actors: mv.actors ? mv.actors.map((a: any) => a.name) : [],
            genres: mv.genres ? mv.genres.map((g: any) => g.name) : [],
            durationMin: mv.durationMin,
            classification: mv.classification,
            releaseDate: (release as any).releaseDate,
        };
    }
}

export default new MovieRepository();