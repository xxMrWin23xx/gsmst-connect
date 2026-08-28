import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Plus, ListChecks, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { LOGO_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Feed", icon: Home },
  { to: "/new", label: "Report", icon: Plus },
  { to: "/my-tickets", label: "Mine", icon: ListChecks },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 glass border-b border-border/60">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={LOGO_URL} alt="GSMST" className="h-9 w-auto object-contain" />
            <div className="leading-tight hidden sm:block">
              <div className="text-[15px] font-bold tracking-tight text-gsmst-gradient">GSMST Connect</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Issue Reporting</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground pr-2">
              <User className="h-4 w-4" />
              <span className="max-w-[140px] truncate">{user?.full_name || user?.email || "Staff"}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="h-9 w-9 rounded-full">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 pb-28">
        {children}
      </main>

      {/* Bottom nav (mobile-first) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 glass border-t border-border/60">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-around">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 transition-transform", active && "scale-110")} />
                <span className="text-[11px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}