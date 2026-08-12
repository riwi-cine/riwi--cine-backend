import Movie from "../../models/movie.model";

export interface MovieFunctionDetail {
    id: number;
    startsAt: Date;
    basePrice: number;
    active: boolean;
    functionType: {
        id: number;
        name: string;
        projection: string;
        language: string;
    } | null;
    room: {
        id: number;
        name: string;
        capacity: number;
        extraPrice: number;
        roomType: {
            id: number;
            name: string;
            description: string;
        } | null;
        cinema: {
            id: number;
            name: string;
            address: string;
            city: {
                id: number;
                name: string;
            } | null;
        } | null;
    } | null;
    movieRelease?: {
        id: number;
        releaseDate: Date;
        countryId: number;
    };
    ticketsCount: number;
    seatLocksCount: number;
    isSoldOut: boolean;
}

export interface IMovieService {
    findDetailById(id: number): Promise<Movie>;
    findFutureFunctions(movieId: number, cityId?: number): Promise<MovieFunctionDetail[]>;
    findRecommendations(movieId: number): Promise<Movie[]>;
}
