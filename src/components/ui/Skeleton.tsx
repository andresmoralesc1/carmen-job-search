interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const variantClasses: Record<string, string> = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const animationClasses: Record<string, string> = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };

  const style = {
    width: width || "100%",
    height: height || (variant === "text" ? "1rem" : "3rem"),
  };

  return (
    <div
      className={`bg-zinc-800 ${variantClasses[variant]} ${animationClasses[animation]} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    />
  );
}

interface CardSkeletonProps {
  showIcon?: boolean;
  lines?: number;
}

export function CardSkeleton({ showIcon = true, lines = 3 }: CardSkeletonProps) {
  return (
    <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      {showIcon && (
        <div className="w-12 h-12 rounded-xl bg-zinc-800 mb-4">
          <Skeleton variant="circular" width="3rem" height="3rem" />
        </div>
      )}
      <Skeleton width="70%" height="1.5rem" className="mb-2" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            width={i === lines - 1 ? "80%" : "100%"}
            height="1rem"
            variant="text"
          />
        ))}
      </div>
    </div>
  );
}

interface StatsSkeletonProps {
  count?: number;
}

export function StatsSkeleton({ count = 4 }: StatsSkeletonProps) {
  return (
    <div className="grid md:grid-cols-4 gap-8 text-center">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton width="100%" height="3rem" className="mb-2 mx-auto" />
          <Skeleton width="60%" height="1rem" className="mx-auto" variant="text" />
        </div>
      ))}
    </div>
  );
}
