import { useEffect, useRef, useState } from "react";
import type { MatchBreakdown as MatchBreakdownType } from "../types";

const BAR_COLORS: Record<string, string> = {
  "Skill Match": "from-accent-400 to-accent-500",
  "Interest Match": "from-sky-400 to-sky-500",
  "Goal Match": "from-emerald-400 to-emerald-500",
  "Experience Match": "from-amber-400 to-amber-500",
};

export default function MatchBreakdown({
  items,
  delay = 0,
}: {
  items: MatchBreakdownType[];
  delay?: number;
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className="space-y-3">
      {items.map((item, i) => {
        const gradient = BAR_COLORS[item.label] ?? "from-accent-400 to-navy-400";
        const width = animated ? `${item.score}%` : "0%";
        return (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-navy-200">{item.label}</span>
              <span
                className="text-sm font-display font-bold text-white tabular-nums transition-opacity duration-500"
                style={{ opacity: animated ? 1 : 0 }}
              >
                {item.score}%
              </span>
            </div>
            <div className="h-2 bg-white/8 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out`}
                style={{
                  width,
                  transitionDelay: `${i * 120}ms`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
