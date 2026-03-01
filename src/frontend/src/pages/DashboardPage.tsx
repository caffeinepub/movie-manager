import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Clock, Eye, Film, Star, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { Genre, type Movie, WatchStatus } from "../backend.d";
import { MovieCard } from "../components/MovieCard";
import { ratingToNumber } from "../utils/movieHelpers";

interface DashboardPageProps {
  movies: Movie[];
  isLoading: boolean;
  onMovieClick: (movie: Movie) => void;
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function DashboardPage({
  movies,
  isLoading,
  onMovieClick,
}: DashboardPageProps) {
  const stats = useMemo(() => {
    const watched = movies.filter((m) => m.watchStatus === WatchStatus.Watched);
    const watchlist = movies.filter(
      (m) => m.watchStatus === WatchStatus.Watchlist,
    );
    const unwatched = movies.filter(
      (m) => m.watchStatus === WatchStatus.Unwatched,
    );

    const ratedMovies = movies.filter((m) => m.rating);
    const avgRating =
      ratedMovies.length > 0
        ? ratedMovies.reduce((sum, m) => sum + ratingToNumber(m.rating!), 0) /
          ratedMovies.length
        : null;

    const genreCount: Record<string, number> = {};
    for (const m of movies) {
      genreCount[m.genre] = (genreCount[m.genre] ?? 0) + 1;
    }
    const genreBreakdown = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    const recent = [...movies]
      .sort((a, b) => Number(b.createdAt - a.createdAt))
      .slice(0, 6);

    return { watched, watchlist, unwatched, avgRating, genreBreakdown, recent };
  }, [movies]);

  const statCards = [
    {
      label: "Total Movies",
      value: movies.length,
      icon: Film,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Watched",
      value: stats.watched.length,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Watchlist",
      value: stats.watchlist.length,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Unwatched",
      value: stats.unwatched.length,
      icon: Eye,
      color: "text-slate-400",
      bg: "bg-slate-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient-amber mb-1">
          Your Cinema
        </h1>
        <p className="text-muted-foreground text-sm">
          Track, rate, and manage your movie collection
        </p>
      </motion.div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["s1", "s2", "s3", "s4"].map((k) => (
            <Skeleton key={k} className="h-28 rounded-lg" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {statCards.map((stat) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <Card className="card-cinema border-0">
                <CardContent className="p-4">
                  <div className={`inline-flex p-2 rounded-md ${stat.bg} mb-3`}>
                    <stat.icon size={18} className={stat.color} />
                  </div>
                  <div className="font-display text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Row: Avg Rating + Genre Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Avg Rating */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Card className="card-cinema border-0 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Star size={16} className="text-primary" />
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-24" />
              ) : stats.avgRating !== null ? (
                <div className="flex items-end gap-2">
                  <span className="font-display text-4xl font-bold text-primary">
                    {stats.avgRating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground mb-1">/ 5.0</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No rated movies yet
                </p>
              )}
              {!isLoading && stats.avgRating !== null && (
                <p className="text-xs text-muted-foreground mt-1">
                  Across {movies.filter((m) => m.rating).length} rated movies
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Genre Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <Card className="card-cinema border-0 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" />
                Genres
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {["g1", "g2", "g3", "g4"].map((k) => (
                    <Skeleton key={k} className="h-4 w-full" />
                  ))}
                </div>
              ) : stats.genreBreakdown.length > 0 ? (
                <div className="space-y-2">
                  {stats.genreBreakdown.map(([genre, count]) => (
                    <div key={genre} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-20 shrink-0">
                        {genre}
                      </span>
                      <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(count / movies.length) * 100}%`,
                          }}
                          transition={{
                            delay: 0.5,
                            duration: 0.6,
                            ease: "easeOut",
                          }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground w-4 text-right">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No movies yet
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Movies */}
      <div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-display text-xl font-semibold mb-4"
        >
          Recently Added
        </motion.h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["r1", "r2", "r3", "r4", "r5", "r6"].map((k) => (
              <Skeleton key={k} className="h-40 rounded-lg" />
            ))}
          </div>
        ) : stats.recent.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {stats.recent.map((movie) => (
              <MovieCard
                key={movie.id.toString()}
                movie={movie}
                onClick={() => onMovieClick(movie)}
              />
            ))}
          </motion.div>
        ) : (
          <div className="card-cinema rounded-lg p-12 text-center">
            <Film size={36} className="text-primary/40 mx-auto mb-3" />
            <p className="font-display text-lg font-semibold text-muted-foreground">
              No movies yet
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Add your first movie to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
