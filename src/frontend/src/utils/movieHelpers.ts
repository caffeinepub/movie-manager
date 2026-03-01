import { Genre, Rating, WatchStatus } from "../backend.d";

export const ratingToNumber = (rating: Rating): number => {
  const map: Record<Rating, number> = {
    [Rating._1]: 1,
    [Rating._2]: 2,
    [Rating._3]: 3,
    [Rating._4]: 4,
    [Rating._5]: 5,
  };
  return map[rating];
};

export const numberToRating = (n: number): Rating => {
  const map: Record<number, Rating> = {
    1: Rating._1,
    2: Rating._2,
    3: Rating._3,
    4: Rating._4,
    5: Rating._5,
  };
  return map[n];
};

export const genreColors: Record<Genre, string> = {
  [Genre.Action]: "bg-red-500/20 text-red-300 border-red-500/30",
  [Genre.Comedy]: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  [Genre.Drama]: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  [Genre.Horror]: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  [Genre.SciFi]: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  [Genre.Romance]: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  [Genre.Documentary]: "bg-green-500/20 text-green-300 border-green-500/30",
  [Genre.Animation]: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  [Genre.Thriller]: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  [Genre.Other]: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

export const watchStatusConfig: Record<
  WatchStatus,
  { label: string; color: string; icon: string }
> = {
  [WatchStatus.Watched]: {
    label: "Watched",
    color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    icon: "✓",
  },
  [WatchStatus.Watchlist]: {
    label: "Watchlist",
    color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    icon: "⊕",
  },
  [WatchStatus.Unwatched]: {
    label: "Unwatched",
    color: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    icon: "○",
  },
};

export const cycleWatchStatus = (current: WatchStatus): WatchStatus => {
  const cycle: WatchStatus[] = [
    WatchStatus.Unwatched,
    WatchStatus.Watchlist,
    WatchStatus.Watched,
  ];
  const idx = cycle.indexOf(current);
  return cycle[(idx + 1) % cycle.length];
};

export const allGenres = Object.values(Genre);
export const allWatchStatuses = Object.values(WatchStatus);
export const allRatings = [1, 2, 3, 4, 5];
