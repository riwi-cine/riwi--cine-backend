// app/src/services/billboard.service.ts

import {
    BillboardCardDto,
    BillboardFunctionScheduleDto,
    BillboardScheduleDto,
} from "../dto/billboard/billboard-card.dto";
import { BillboardQueryDto } from "../dto/billboard/billboard-query.dto";
import billboardRepository from "../repositories/billboard.repository";
import {
    ActiveFunctionRow,
    OccupancyInfo,
} from "../repositories/interfaces/billboard.repository.interface";
import { IBillboardService } from "./interfaces/billboard.service.interface";

type MovieGroup = {
    movieId: number;
    title: string;
    posterUrl: string;
    genres: string[];
    classification: string;
    durationMin: number;
    director: string;
    rating: number;
    functions: FunctionWithOccupancy[];
};

type FunctionWithOccupancy = ActiveFunctionRow & {
    occupancy: OccupancyInfo;
};

/**
 * Servicio de cartelera.
 *
 * Orquesta consultas optimizadas, agrupa funciones por película y aplica las
 * reglas de negocio de la HU-FE-003.
 */
class BillboardService implements IBillboardService {
    /**
     * Obtiene tarjetas de cartelera para una ciudad.
     */
    async getBillboard(params: BillboardQueryDto): Promise<BillboardCardDto[]> {
        this.validateParams(params);

        const exists = await billboardRepository.cityExists(params.cityId);
        if (!exists) {
            throw new Error("cityId no existe");
        }

        const fixedWeekDates = this.getFixedWeekDates();
        const { dateFrom, dateTo } = this.resolveFunctionRange(params.date);

        const rows = await billboardRepository.getActiveFunctionsByCity(
            params.cityId,
            dateFrom,
            dateTo,
        );

        if (rows.length === 0) {
            return [];
        }

        const movieIds = this.uniqueNumbers(rows.map(row => row.movieId));
        const functionIds = this.uniqueNumbers(rows.map(row => row.functionId));
        const countryId = rows[0].countryId;

        const [genresByMovie, occupancyByFunction, releasesByMovie] =
            await Promise.all([
                billboardRepository.getGenresByMovieIds(movieIds),
                billboardRepository.getOccupancyByFunctionIds(functionIds),
                billboardRepository.getReleasesByMovieIds(movieIds, countryId),
            ]);

        const functions = rows
            .map(row => ({
                ...row,
                occupancy:
                    occupancyByFunction.get(row.functionId) ??
                    this.emptyOccupancy(row.roomCapacity),
            }))
            .filter(row => !params.availableOnly || !row.occupancy.isSoldOut)
            .filter(row => this.matchesFunctionFilters(row, params));

        const groupedMovies = this.groupByMovie(functions, genresByMovie)
            .filter(group => this.matchesMovieFilters(group, params))
            .filter(group => group.functions.length > 0);

        return groupedMovies.map(group =>
            this.toBillboardCard(group, fixedWeekDates, releasesByMovie),
        );
    }

    private validateParams(params: BillboardQueryDto): void {
        if (!Number.isInteger(params.cityId) || params.cityId <= 0) {
            throw new Error("cityId es obligatorio y debe ser un número válido");
        }

        if (params.date && !this.isValidDateOnly(params.date)) {
            throw new Error("date debe tener formato YYYY-MM-DD");
        }

        if (
            params.cinemaId !== undefined &&
            (!Number.isInteger(params.cinemaId) || params.cinemaId <= 0)
        ) {
            throw new Error("cinemaId debe ser un número válido");
        }
    }

    private resolveFunctionRange(date?: string): { dateFrom: Date; dateTo: Date } {
        if (date) {
            return {
                dateFrom: this.startOfDay(new Date(`${date}T00:00:00`)),
                dateTo: this.endOfDay(new Date(`${date}T00:00:00`)),
            };
        }

        const today = this.localToday();
        const lastDay = this.addDays(today, 6);

        return {
            dateFrom: this.startOfDay(today),
            dateTo: this.endOfDay(lastDay),
        };
    }

    private getFixedWeekDates(): string[] {
        const today = this.localToday();

        return Array.from({ length: 7 }, (_, index) =>
            this.toDateOnly(this.addDays(today, index)),
        );
    }

    private groupByMovie(
        functions: FunctionWithOccupancy[],
        genresByMovie: Map<number, string[]>,
    ): MovieGroup[] {
        const groups = new Map<number, MovieGroup>();

        for (const row of functions) {
            const group =
                groups.get(row.movieId) ??
                ({
                    movieId: row.movieId,
                    title: row.movieTitle,
                    posterUrl: row.posterUrl,
                    genres: genresByMovie.get(row.movieId) ?? [],
                    classification: row.classification,
                    durationMin: Number(row.durationMin),
                    director: row.director,
                    rating: Number(row.rating),
                    functions: [],
                } satisfies MovieGroup);

            group.functions.push(row);
            groups.set(row.movieId, group);
        }

        return Array.from(groups.values()).sort((a, b) =>
            a.title.localeCompare(b.title),
        );
    }

    private matchesFunctionFilters(
        row: FunctionWithOccupancy,
        params: BillboardQueryDto,
    ): boolean {
        if (params.language && row.language !== params.language) {
            return false;
        }

        if (params.roomType && row.roomTypeName !== params.roomType) {
            return false;
        }

        if (params.format && row.projection !== params.format) {
            return false;
        }

        if (params.cinemaId && row.cinemaId !== params.cinemaId) {
            return false;
        }

        return true;
    }

    private matchesMovieFilters(group: MovieGroup, params: BillboardQueryDto): boolean {
        if (params.genre && !group.genres.includes(params.genre)) {
            return false;
        }

        if (
            params.classification &&
            group.classification !== params.classification
        ) {
            return false;
        }

        return true;
    }

    private toBillboardCard(
        group: MovieGroup,
        fixedWeekDates: string[],
        releasesByMovie: Map<number, Date>,
    ): BillboardCardDto {
        const schedules = this.buildSchedules(group.functions, fixedWeekDates);
        const formats = this.uniqueStrings(
            group.functions.map(row => row.projection),
        );
        const languages = this.uniqueStrings(
            group.functions.map(row => row.language),
        );

        return {
            movieId: group.movieId,
            title: group.title,
            posterUrl: group.posterUrl,
            genres: group.genres,
            classification: group.classification,
            durationMin: group.durationMin,
            director: group.director,
            language: languages[0] ?? "",
            dubbedOrSubtitled: languages.join(", "),
            formats,
            schedules,
            rating: group.rating,
            isNewRelease: this.isNewRelease(releasesByMovie.get(group.movieId)),
            isSoldOut: group.functions.every(row => row.occupancy.isSoldOut),
        };
    }

    private buildSchedules(
        functions: FunctionWithOccupancy[],
        fixedWeekDates: string[],
    ): BillboardScheduleDto[] {
        const schedulesByDate = new Map<string, BillboardFunctionScheduleDto[]>();

        for (const date of fixedWeekDates) {
            schedulesByDate.set(date, []);
        }

        for (const row of functions) {
            const date = this.toDateOnly(new Date(row.startsAt));
            const dayFunctions = schedulesByDate.get(date);

            if (!dayFunctions) {
                continue;
            }

            dayFunctions.push({
                functionId: row.functionId,
                startsAt: new Date(row.startsAt).toISOString(),
                time: this.toTime(new Date(row.startsAt)),
                cinemaId: row.cinemaId,
                cinemaName: row.cinemaName,
                roomId: row.roomId,
                roomName: row.roomName,
                roomType: row.roomTypeName,
                format: row.projection,
                language: row.language,
                dubbedOrSubtitled: row.language,
                basePrice: Number(row.basePrice),
                availableSeats: row.occupancy.available,
                isSoldOut: row.occupancy.isSoldOut,
            });
        }

        return fixedWeekDates.map(date => ({
            date,
            functions: (schedulesByDate.get(date) ?? []).sort((a, b) =>
                a.startsAt.localeCompare(b.startsAt),
            ),
        }));
    }

    private isNewRelease(releaseDate?: Date): boolean {
        if (!releaseDate) {
            return false;
        }

        const today = this.startOfDay(this.localToday());
        const releaseDay = this.startOfDay(releaseDate);
        const limit = this.endOfDay(this.addDays(releaseDay, 7));

        return releaseDay <= today && today <= limit;
    }

    private emptyOccupancy(capacity: number): OccupancyInfo {
        return {
            capacity,
            sold: 0,
            locked: 0,
            available: capacity,
            isSoldOut: false,
        };
    }

    private uniqueNumbers(values: number[]): number[] {
        return Array.from(new Set(values.map(value => Number(value))));
    }

    private uniqueStrings(values: string[]): string[] {
        return Array.from(new Set(values.filter(Boolean)));
    }

    private isValidDateOnly(value: string): boolean {
        return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
    }

    private localToday(): Date {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    private startOfDay(date: Date): Date {
        const copy = new Date(date);
        copy.setHours(0, 0, 0, 0);
        return copy;
    }

    private endOfDay(date: Date): Date {
        const copy = new Date(date);
        copy.setHours(23, 59, 59, 999);
        return copy;
    }

    private addDays(date: Date, days: number): Date {
        const copy = new Date(date);
        copy.setDate(copy.getDate() + days);
        return copy;
    }

    private toDateOnly(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    private toTime(date: Date): string {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${hours}:${minutes}`;
    }
}

export default new BillboardService();
