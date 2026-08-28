import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Loader2, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Layout from "@/components/Layout";
import PhotoUpload from "@/components/PhotoUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CATEGORIES, PRIORITIES, BUILDINGS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { HardHat, Wrench, Laptop } from "lucide-react";

const categoryIcons = { HardHat, Wrench, Laptop };

export default function NewTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Maintenance",
    priority: "Medium",
    building: "Main Building",
    location_detail: "",
    photos: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.title.trim().length < 3 || form.description.trim().length < 5) {
      setError("Please provide a title and description.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await base44.entities.Ticket.create({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        priority: form.priority,
        building: form.building,
        location_detail: form.location_detail.trim(),
        photos: form.photos,
        status: "Open",
      });
      navigate("/");
    } catch (err) {
      setError("Could not submit ticket. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="text-2xl font-bold mb-1">Report an Issue</h1>
      <p className="text-sm text-muted-foreground mb-6">Help keep GSMST running smoothly. Fill in the details below.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div className="glass-card rounded-2xl p-4">
          <Label className="text-sm font-semibold mb-3 block">Issue Type</Label>
          <div className="grid grid-cols-3 gap-2.5">
            {CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat.icon];
              const active = form.category === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat.value })}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                    active ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
                  )}
                >
                  <Icon className={cn("h-7 w-7", active ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-xs font-semibold", active ? "text-primary" : "text-foreground")}>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Details */}
        <div className="glass-card rounded-2xl p-4 space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-semibold mb-1.5 block">Title *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Leaking ceiling in Room 204"
              maxLength={120}
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-semibold mb-1.5 block">Description *</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the issue in detail..."
              rows={4}
            />
          </div>
          <div>
            <Label className="text-sm font-semibold mb-2 block">Priority</Label>
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setForm({ ...form, priority: p.value })}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-semibold border transition-all",
                    form.priority === p.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="glass-card rounded-2xl p-4 space-y-4">
          <div>
            <Label htmlFor="building" className="text-sm font-semibold mb-1.5 block">Building / Area *</Label>
            <select
              id="building"
              value={form.building}
              onChange={(e) => setForm({ ...form, building: e.target.value })}
              className="flex h-11 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {BUILDINGS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="location_detail" className="text-sm font-semibold mb-1.5 block">Room / Specific Location</Label>
            <Input
              id="location_detail"
              value={form.location_detail}
              onChange={(e) => setForm({ ...form, location_detail: e.target.value })}
              placeholder="e.g. Room 204, 2nd floor near stairs"
            />
          </div>
        </div>

        {/* Photos */}
        <div className="glass-card rounded-2xl p-4">
          <Label className="text-sm font-semibold mb-3 block">Photos (optional)</Label>
          <PhotoUpload photos={form.photos} onChange={(photos) => setForm({ ...form, photos })} />
        </div>

        {error && (
          <p className="text-sm text-destructive font-medium text-center">{error}</p>
        )}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full h-12 gsmst-gradient text-white font-semibold rounded-2xl shadow-lg hover:opacity-90"
        >
          {submitting ? (
            <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting...</>
          ) : (
            <><Send className="h-4 w-4 mr-2" /> Submit Ticket</>
          )}
        </Button>
      </form>
    </Layout>
  );
}