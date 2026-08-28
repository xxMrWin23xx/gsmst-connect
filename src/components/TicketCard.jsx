import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, MessageSquare } from "lucide-react";
import { CategoryBadge, StatusBadge, PriorityBadge } from "@/components/Badges";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export default function TicketCard({ ticket, showReporter = false, reporterName }) {
  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className="block glass-card rounded-2xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={ticket.category} />
          <StatusBadge status={ticket.status} />
        </div>
        <PriorityBadge priority={ticket.priority} />
      </div>

      <h3 className="font-semibold text-[15px] leading-snug mb-1 line-clamp-2">{ticket.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{ticket.description}</p>

      {ticket.photos?.length > 0 && (
        <div className="flex gap-1.5 mb-3 overflow-hidden">
          {ticket.photos.slice(0, 3).map((url, i) => (
            <div key={i} className="h-16 w-16 rounded-lg overflow-hidden border border-border bg-muted flex-shrink-0">
              <Image src={url} alt="" className="h-full w-full object-cover" fittingType="fill" />
            </div>
          ))}
          {ticket.photos.length > 3 && (
            <div className="h-16 w-16 rounded-lg bg-muted border border-border flex items-center justify-center text-xs font-medium text-muted-foreground flex-shrink-0">
              +{ticket.photos.length - 3}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {ticket.building}{ticket.location_detail ? ` · ${ticket.location_detail}` : ""}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {timeAgo(ticket.created_date)}
        </span>
      </div>

      {showReporter && reporterName && (
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5" />
          Reported by {reporterName}
        </div>
      )}
    </Link>
  );
}