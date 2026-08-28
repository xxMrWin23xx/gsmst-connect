import React from "react";
import { cn } from "@/lib/utils";
import { CATEGORIES, STATUSES, PRIORITIES } from "@/lib/constants";
import { HardHat, Wrench, Laptop, Circle } from "lucide-react";

const categoryIcons = { HardHat, Wrench, Laptop };

const colorMap = {
  amber: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  blue: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30",
  violet: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/30",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
  slate: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/15 dark:text-slate-300 dark:border-slate-500/30",
  red: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30",
};

export function CategoryBadge({ category }) {
  const cat = CATEGORIES.find((c) => c.value === category) || CATEGORIES[1];
  const Icon = categoryIcons[cat.icon] || Wrench;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border", colorMap[cat.color])}>
      <Icon className="h-3.5 w-3.5" />
      {cat.label}
    </span>
  );
}

export function StatusBadge({ status }) {
  const st = STATUSES.find((s) => s.value === status) || STATUSES[0];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border", colorMap[st.color])}>
      <Circle className="h-2.5 w-2.5 fill-current" />
      {st.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const pr = PRIORITIES.find((p) => p.value === priority) || PRIORITIES[1];
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border", colorMap[pr.color])}>
      {pr.label}
    </span>
  );
}