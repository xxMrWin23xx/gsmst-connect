import React from "react";
import { RotateCcw, ChevronDown } from "lucide-react";
import { CATEGORIES, STATUSES, PRIORITIES, BUILDINGS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-11 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="All">{placeholder || `All ${label}`}</option>
        {options.map((opt) => (
          typeof opt === "string" ? (
            <option key={opt} value={opt}>{opt}</option>
          ) : (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          )
        ))}
      </select>
    </div>
  );
}

export default function FilterPanel({ open, filters, setFilters, onReset, activeCount }) {
  const update = (key, value) => setFilters({ ...filters, [key]: value });

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <button
        onClick={() => setFilters({ ...filters, _open: !open })}
        className="w-full flex items-center justify-between px-4 py-3.5"
      >
        <span className="flex items-center gap-2">
          <span className="text-sm font-bold">Filters</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 space-y-3.5 border-t border-border/60">
          <div className="grid grid-cols-2 gap-3 pt-3">
            <SelectField
              label="Issue Type"
              value={filters.category}
              onChange={(v) => update("category", v)}
              options={CATEGORIES}
              placeholder="All Types"
            />
            <SelectField
              label="Status"
              value={filters.status}
              onChange={(v) => update("status", v)}
              options={STATUSES}
              placeholder="All Status"
            />
            <SelectField
              label="Priority"
              value={filters.priority}
              onChange={(v) => update("priority", v)}
              options={PRIORITIES}
              placeholder="All Priorities"
            />
            <SelectField
              label="Building / Area"
              value={filters.building}
              onChange={(v) => update("building", v)}
              options={BUILDINGS}
              placeholder="All Buildings"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">Room Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Search by room or area..."
              className="flex h-11 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="w-full flex items-center justify-center gap-1.5 h-10 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
            >
              <RotateCcw className="h-4 w-4" />
              Reset all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}