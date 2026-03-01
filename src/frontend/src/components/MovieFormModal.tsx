import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { type Genre, type Movie, Rating, WatchStatus } from "../backend.d";
import {
  type AddMovieInput,
  useAddMovie,
  useUpdateMovie,
} from "../hooks/useQueries";
import {
  allGenres,
  allWatchStatuses,
  numberToRating,
} from "../utils/movieHelpers";
import { StarRatingInput } from "./StarRating";

interface MovieFormModalProps {
  open: boolean;
  onClose: () => void;
  movie?: Movie | null;
}

interface FormState {
  title: string;
  year: string;
  genre: Genre | "";
  director: string;
  rating: number;
  description: string;
  watchStatus: WatchStatus | "";
}

const defaultForm: FormState = {
  title: "",
  year: "",
  genre: "",
  director: "",
  rating: 0,
  description: "",
  watchStatus: WatchStatus.Unwatched,
};

export function MovieFormModal({ open, onClose, movie }: MovieFormModalProps) {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const addMovie = useAddMovie();
  const updateMovie = useUpdateMovie();
  const isPending = addMovie.isPending || updateMovie.isPending;

  const isEditing = !!movie;

  useEffect(() => {
    if (movie) {
      setForm({
        title: movie.title,
        year: movie.year.toString(),
        genre: movie.genre,
        director: movie.director,
        rating: movie.rating
          ? Number.parseInt(movie.rating.replace("_", ""))
          : 0,
        description: movie.description ?? "",
        watchStatus: movie.watchStatus,
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [movie]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.year) {
      newErrors.year = "Year is required";
    } else {
      const y = Number.parseInt(form.year);
      if (Number.isNaN(y) || y < 1888 || y > 2030) {
        newErrors.year = "Year must be between 1888 and 2030";
      }
    }
    if (!form.genre) newErrors.genre = "Genre is required";
    if (!form.director.trim()) newErrors.director = "Director is required";
    if (!form.watchStatus) newErrors.watchStatus = "Watch status is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const input: AddMovieInput = {
      title: form.title.trim(),
      year: BigInt(form.year),
      genre: form.genre as Genre,
      director: form.director.trim(),
      rating: form.rating > 0 ? numberToRating(form.rating) : null,
      description: form.description.trim() || null,
      watchStatus: form.watchStatus as WatchStatus,
    };

    if (isEditing && movie) {
      await updateMovie.mutateAsync({
        id: movie.id,
        movie: {
          ...movie,
          ...input,
          description: input.description ?? undefined,
          rating: input.rating ?? undefined,
        },
      });
    } else {
      await addMovie.mutateAsync(input);
    }
    onClose();
  };

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEditing ? "Edit Movie" : "Add Movie"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Blade Runner 2049"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Year + Genre row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="year">
                Year <span className="text-destructive">*</span>
              </Label>
              <Input
                id="year"
                type="number"
                min={1888}
                max={2030}
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
                placeholder="2024"
                className={errors.year ? "border-destructive" : ""}
              />
              {errors.year && (
                <p className="text-xs text-destructive">{errors.year}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>
                Genre <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.genre}
                onValueChange={(v) => set("genre", v as Genre)}
              >
                <SelectTrigger
                  className={errors.genre ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {allGenres.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.genre && (
                <p className="text-xs text-destructive">{errors.genre}</p>
              )}
            </div>
          </div>

          {/* Director */}
          <div className="space-y-1.5">
            <Label htmlFor="director">
              Director <span className="text-destructive">*</span>
            </Label>
            <Input
              id="director"
              value={form.director}
              onChange={(e) => set("director", e.target.value)}
              placeholder="e.g. Denis Villeneuve"
              className={errors.director ? "border-destructive" : ""}
            />
            {errors.director && (
              <p className="text-xs text-destructive">{errors.director}</p>
            )}
          </div>

          {/* Watch Status */}
          <div className="space-y-1.5">
            <Label>
              Watch Status <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.watchStatus}
              onValueChange={(v) => set("watchStatus", v as WatchStatus)}
            >
              <SelectTrigger
                className={errors.watchStatus ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {allWatchStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.watchStatus && (
              <p className="text-xs text-destructive">{errors.watchStatus}</p>
            )}
          </div>

          {/* Rating */}
          <div className="space-y-1.5">
            <Label>Rating (optional)</Label>
            <StarRatingInput
              value={form.rating}
              onChange={(v) => set("rating", v)}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Brief synopsis or notes..."
              rows={3}
              className="resize-none"
            />
          </div>
        </form>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Save Changes" : "Add Movie"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
