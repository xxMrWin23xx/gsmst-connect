import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Trash2, CheckCircle2, Loader2, User, AlertTriangle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Layout from "@/components/Layout";
import { CategoryBadge, StatusBadge, PriorityBadge } from "@/components/Badges";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [reporter, setReporter] = useState(null);

  const load = async () => {
    try {
      const t = await base44.entities.Ticket.get(id);
      setTicket(t);
      if (t.created_by_id) {
        try {
          const users = await base44.entities.User.list();
          const r = users.find((u) => u.id === t.created_by_id);
          setReporter(r);
        } catch {}
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const unsub = base44.entities.Ticket.subscribe((event) => {
      if (event.id === id) load();
    });
    return unsub;
  }, [id]);

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      const updates = { status };
      if (status === "Resolved") {
        updates.resolved_date = new Date().toISOString();
      }
      await base44.entities.Ticket.update(ticket.id, updates);
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const deleteTicket = async () => {
    await base44.entities.Ticket.delete(ticket.id);
    navigate("/");
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!ticket) {
    return (
      <Layout>
        <div className="text-center py-20">
          <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">Ticket not found</p>
          <Link to="/" className="text-sm text-primary mt-2 inline-block">Back to feed</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="glass-card rounded-2xl p-5 mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <CategoryBadge category={ticket.category} />
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
        <h1 className="text-xl font-bold leading-snug mb-2">{ticket.title}</h1>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
      </div>

      {/* Photos */}
      {ticket.photos?.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2.5 px-1">Photos ({ticket.photos.length})</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {ticket.photos.map((url, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-border bg-muted aspect-video">
                <Image src={url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" fittingType="fill" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="glass-card rounded-2xl p-4 mb-4 space-y-3 text-sm">
        <div className="flex items-start gap-2.5">
          <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium">{ticket.building}</div>
            {ticket.location_detail && <div className="text-muted-foreground">{ticket.location_detail}</div>}
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Clock className="h-4 w-4 text-primary flex-shrink-0" />
          <span>Reported {new Date(ticket.created_date).toLocaleString()}</span>
        </div>
        {reporter && (
          <div className="flex items-center gap-2.5">
            <User className="h-4 w-4 text-primary flex-shrink-0" />
            <span>Reported by {reporter.full_name || reporter.email}</span>
          </div>
        )}
        {ticket.resolved_date && (
          <div className="flex items-center gap-2.5 text-emerald-600">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>Resolved {new Date(ticket.resolved_date).toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2.5">
        <div className="text-sm font-semibold px-1">Update Status</div>
        <div className="grid grid-cols-3 gap-2.5">
          {["Open", "In Progress", "Resolved"].map((s) => (
            <Button
              key={s}
              variant={ticket.status === s ? "default" : "outline"}
              disabled={updating || ticket.status === s}
              onClick={() => updateStatus(s)}
              className={cn(
                "rounded-xl h-11 text-xs font-semibold",
                ticket.status === s && "gsmst-gradient text-white"
              )}
            >
              {s === "Resolved" && <CheckCircle2 className="h-4 w-4 mr-1" />}
              {s}
            </Button>
          ))}
        </div>

        <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full rounded-xl h-11 text-destructive border-destructive/30 hover:bg-destructive/5 mt-3">
                <Trash2 className="h-4 w-4 mr-2" /> Remove Ticket
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove this ticket?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The ticket and its photos will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteTicket} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      </div>
    </Layout>
  );
}