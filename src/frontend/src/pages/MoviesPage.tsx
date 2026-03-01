import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, Search, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { type Genre, type Movie, WatchStatus } from "../backend.d";
import { MovieCard } from "../components/MovieCard";
import { allGenres, ratingToNumber } from "../utils/movieHelpers";

type SortKey = "title-asc" | "year-desc" | "year-asc" | "rating-desc";

interface MoviesPageProps {
  movies: Movie[];
  isLoading: boolean;
  onMovieClick: (movie: Movie) => void;
  onAddClick: () => void;
}

export function MoviesPage({
  movies,
  isLoading,
  onMovieClick,
  onAddClick,
}: MoviesPageProps) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState<Genre | "all">("all");
  const [status, setStatus] = useState<WatchStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("year-desc");

  const filtered = useMemo(() => {
    let result = [...movies];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q),
      );
    }

    if (genre !== "all") {
      result = result.filter((m) => m.genre === genre);
    }

    if (status !== "all") {
      result = result.filter((m) => m.watchStatus === status);
    }

    result.sort((a, b) => {
      switch (sortKey) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "year-desc":
          return Number(b.year - a.year);
        case "year-asc":
          return Number(a.year - b.year);
        case "rating-desc": {
          const ra = a.rating ? ratingToNumber(a.rating) : 0;
          const rb = b.rating ? ratingToNumber(b.rating) : 0;
          return rb - ra;
        }
      }
    });

    return result;
  }, [movies, search, genre, status, sortKey]);

  const hasFilters = search || genre !== "all" || status !== "all";

  const clearFilters = () => {
    setSearch("");
    setGenre("all");
    setStatus("all");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gradient-amber">
            Collection
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {movies.length} movies total
          </p>
        </div>
        <Button onClick={onAddClick} className="gap-2 font-medium">
          <Film size={16} />
          Add Movie
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Search + Sort row */}
        <div className="flex gap-3 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 min-w-0">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or director..."
              className="pl-9"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <Select
            value={sortKey}
            onValueChange={(v) => setSortKey(v as SortKey)}
          >
            <SelectTrigger className="w-auto min-w-[150px] gap-1.5">
              <SlidersHorizontal size={14} className="text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year-desc">Newest First</SelectItem>
              <SelectItem value="year-asc">Oldest First</SelectItem>
              <SelectItem value="title-asc">Title A–Z</SelectItem>
              <SelectItem value="rating-desc">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Genre + Status filters */}
        <div className="flex gap-3 flex-wrap items-center">
          <Select
            value={genre}
            onValueChange={(v) => setGenre(v as Genre | "all")}
          >
            <SelectTrigger className="w-auto min-w-[130px]">
              <SelectValue placeholder="All genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {allGenres.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Tabs
            value={status}
            onValueChange={(v) => setStatus(v as WatchStatus | "all")}
          >
            <TabsList className="h-9">
              <TabsTrigger value="all" className="text-xs px-3">
                All
              </TabsTrigger>
              <TabsTrigger value={WatchStatus.Watched} className="text-xs px-3">
                Watched
              </TabsTrigger>
              <TabsTrigger
                value={WatchStatus.Watchlist}
                className="text-xs px-3"
              >
                Watchlist
              </TabsTrigger>
              <TabsTrigger
                value={WatchStatus.Unwatched}
                className="text-xs px-3"
              >
                Unwatched
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <X size={12} />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="text-xs text-muted-foreground">
          {filtered.length === movies.length
            ? `${movies.length} movies`
            : `${filtered.length} of ${movies.length} movies`}
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k) => (
            <Skeleton key={k} className="h-44 rounded-lg" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((movie) => (
              <MovieCard
                key={movie.id.toString()}
                movie={movie}
                onClick={() => onMovieClick(movie)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-cinema rounded-lg p-16 text-center"
        >
          <Film size={40} className="text-primary/30 mx-auto mb-4" />
          {hasFilters ? (
            <>
              <p className="font-display text-lg font-semibold text-muted-foreground">
                No movies match your filters
              </p>
              <p className="text-sm text-muted-foreground/60 mt-1 mb-4">
                Try adjusting your search or filters
              </p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </>
          ) : (
            <>
              <p className="font-display text-lg font-semibold text-muted-foreground">
                Your collection is empty
              </p>
              <p className="text-sm text-muted-foreground/60 mt-1 mb-4">
                Start building your movie collection
              </p>
              <Button size="sm" onClick={onAddClick}>
                Add First Movie
              </Button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
