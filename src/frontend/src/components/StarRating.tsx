import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingDisplayProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

export function StarRatingDisplay({
  rating,
  size = "md",
}: StarRatingDisplayProps) {
  const sizeMap = { sm: 12, md: 16, lg: 20 };
  const px = sizeMap[size];

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={px}
          className={
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-muted-foreground/30"
          }
        />
      ))}
    </div>
  );
}

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star === value ? 0 : star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          <Star
            size={24}
            className={
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-muted-foreground/40"
            }
          />
        </button>
      ))}
      {value > 0 && (
        <button
          type="button"
          onClick={() => onChange(0)}
          className="ml-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
