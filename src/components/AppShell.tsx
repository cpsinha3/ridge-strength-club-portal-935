import { useAuth } from '@/lib/auth-context';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Dumbbell, Calendar, User, LogOut, Shield, Menu, X, Users, UserPlus, Edit, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import db from '@/lib/shared/kliv-database.js';

function CustomerStats() {
  const [stats, setStats] = useState({ customers: 0, points: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const customers = await db.query('customers', { select: 'sales_point' });
        const points = new Set(customers.map((c: any) => c.sales_point).filter(Boolean)).size;
        setStats({ customers: customers.length, points });
      } catch (err) {
        console.log('Failed to load stats:', err);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-2">
      <div className="text-xs">
        <span className="text-muted-foreground">Total Customers:</span>
        <span className="ml-2 text-chalk font-medium">{stats.customers}</span>
      </div>
      <div className="text-xs">
        <span className="text-muted-foreground">Active Sales Points:</span>
        <span className="ml-2 text-chalk font-medium">{stats.points}</span>
      </div>
    </div>
  );
}

export default function AppShell() {
  const { user, isStaff, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-ember/10 text-ember' : 'text-chalk-dim hover:text-chalk hover:bg-carbon-lighter'
    }`;

  const sidebarLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-ember/10 text-ember' : 'text-chalk-dim hover:text-chalk hover:bg-carbon-lighter'
    }`;

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-carbon/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <img src="/idfc-first-bank-logo.svg" alt="IDFC First Bank Logo" className="h-8" />
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

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        {(location.pathname === '/customers' || location.pathname.startsWith('/customer')) && (
          <aside className="w-64 border-r border-border bg-carbon/50 p-4 space-y-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-chalk">Customer Actions</h3>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-muted-foreground hover:text-chalk md:hidden"
              >
                {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>

            <nav className="space-y-1">
              <NavLink to="/customers" className={sidebarLinkClass} end>
                <LayoutDashboard className="w-4 h-4" /> View All
              </NavLink>
              <NavLink to="/customer/add" className={sidebarLinkClass}>
                <UserPlus className="w-4 h-4" /> Add Customer
              </NavLink>
            </nav>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Quick Stats</p>
              <CustomerStats />
            </div>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
