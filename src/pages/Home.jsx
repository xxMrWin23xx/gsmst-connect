import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, SlidersHorizontal, Inbox, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Layout from "@/components/Layout";
import TicketCard from "@/components/TicketCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES, STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadTickets = async () => {
    try {
      const data = await base44.entities.Ticket.list("-created_date", 100);
      setTickets(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    const unsub = base44.entities.Ticket.subscribe((event) => {
      loadTickets();
    });
    return unsub;
  }, []);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (categoryFilter !== "All" && t.category !== categoryFilter) return false;
      if (statusFilter !== "All" && t.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.building?.toLowerCase().includes(q) ||
          t.location_detail?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tickets, search, categoryFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    resolved: tickets.filter((t) => t.status === "Resolved").length,
  }), [tickets]);

  return (
    <Layout>
      {/* Hero header */}
      <div className="mb-6">
        <div className="gsmst-gradient rounded-3xl p-5 text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-4 -bottom-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">Live Issue Feed</p>
            <h1 className="text-2xl font-bold leading-tight">School Maintenance<br/>Made Simple</h1>
            <p className="text-white/85 text-sm mt-2 mb-4">Report and track construction, maintenance, and technology issues across campus.</p>
            <Link to="/new">
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold rounded-full shadow-lg">
                <Plus className="h-4 w-4 mr-1" /> Report an Issue
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2.5 mb-5">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "Open", value: stats.open, color: "text-emerald-600" },
          { label: "Active", value: stats.inProgress, color: "text-amber-600" },
          { label: "Done", value: stats.resolved, color: "text-slate-500" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-2xl p-3 text-center">
            <div className={cn("text-xl font-bold", s.color)}>{s.value}</div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search issues, locations..."
          className="pl-9 rounded-full bg-muted/50 border-border"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-2">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          <FilterChip label="All" active={categoryFilter === "All"} onClick={() => setCategoryFilter("All")} />
          {CATEGORIES.map((c) => (
            <FilterChip key={c.value} label={c.label} active={categoryFilter === c.value} onClick={() => setCategoryFilter(c.value)} />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-4 flex-shrink-0" />
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          <FilterChip label="All Status" active={statusFilter === "All"} onClick={() => setStatusFilter("All")} />
          {STATUSES.map((s) => (
            <FilterChip key={s.value} label={s.label} active={statusFilter === s.value} onClick={() => setStatusFilter(s.value)} />
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Inbox className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No issues found</p>
          <p className="text-sm text-muted-foreground/70">Try adjusting filters or report a new issue.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <TicketCard key={t.id} ticket={t} />
          ))}
        </div>
      )}
    </Layout>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-muted-foreground border-border hover:border-primary/40"
      )}
    >
      {label}
    </button>
  );
}