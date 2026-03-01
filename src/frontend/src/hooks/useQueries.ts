import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Genre, Movie, MovieId, Rating, WatchStatus } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllMovies() {
  const { actor, isFetching } = useActor();
  return useQuery<Movie[]>({
    queryKey: ["movies"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMovies();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMovie(id: MovieId) {
  const { actor, isFetching } = useActor();
  return useQuery<Movie | null>({
    queryKey: ["movie", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMovie(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export interface AddMovieInput {
  title: string;
  year: bigint;
  genre: Genre;
  director: string;
  rating: Rating | null;
  description: string | null;
  watchStatus: WatchStatus;
}

export function useAddMovie() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddMovieInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addMovie(
        input.title,
        input.year,
        input.genre,
        input.director,
        input.rating,
        input.description,
        input.watchStatus,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast.success("Movie added successfully!");
    },
    onError: () => {
      toast.error("Failed to add movie. Please try again.");
    },
  });
}

export function useUpdateMovie() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, movie }: { id: MovieId; movie: Movie }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateMovie(id, movie);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast.success("Movie updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update movie. Please try again.");
    },
  });
}

export function useDeleteMovie() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: MovieId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteMovie(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast.success("Movie deleted.");
    },
    onError: () => {
      toast.error("Failed to delete movie. Please try again.");
    },
  });
}
