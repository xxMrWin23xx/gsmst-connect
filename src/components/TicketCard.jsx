import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, MessageSquare, ImageIcon } from "lucide-react";
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
  const hasPhotos = ticket.photos?.length > 0;

  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className="block glass-card rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Prominent photo preview banner */}
      {hasPhotos && (
        <div className="relative h-40 w-full bg-muted">
          <Image src={ticket.photos[0]} alt={ticket.title} className="h-full w-full" fittingType="fill" />
          {ticket.photos.length > 1 && (
            <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/65 text-white text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
              <ImageIcon className="h-3.5 w-3.5" />
              {ticket.photos.length}
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={ticket.category} />
            <StatusBadge status={ticket.status} />
          </div>
          <PriorityBadge priority={ticket.priority} />
        </div>

        <h3 className="font-bold text-base leading-snug mb-1 line-clamp-2">{ticket.title}</h3>
        <p className="text-[15px] text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{ticket.description}</p>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium">{ticket.building}{ticket.location_detail ? ` · ${ticket.location_detail}` : ""}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {timeAgo(ticket.created_date)}
          </span>
        </div>

        {showReporter && reporterName && (
          <div className="mt-2.5 pt-2.5 border-t border-border/60 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            Reported by {reporterName}
          </div>
        )}
      </div>
    </Link>
  );
}