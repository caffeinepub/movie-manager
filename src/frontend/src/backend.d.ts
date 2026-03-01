import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Movie {
    id: MovieId;
    title: string;
    createdAt: bigint;
    year: bigint;
    description?: string;
    director: string;
    genre: Genre;
    watchStatus: WatchStatus;
    rating?: Rating;
}
export type MovieId = bigint;
export enum Genre {
    SciFi = "SciFi",
    Documentary = "Documentary",
    Action = "Action",
    Drama = "Drama",
    Romance = "Romance",
    Other = "Other",
    Animation = "Animation",
    Thriller = "Thriller",
    Comedy = "Comedy",
    Horror = "Horror"
}
export enum Rating {
    _1 = "_1",
    _2 = "_2",
    _3 = "_3",
    _4 = "_4",
    _5 = "_5"
}
export enum WatchStatus {
    Unwatched = "Unwatched",
    Watchlist = "Watchlist",
    Watched = "Watched"
}
export interface backendInterface {
    addMovie(title: string, year: bigint, genre: Genre, director: string, rating: Rating | null, description: string | null, watchStatus: WatchStatus): Promise<Movie>;
    deleteMovie(id: MovieId): Promise<void>;
    getAllMovies(): Promise<Array<Movie>>;
    getMovie(id: MovieId): Promise<Movie | null>;
    updateMovie(id: MovieId, updatedMovie: Movie): Promise<Movie | null>;
}
