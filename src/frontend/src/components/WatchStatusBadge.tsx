import type { WatchStatus } from "../backend.d";
import { watchStatusConfig } from "../utils/movieHelpers";

interface WatchStatusBadgeProps {
  status: WatchStatus;
  size?: "sm" | "md";
}

export function WatchStatusBadge({
  status,
  size = "md",
}: WatchStatusBadgeProps) {
  const config = watchStatusConfig[status];
  const sizeClass =
    size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${config.color} ${sizeClass}`}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}
