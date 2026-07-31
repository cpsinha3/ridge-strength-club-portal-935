import { useAuth } from '@/lib/auth-context';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Dumbbell, Calendar, User, LogOut, Shield, Menu, X, Users } from 'lucide-react';
import { useState } from 'react';

export default function AppShell() {
  const { user, isStaff, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-ember/10 text-ember' : 'text-chalk-dim hover:text-chalk hover:bg-carbon-lighter'
    }`;

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-carbon/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-ember" />
            <span className="font-bold text-lg tracking-tight text-chalk">RIDGE</span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass} end>
              <Calendar className="w-4 h-4" /> Schedule
            </NavLink>
            <NavLink to="/my-activity" className={navLinkClass}>
              <User className="w-4 h-4" /> My Activity
            </NavLink>
            {isStaff && (
              <NavLink to="/staff" className={navLinkClass}>
                <Shield className="w-4 h-4" /> Staff
              </NavLink>
            )}
            <NavLink to="/customers" className={navLinkClass}>
              <Users className="w-4 h-4" /> Customers
            </NavLink>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{user?.firstName}</span>
            <button onClick={handleSignOut} className="text-muted-foreground hover:text-chalk transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden text-chalk" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border px-4 py-3 space-y-1 bg-carbon">
            <NavLink to="/" className={navLinkClass} end onClick={() => setMenuOpen(false)}>
              <Calendar className="w-4 h-4" /> Schedule
            </NavLink>
            <NavLink to="/my-activity" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              <User className="w-4 h-4" /> My Activity
            </NavLink>
            {isStaff && (
              <NavLink to="/staff" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                <Shield className="w-4 h-4" /> Staff
              </NavLink>
            )}
            <NavLink to="/customers" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              <Users className="w-4 h-4" /> Customers
            </NavLink>
            <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-chalk w-full">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
