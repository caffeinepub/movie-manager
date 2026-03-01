import { Button } from "@/components/ui/button";
import { Clapperboard, Film, Loader2, Lock, Star } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function LoginPage() {
  const { login, isLoggingIn, isInitializing } = useInternetIdentity();

  const isBusy = isLoggingIn || isInitializing;

  return (
    <div className="min-h-screen bg-background film-grain flex flex-col">
      {/* Ambient background layers */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        {/* Radial amber glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 100%, oklch(0.76 0.16 75 / 0.08) 0%, transparent 70%)",
          }}
        />
        {/* Top-left accent */}
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(0.65 0.18 200) 0%, transparent 60%)",
          }}
        />
        {/* Bottom-right accent */}
        <div
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-8"
          style={{
            background:
              "radial-gradient(circle, oklch(0.68 0.2 300) 0%, transparent 60%)",
          }}
        />
        {/* Film strip decorative lines */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between py-6 opacity-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static decorative array
              key={i}
              className="w-full h-6 bg-foreground rounded-sm"
              style={{ opacity: i % 2 === 0 ? 0.6 : 0.2 }}
            />
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-8 flex flex-col justify-between py-6 opacity-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static decorative array
              key={i}
              className="w-full h-6 bg-foreground rounded-sm"
              style={{ opacity: i % 2 === 0 ? 0.6 : 0.2 }}
            />
          ))}
        </div>
      </div>

      {/* Main content — centered column */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          {/* Brand */}
          <div className="flex flex-col items-center mb-10">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease: "backOut" }}
              className="flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.2 0.02 260), oklch(0.16 0.015 270))",
                border: "1px solid oklch(0.76 0.16 75 / 0.3)",
                boxShadow:
                  "0 0 0 1px oklch(0.76 0.16 75 / 0.05), 0 8px 40px oklch(0.76 0.16 75 / 0.15)",
              }}
            >
              <Clapperboard size={28} className="text-primary" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="font-display text-3xl font-bold text-gradient-amber tracking-tight mb-2"
            >
              Cinematheque
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-sm text-muted-foreground text-center"
            >
              Track your movie journey
            </motion.p>
          </div>

          {/* Login card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.35,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="card-cinema rounded-xl p-8"
          >
            <div className="text-center mb-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-1">
                Welcome back
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sign in securely to access your personal movie collection
              </p>
            </div>

            <Button
              onClick={login}
              disabled={isBusy}
              className="w-full h-11 font-semibold text-sm gap-2.5"
              size="lg"
            >
              {isBusy ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isInitializing ? "Initializing…" : "Connecting…"}
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Login with Internet Identity
                </>
              )}
            </Button>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground/50">secure</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <p className="text-center text-xs text-muted-foreground/60 mt-4 leading-relaxed">
              Internet Identity is a privacy-preserving authentication system on
              the Internet Computer — no passwords, no tracking.
            </p>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="grid grid-cols-3 gap-3 mt-6"
          >
            {[
              { icon: Film, label: "Collection" },
              { icon: Star, label: "Ratings" },
              { icon: Clapperboard, label: "Stats" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg"
                style={{
                  background: "oklch(var(--card) / 0.5)",
                  border: "1px solid oklch(var(--border) / 0.5)",
                }}
              >
                <Icon size={16} className="text-primary/70" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative py-4 text-center">
        <p className="text-xs text-muted-foreground/40">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-muted-foreground/70 transition-colors underline underline-offset-2"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
