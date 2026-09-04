// app/src/repositories/billboard.repository.ts

import { Sequelize } from "sequelize";
import dbInstance from "../config/database";
import City from "../models/city.model";
import MovieRelease from "../models/movie-release.model";
import {
    ActiveFunctionRow,
    IBillboardRepository,
    OccupancyInfo,
} from "./interfaces/billboard.repository.interface";

// Casteamos la conexión a 'any' para que TypeScript permita invocar .query() sin conflicto de definiciones
const sequelize: any = dbInstance;
const QueryTypes = (Sequelize as any).QueryTypes || { SELECT: "SELECT" };

type GenreRow = {
    movieId: number;
    genreName: string;
};

type CountRow = {
    functionId: number;
    count: string;
};

type CapacityRow = {
    functionId: number;
    capacity: number;
};

/**
 * Repositorio de cartelera.
 *
 * Ejecuta consultas acotadas por ciudad/rango y separa géneros, ocupación y
 * estrenos para evitar duplicados por relaciones N:M y consultas N+1.
 */
class BillboardRepository implements IBillboardRepository {
    /**
     * Verifica que la ciudad exista antes de consultar cartelera.
     */
    async cityExists(cityId: number): Promise<boolean> {
        const count = await City.count({ where: { id: cityId } });
        return count > 0;
    }

    /**
     * Obtiene funciones activas de una ciudad en un rango de fechas.
     *
     * Se usa SQL explícito porque el modelo Function tiene movieId, pero las
     * asociaciones actuales no declaran Function -> Movie.
     */
    async getActiveFunctionsByCity(
        cityId: number,
        dateFrom: Date,
        dateTo: Date,
    ): Promise<ActiveFunctionRow[]> {
        return (await sequelize.query(
            `
            SELECT
                f.id AS "functionId",
                f.movie_id AS "movieId",
                f.starts_at AS "startsAt",
                f.base_price AS "basePrice",
                m.title AS "movieTitle",
                m.poster_url AS "posterUrl",
                m.classification AS "classification",
                m.duration_min AS "durationMin",
                m.director AS "director",
                m.rating AS "rating",
                c.id AS "cinemaId",
                c.name AS "cinemaName",
                r.id AS "roomId",
                r.name AS "roomName",
                r.capacity AS "roomCapacity",
                rt.name AS "roomTypeName",
                ft.name AS "functionTypeName",
                ft.projection AS "projection",
                ft.language AS "language",
                ci.id AS "cityId",
                co.id AS "countryId"
            FROM functions f
            INNER JOIN movies m ON m.id = f.movie_id
            INNER JOIN rooms r ON r.id = f.room_id
            INNER JOIN room_types rt ON rt.id = r.room_type_id
            INNER JOIN cinemas c ON c.id = r.cinema_id
            INNER JOIN cities ci ON ci.id = c.city_id
            INNER JOIN departments d ON d.id = ci.department_id
            INNER JOIN countries co ON co.id = d.country_id
            INNER JOIN function_types ft ON ft.id = f.function_type_id
            WHERE
                f.active = true
                AND c.active = true
                AND c.city_id = :cityId
                AND f.starts_at BETWEEN :dateFrom AND :dateTo
            ORDER BY m.title ASC, f.starts_at ASC
            `,
            {
                replacements: { cityId, dateFrom, dateTo },
                type: QueryTypes.SELECT,
            },
        )) as unknown as ActiveFunctionRow[];
    }

    /**
     * Obtiene géneros para múltiples películas en una sola consulta.
     */
    async getGenresByMovieIds(movieIds: number[]): Promise<Map<number, string[]>> {
        const genresByMovie = new Map<number, string[]>();

        if (movieIds.length === 0) {
            return genresByMovie;
        }

        const rows = (await sequelize.query(
            `
            SELECT mg.movie_id AS "movieId", g.name AS "genreName"
            FROM movie_genres mg
            INNER JOIN genres g ON g.id = mg.genre_id
            WHERE mg.movie_id IN (:movieIds)
            ORDER BY g.name ASC
            `,
            {
                replacements: { movieIds },
                type: QueryTypes.SELECT,
            },
        )) as unknown as GenreRow[];

        for (const row of rows) {
            const movieId = Number(row.movieId);
            const genreName = row.genreName;

            if (!genreName) {
                continue;
            }

            const currentGenres = genresByMovie.get(movieId) ?? [];
            currentGenres.push(genreName);
            genresByMovie.set(movieId, currentGenres);
        }

        return genresByMovie;
    }

    /**
     * Calcula ocupación con tickets vendidos + bloqueos vigentes contra capacidad.
     */
    async getOccupancyByFunctionIds(
        functionIds: number[],
    ): Promise<Map<number, OccupancyInfo>> {
        const occupancyByFunction = new Map<number, OccupancyInfo>();

        if (functionIds.length === 0) {
            return occupancyByFunction;
        }

        const capacityRows = (await sequelize.query(
            `
            SELECT f.id AS "functionId", r.capacity AS "capacity"
            FROM functions f
            INNER JOIN rooms r ON r.id = f.room_id
            WHERE f.id IN (:functionIds)
            `,
            {
                replacements: { functionIds },
                type: QueryTypes.SELECT,
            },
        )) as unknown as CapacityRow[];

        const soldRows = (await sequelize.query(
            `
            SELECT function_id AS "functionId", COUNT(*) AS "count"
            FROM tickets
            WHERE function_id IN (:functionIds)
            GROUP BY function_id
            `,
            {
                replacements: { functionIds },
                type: QueryTypes.SELECT,
            },
        )) as unknown as CountRow[];

        const lockedRows = (await sequelize.query(
            `
            SELECT function_id AS "functionId", COUNT(*) AS "count"
            FROM seat_locks
            WHERE function_id IN (:functionIds)
              AND expires_at > NOW()
            GROUP BY function_id
            `,
            {
                replacements: { functionIds },
                type: QueryTypes.SELECT,
            },
        )) as unknown as CountRow[];

        const soldByFunction = this.toCountMap(soldRows);
        const lockedByFunction = this.toCountMap(lockedRows);

        for (const row of capacityRows) {
            const functionId = Number(row.functionId);
            const capacity = Number(row.capacity);
            const sold = soldByFunction.get(functionId) ?? 0;
            const locked = lockedByFunction.get(functionId) ?? 0;
            const available = Math.max(capacity - sold - locked, 0);

            occupancyByFunction.set(functionId, {
                capacity,
                sold,
                locked,
                available,
                isSoldOut: available === 0,
            });
        }

        return occupancyByFunction;
    }

    /**
     * Obtiene fechas de estreno por país para calcular ventana de estreno.
     */
    async getReleasesByMovieIds(
        movieIds: number[],
        countryId: number,
    ): Promise<Map<number, Date>> {
        const releasesByMovie = new Map<number, Date>();

        if (movieIds.length === 0) {
            return releasesByMovie;
        }

        const releases = await MovieRelease.findAll({
            where: {
                movieId: movieIds,
                countryId,
            },
            attributes: ["movieId", "releaseDate"],
        });

        for (const release of releases) {
            const releaseDateVal = release.releaseDate;
            const parsedDate =
                releaseDateVal instanceof Date
                    ? releaseDateVal
                    : new Date(`${String(releaseDateVal).split("T")[0]}T00:00:00`);

            releasesByMovie.set(release.movieId, parsedDate);
        }

        return releasesByMovie;
    }

    private toCountMap(rows: CountRow[]): Map<number, number> {
        const map = new Map<number, number>();

        for (const row of rows) {
            map.set(Number(row.functionId), Number(row.count));
        }

        return map;
    }
}

export default new BillboardRepository();