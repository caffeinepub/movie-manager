import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Eye,
  Film,
  Star,
  Timer,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { type Movie, Rating, WatchStatus } from "../backend.d";
import { ratingToNumber } from "../utils/movieHelpers";

interface StatisticsPageProps {
  movies: Movie[];
  isLoading: boolean;
}

const AVG_RUNTIME_MIN = 90;

const WATCH_STATUS_CONFIG = {
  [WatchStatus.Watched]: {
    label: "Watched",
    color: "bg-emerald-400",
    textColor: "text-emerald-400",
    bgLight: "bg-emerald-500/10",
  },
  [WatchStatus.Watchlist]: {
    label: "Watchlist",
    color: "bg-amber-400",
    textColor: "text-amber-400",
    bgLight: "bg-amber-500/10",
  },
  [WatchStatus.Unwatched]: {
    label: "Unwatched",
    color: "bg-slate-400",
    textColor: "text-slate-400",
    bgLight: "bg-slate-500/10",
  },
};

const GENRE_COLORS = [
  "bg-primary",
  "bg-cyan-400",
  "bg-emerald-400",
  "bg-violet-400",
  "bg-pink-400",
  "bg-orange-400",
  "bg-blue-400",
  "bg-rose-400",
  "bg-teal-400",
  "bg-yellow-400",
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export function StatisticsPage({ movies, isLoading }: StatisticsPageProps) {
  const stats = useMemo(() => {
    if (movies.length === 0) return null;

    // Watch status breakdown
    const watchedCount = movies.filter(
      (m) => m.watchStatus === WatchStatus.Watched,
    ).length;
    const watchlistCount = movies.filter(
      (m) => m.watchStatus === WatchStatus.Watchlist,
    ).length;
    const unwatchedCount = movies.filter(
      (m) => m.watchStatus === WatchStatus.Unwatched,
    ).length;

    // Genre distribution
    const genreCount: Record<string, number> = {};
    for (const m of movies) {
      genreCount[m.genre] = (genreCount[m.genre] ?? 0) + 1;
    }
    const genreBreakdown = Object.entries(genreCount).sort(
      (a, b) => b[1] - a[1],
    );
    const topGenre = genreBreakdown[0]?.[0] ?? "—";

    // Rating breakdown
    const ratingBreakdown = [
      Rating._5,
      Rating._4,
      Rating._3,
      Rating._2,
      Rating._1,
    ].map((r) => ({
      stars: ratingToNumber(r),
      count: movies.filter((m) => m.rating === r).length,
    }));
    const maxRatingCount = Math.max(...ratingBreakdown.map((r) => r.count), 1);

    // Year stats
    const yearCount: Record<string, number> = {};
    for (const m of movies) {
      const y = m.year.toString();
      yearCount[y] = (yearCount[y] ?? 0) + 1;
    }
    const mostWatchedYear = Object.entries(yearCount).sort(
      (a, b) => b[1] - a[1],
    )[0]?.[0];

    // Runtime
    const totalRuntimeMin = watchedCount * AVG_RUNTIME_MIN;
    const runtimeHours = Math.floor(totalRuntimeMin / 60);
    const runtimeMins = totalRuntimeMin % 60;

    // Avg rating
    const ratedMovies = movies.filter((m) => m.rating);
    const avgRating =
      ratedMovies.length > 0
        ? ratedMovies.reduce((sum, m) => sum + ratingToNumber(m.rating!), 0) /
          ratedMovies.length
        : null;

    return {
      watchedCount,
      watchlistCount,
      unwatchedCount,
      genreBreakdown,
      topGenre,
      ratingBreakdown,
      maxRatingCount,
      mostWatchedYear,
      runtimeHours,
      runtimeMins,
      avgRating,
      total: movies.length,
    };
  }, [movies]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["s1", "s2", "s3", "s4"].map((k) => (
            <Skeleton key={k} className="h-28 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["c1", "c2"].map((k) => (
            <Skeleton key={k} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient-amber mb-1">
          Statistics
        </h1>
        <p className="text-muted-foreground text-sm">
          Insights from your {movies.length} movie collection
        </p>
      </motion.div>

      {movies.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-cinema rounded-xl p-16 text-center"
        >
          <BarChart3 size={40} className="text-primary/30 mx-auto mb-4" />
          <p className="font-display text-xl font-semibold text-muted-foreground">
            No data yet
          </p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            Add movies to see your statistics
          </p>
        </motion.div>
      ) : (
        <>
          {/* Summary stat cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              {
                icon: Film,
                label: "Total Movies",
                value: stats!.total,
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                icon: Timer,
                label: "Hours Watched",
                value: `${stats!.runtimeHours}h ${stats!.runtimeMins}m`,
                color: "text-cyan-400",
                bg: "bg-cyan-500/10",
              },
              {
                icon: TrendingUp,
                label: "Top Genre",
                value: stats!.topGenre,
                color: "text-violet-400",
                bg: "bg-violet-500/10",
              },
              {
                icon: Star,
                label: "Avg Rating",
                value:
                  stats!.avgRating !== null
                    ? `${stats!.avgRating.toFixed(1)} / 5`
                    : "—",
                color: "text-amber-400",
                bg: "bg-amber-500/10",
              },
            ].map((card) => (
              <motion.div key={card.label} variants={itemVariants}>
                <Card className="card-cinema border-0 h-full">
                  <CardContent className="p-4">
                    <div
                      className={`inline-flex p-2 rounded-md ${card.bg} mb-3`}
                    >
                      <card.icon size={18} className={card.color} />
                    </div>
                    <div className="font-display text-xl font-bold text-foreground truncate">
                      {card.value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {card.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Watch Status Breakdown */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              {
                status: WatchStatus.Watched,
                count: stats!.watchedCount,
                icon: CheckCircle2,
              },
              {
                status: WatchStatus.Watchlist,
                count: stats!.watchlistCount,
                icon: Clock,
              },
              {
                status: WatchStatus.Unwatched,
                count: stats!.unwatchedCount,
                icon: Eye,
              },
            ].map(({ status, count, icon: Icon }) => {
              const cfg = WATCH_STATUS_CONFIG[status];
              const pct =
                stats!.total > 0 ? Math.round((count / stats!.total) * 100) : 0;
              return (
                <motion.div key={status} variants={itemVariants}>
                  <Card className="card-cinema border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-md ${cfg.bgLight}`}>
                            <Icon size={14} className={cfg.textColor} />
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {cfg.label}
                          </span>
                        </div>
                        <span className={`text-sm font-bold ${cfg.textColor}`}>
                          {pct}%
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{
                            delay: 0.4,
                            duration: 0.7,
                            ease: "easeOut",
                          }}
                          className={`h-full rounded-full ${cfg.color}`}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {count} movie{count !== 1 ? "s" : ""}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Genre Distribution + Rating Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Genre Distribution */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Card className="card-cinema border-0 h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary" />
                    Genre Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats!.genreBreakdown.map(([genre, count], idx) => {
                      const pct = Math.round((count / stats!.total) * 100);
                      return (
                        <div key={genre} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground font-medium">
                              {genre}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {count}
                              </span>
                              <span className="text-xs font-semibold text-foreground w-8 text-right">
                                {pct}%
                              </span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{
                                delay: 0.4 + idx * 0.04,
                                duration: 0.6,
                                ease: "easeOut",
                              }}
                              className={`h-full rounded-full ${GENRE_COLORS[idx % GENRE_COLORS.length]}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Rating Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              <Card className="card-cinema border-0 h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <Star size={16} className="text-primary" />
                    Rating Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats!.ratingBreakdown.map(({ stars, count }) => (
                      <div key={stars} className="flex items-center gap-3">
                        {/* Stars label */}
                        <div className="flex items-center gap-0.5 w-20 shrink-0">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              // biome-ignore lint/suspicious/noArrayIndexKey: static stars display
                              key={i}
                              size={10}
                              className={
                                i < stars
                                  ? "text-primary fill-primary"
                                  : "text-muted-foreground/30"
                              }
                            />
                          ))}
                        </div>
                        {/* Bar */}
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(count / stats!.maxRatingCount) * 100}%`,
                            }}
                            transition={{
                              delay: 0.5 + (5 - stars) * 0.06,
                              duration: 0.6,
                              ease: "easeOut",
                            }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground w-5 text-right shrink-0">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>

                  {stats!.avgRating !== null && (
                    <div className="mt-4 pt-3 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Average rating
                        </span>
                        <span className="font-display text-lg font-bold text-primary">
                          {stats!.avgRating.toFixed(1)}
                          <span className="text-xs text-muted-foreground font-normal ml-1">
                            / 5
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Most active year */}
          {stats!.mostWatchedYear && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Card className="card-cinema border-0">
                <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10">
                      <Film size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Most represented year
                      </p>
                      <p className="font-display text-2xl font-bold text-primary">
                        {stats!.mostWatchedYear}
                      </p>
                    </div>
                  </div>
                  <div className="sm:ml-8 flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-cyan-500/10">
                      <Timer size={20} className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Estimated watch time
                      </p>
                      <p className="font-display text-2xl font-bold text-cyan-400">
                        {stats!.runtimeHours}h{" "}
                        <span className="text-lg">{stats!.runtimeMins}m</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
