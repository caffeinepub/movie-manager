import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookmarkPlus, Clock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import { type Movie, WatchStatus } from "../backend.d";
import { MovieCard } from "../components/MovieCard";

interface WatchlistPageProps {
  movies: Movie[];
  isLoading: boolean;
  onMovieClick: (movie: Movie) => void;
  onAddClick: () => void;
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

export function WatchlistPage({
  movies,
  isLoading,
  onMovieClick,
  onAddClick,
}: WatchlistPageProps) {
  const watchlistMovies = useMemo(
    () => movies.filter((m) => m.watchStatus === WatchStatus.Watchlist),
    [movies],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-gradient-amber">
            Watchlist
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading
              ? "Loading…"
              : `${watchlistMovies.length} movie${watchlistMovies.length !== 1 ? "s" : ""} queued up`}
          </p>
        </div>
        <Button onClick={onAddClick} className="gap-2 font-medium">
          <BookmarkPlus size={16} />
          Add to Watchlist
        </Button>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
            <Skeleton key={k} className="h-44 rounded-lg" />
          ))}
        </div>
      ) : watchlistMovies.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {watchlistMovies.map((movie) => (
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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card-cinema rounded-xl p-16 text-center"
        >
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 mx-auto"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.2 0.02 260), oklch(0.16 0.015 270))",
              border: "1px solid oklch(0.76 0.16 75 / 0.2)",
            }}
          >
            <Clock size={28} className="text-primary/60" />
          </div>
          <p className="font-display text-xl font-semibold text-foreground mb-2">
            Your watchlist is empty
          </p>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto leading-relaxed">
            Movies you plan to watch will appear here. Start adding films to
            keep track of what's next.
          </p>
          <Button onClick={onAddClick} className="gap-2">
            <BookmarkPlus size={16} />
            Add First Movie
          </Button>
        </motion.div>
      )}
    </div>
  );
}
