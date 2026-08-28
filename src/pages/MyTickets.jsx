import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, Inbox, ListChecks } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import Layout from "@/components/Layout";
import TicketCard from "@/components/TicketCard";
import { cn } from "@/lib/utils";

export default function MyTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active");

  const load = async () => {
    if (!user?.id) return;
    try {
      const all = await base44.entities.Ticket.list("-created_date", 200);
      setTickets(all.filter((t) => t.created_by_id === user.id));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const unsub = base44.entities.Ticket.subscribe(() => load());
    return unsub;
  }, [user?.id]);

  const active = tickets.filter((t) => t.status !== "Resolved");
  const resolved = tickets.filter((t) => t.status === "Resolved");
  const shown = tab === "active" ? active : resolved;

  return (
    <Layout>
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-1">My Tickets</h1>
        <p className="text-sm text-muted-foreground">Issues you've reported.</p>
      </div>

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTab("active")}
          className={cn(
            "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all",
            tab === "active" ? "gsmst-gradient text-white shadow" : "bg-card border border-border text-muted-foreground"
          )}
        >
          Active ({active.length})
        </button>
        <button
          onClick={() => setTab("resolved")}
          className={cn(
            "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all",
            tab === "resolved" ? "gsmst-gradient text-white shadow" : "bg-card border border-border text-muted-foreground"
          )}
        >
          Resolved ({resolved.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : shown.length === 0 ? (
        <div className="text-center py-16">
          <ListChecks className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">
            {tab === "active" ? "No active tickets" : "No resolved tickets yet"}
          </p>
          <Link to="/new" className="text-sm text-primary mt-2 inline-block">Report a new issue</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((t) => (
            <TicketCard key={t.id} ticket={t} />
          ))}
        </div>
      )}
    </Layout>
  );
}