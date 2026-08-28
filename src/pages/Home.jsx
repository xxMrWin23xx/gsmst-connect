import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Inbox, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Layout from "@/components/Layout";
import TicketCard from "@/components/TicketCard";
import FilterPanel from "@/components/FilterPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const defaultFilters = {
  _open: false,
  category: "All",
  status: "All",
  priority: "All",
  building: "All",
  location: "",
};

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(defaultFilters);

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
    const unsub = base44.entities.Ticket.subscribe(() => loadTickets());
    return unsub;
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== "All") count++;
    if (filters.status !== "All") count++;
    if (filters.priority !== "All") count++;
    if (filters.building !== "All") count++;
    if (filters.location.trim()) count++;
    return count;
  }, [filters]);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (filters.category !== "All" && t.category !== filters.category) return false;
      if (filters.status !== "All" && t.status !== filters.status) return false;
      if (filters.priority !== "All" && t.priority !== filters.priority) return false;
      if (filters.building !== "All" && t.building !== filters.building) return false;
      if (filters.location.trim()) {
        if (!t.location_detail?.toLowerCase().includes(filters.location.trim().toLowerCase())) return false;
      }
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
  }, [tickets, search, filters]);

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    resolved: tickets.filter((t) => t.status === "Resolved").length,
  }), [tickets]);

  const resetFilters = () => setFilters({ ...defaultFilters, _open: filters._open });

  return (
    <Layout>
      {/* Hero header */}
      <div className="mb-6">
        <div className="gsmst-gradient rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-4 -bottom-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1.5">Live Issue Feed</p>
            <h1 className="text-3xl font-bold leading-tight">School Maintenance<br/>Made Simple</h1>
            <p className="text-white/85 text-[15px] mt-2.5 mb-4">Report and track construction, maintenance, and technology issues across campus.</p>
            <Link to="/new">
              <Button className="bg-white text-primary hover:bg-white/90 font-bold rounded-full shadow-lg h-11 px-5">
                <Plus className="h-5 w-5 mr-1.5" /> Report an Issue
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2.5 mb-5">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "Open", value: stats.open, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Active", value: stats.inProgress, color: "text-amber-600 dark:text-amber-400" },
          { label: "Done", value: stats.resolved, color: "text-slate-500 dark:text-slate-400" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-2xl p-3.5 text-center">
            <div className={cn("text-2xl font-bold", s.color)}>{s.value}</div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search issues, locations..."
          className="pl-11 h-12 rounded-2xl bg-muted/50 border-border text-base"
        />
      </div>

      {/* Filter panel */}
      <div className="mb-5">
        <FilterPanel
          open={filters._open}
          filters={filters}
          setFilters={setFilters}
          onReset={resetFilters}
          activeCount={activeFilterCount}
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Inbox className="h-14 w-14 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground font-bold text-lg">No issues found</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Try adjusting filters or report a new issue.</p>
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