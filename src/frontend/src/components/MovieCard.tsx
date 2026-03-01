import { Calendar, User } from "lucide-react";
import { motion } from "motion/react";
import type { Movie } from "../backend.d";
import { ratingToNumber } from "../utils/movieHelpers";
import { GenreBadge } from "./GenreBadge";
import { StarRatingDisplay } from "./StarRating";
import { WatchStatusBadge } from "./WatchStatusBadge";

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="card-cinema rounded-lg p-4 cursor-pointer transition-all duration-200 group select-none"
      aria-label={`View details for ${movie.title}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-base leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
        </div>
        <WatchStatusBadge status={movie.watchStatus} size="sm" />
      </div>

      {/* Genre */}
      <div className="mb-3">
        <GenreBadge genre={movie.genre} size="sm" />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <Calendar size={11} />
          {movie.year.toString()}
        </span>
        <span className="flex items-center gap-1 min-w-0">
          <User size={11} />
          <span className="truncate">{movie.director}</span>
        </span>
      </div>

      {/* Rating */}
      {movie.rating ? (
        <StarRatingDisplay rating={ratingToNumber(movie.rating)} size="sm" />
      ) : (
        <span className="text-xs text-muted-foreground/50 italic">
          No rating
        </span>
      )}

      {/* Description preview */}
      {movie.description && (
        <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {movie.description}
        </p>
      )}
    </motion.div>
  );
}
