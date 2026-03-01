import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Loader2,
  Pencil,
  RefreshCw,
  Trash2,
  User,
} from "lucide-react";
import { type Movie, WatchStatus } from "../backend.d";
import { useDeleteMovie, useUpdateMovie } from "../hooks/useQueries";
import { cycleWatchStatus, ratingToNumber } from "../utils/movieHelpers";
import { GenreBadge } from "./GenreBadge";
import { StarRatingDisplay } from "./StarRating";
import { WatchStatusBadge } from "./WatchStatusBadge";

interface MovieDetailModalProps {
  movie: Movie | null;
  open: boolean;
  onClose: () => void;
  onEdit: (movie: Movie) => void;
}

export function MovieDetailModal({
  movie,
  open,
  onClose,
  onEdit,
}: MovieDetailModalProps) {
  const deleteMovie = useDeleteMovie();
  const updateMovie = useUpdateMovie();

  if (!movie) return null;

  const handleDelete = async () => {
    await deleteMovie.mutateAsync(movie.id);
    onClose();
  };

  const handleToggleStatus = async () => {
    const nextStatus = cycleWatchStatus(movie.watchStatus);
    await updateMovie.mutateAsync({
      id: movie.id,
      movie: { ...movie, watchStatus: nextStatus },
    });
  };

  const nextStatus = cycleWatchStatus(movie.watchStatus);
  const statusLabels: Record<WatchStatus, string> = {
    [WatchStatus.Watched]: "Watched",
    [WatchStatus.Watchlist]: "Watchlist",
    [WatchStatus.Unwatched]: "Unwatched",
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <DialogTitle className="font-display text-2xl leading-tight">
                {movie.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <GenreBadge genre={movie.genre} />
            <WatchStatusBadge status={movie.watchStatus} />
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {movie.year.toString()}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {movie.director}
            </span>
          </div>

          {/* Rating */}
          {movie.rating ? (
            <div className="flex items-center gap-2">
              <StarRatingDisplay
                rating={ratingToNumber(movie.rating)}
                size="lg"
              />
              <span className="text-sm text-muted-foreground">
                {ratingToNumber(movie.rating)}/5
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No rating yet
            </p>
          )}

          {/* Description */}
          {movie.description && (
            <>
              <Separator className="bg-border" />
              <p className="text-sm text-foreground/80 leading-relaxed">
                {movie.description}
              </p>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleStatus}
            disabled={updateMovie.isPending}
            className="gap-1.5"
          >
            {updateMovie.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            Mark as {statusLabels[nextStatus]}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(movie)}
            className="gap-1.5"
          >
            <Pencil size={14} />
            Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-destructive hover:text-destructive hover:border-destructive/50"
              >
                <Trash2 size={14} />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete movie?</AlertDialogTitle>
                <AlertDialogDescription>
                  "{movie.title}" will be permanently removed from your
                  collection.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteMovie.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}
