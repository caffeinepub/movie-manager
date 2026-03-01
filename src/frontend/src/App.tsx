import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart3,
  Bookmark,
  Clapperboard,
  Film,
  LayoutDashboard,
  List,
  Loader2,
  LogOut,
  Plus,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Movie } from "./backend.d";
import { MovieDetailModal } from "./components/MovieDetailModal";
import { MovieFormModal } from "./components/MovieFormModal";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetAllMovies } from "./hooks/useQueries";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { MoviesPage } from "./pages/MoviesPage";
import { StatisticsPage } from "./pages/StatisticsPage";
import { WatchlistPage } from "./pages/WatchlistPage";

type Page = "dashboard" | "movies" | "watchlist" | "statistics";

function formatPrincipal(principal: string): string {
  if (principal.length <= 12) return principal;
  return `${principal.slice(0, 6)}…${principal.slice(-4)}`;
}

export default function App() {
  const { identity, clear, isInitializing } = useInternetIdentity();

  const [page, setPage] = useState<Page>("dashboard");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  const { data: movies = [], isLoading } = useGetAllMovies();

  // --- Auth gating ---
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background film-grain flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.2 0.02 260), oklch(0.16 0.015 270))",
              border: "1px solid oklch(0.76 0.16 75 / 0.3)",
            }}
          >
            <Clapperboard size={24} className="text-primary" />
          </div>
          <Loader2 size={20} className="text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <LoginPage />;
  }

  // --- Authenticated app ---
  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setDetailOpen(true);
  };

  const handleAddClick = () => {
    setEditingMovie(null);
    setFormOpen(true);
  };

  const handleEditFromDetail = (movie: Movie) => {
    setDetailOpen(false);
    setEditingMovie(movie);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingMovie(null);
  };

  const navItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] =
    [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "movies", label: "Collection", icon: List },
      { id: "watchlist", label: "Watchlist", icon: Bookmark },
      { id: "statistics", label: "Statistics", icon: BarChart3 },
    ];

  const principalStr = identity.getPrincipal().toString();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background film-grain">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              {/* Logo */}
              <button
                type="button"
                onClick={() => setPage("dashboard")}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/15 border border-primary/30">
                  <Clapperboard size={16} className="text-primary" />
                </div>
                <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">
                  Cinematheque
                </span>
              </button>

              {/* Nav */}
              <nav className="flex items-center gap-0.5">
                {navItems.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setPage(item.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      page === item.id
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <item.icon size={15} />
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Right: Add button + User */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleAddClick}
                  className="gap-1.5 font-medium"
                >
                  <Plus size={15} />
                  <span className="hidden sm:inline">Add Movie</span>
                </Button>

                {/* User identity */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-transparent hover:border-border"
                    >
                      <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                        <User size={11} className="text-primary" />
                      </div>
                      <span className="hidden lg:inline font-mono text-[10px]">
                        {formatPrincipal(principalStr)}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="font-mono text-xs max-w-xs break-all"
                  >
                    {principalStr}
                  </TooltipContent>
                </Tooltip>

                {/* Logout */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={clear}
                      className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label="Log out"
                    >
                      <LogOut size={15} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Log out</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {page === "dashboard" && (
                <DashboardPage
                  movies={movies}
                  isLoading={isLoading}
                  onMovieClick={handleMovieClick}
                />
              )}
              {page === "movies" && (
                <MoviesPage
                  movies={movies}
                  isLoading={isLoading}
                  onMovieClick={handleMovieClick}
                  onAddClick={handleAddClick}
                />
              )}
              {page === "watchlist" && (
                <WatchlistPage
                  movies={movies}
                  isLoading={isLoading}
                  onMovieClick={handleMovieClick}
                  onAddClick={handleAddClick}
                />
              )}
              {page === "statistics" && (
                <StatisticsPage movies={movies} isLoading={isLoading} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-16 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground/60">
              <Film size={13} />
              <span className="text-xs">Cinematheque</span>
            </div>
            <p className="text-xs text-muted-foreground/50">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-muted-foreground transition-colors underline underline-offset-2"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>

        {/* Modals */}
        <MovieDetailModal
          movie={selectedMovie}
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          onEdit={handleEditFromDetail}
        />

        <MovieFormModal
          open={formOpen}
          onClose={handleFormClose}
          movie={editingMovie}
        />

        <Toaster position="bottom-right" />
      </div>
    </TooltipProvider>
  );
}
