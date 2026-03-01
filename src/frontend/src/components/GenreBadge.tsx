import type { Genre } from "../backend.d";
import { genreColors } from "../utils/movieHelpers";

interface GenreBadgeProps {
  genre: Genre;
  size?: "sm" | "md";
}

export function GenreBadge({ genre, size = "md" }: GenreBadgeProps) {
  const color = genreColors[genre];
  const sizeClass =
    size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${color} ${sizeClass}`}
    >
      {genre}
    </span>
  );
}
