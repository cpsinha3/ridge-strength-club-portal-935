import { useAuth } from '@/lib/auth-context';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, User, LogOut, Shield, Menu, X, Users, UserPlus, LayoutDashboard, Bell, Search, Settings, ChevronDown, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import db from '@/lib/shared/kliv-database.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 border-b border-ember/20 shadow-lg">
        {/* Main Top Bar */}
        <div className="max-w-7xl mx-auto">
          {/* First row - Logo and main navigation */}
          <div className="flex items-center justify-between h-16 px-4">
            {/* Left: Logo and company */}
            <div className="flex items-center gap-6">
              <NavLink to="/" className="flex items-center gap-3">
                <img src="/idfc-first-bank-logo.svg" alt="IDFC First Bank" className="h-10" />
                <div className="hidden lg:block">
                  <div className="text-sm font-semibold text-white">IDFC First Bank</div>
                  <div className="text-xs text-ember">Customer Management System</div>
                </div>
              </NavLink>
              
              {/* Desktop Navigation */}
              <nav className="hidden xl:flex items-center gap-1">
                <NavLink to="/" className={navLinkClass} end>
                  <Calendar className="w-4 h-4" /> Schedule
                </NavLink>
                <NavLink to="/customers" className={navLinkClass}>
                  <Users className="w-4 h-4" /> Customers
                </NavLink>
                {isStaff && (
                  <NavLink to="/staff" className={navLinkClass}>
                    <Shield className="w-4 h-4" /> Staff
                  </NavLink>
                )}
                <NavLink to="/my-activity" className={navLinkClass}>
                  <User className="w-4 h-4" /> My Activity
                </NavLink>
              </nav>
            </div>

            {/* Right: Actions and user menu */}
            <div className="flex items-center gap-3">
              {/* Search button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-muted-foreground hover:text-ember hover:bg-ember/10"
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="text-muted-foreground hover:text-ember hover:bg-ember/10"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-ember rounded-full"></span>
                </Button>
                
                {/* Notifications dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-xl z-50">
                    <div className="p-3 border-b border-border">
                      <h3 className="font-semibold text-chalk">Notifications</h3>
                    </div>
                    <div className="p-3 text-sm text-muted-foreground">
                      <p>No new notifications</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Settings */}
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-ember hover:bg-ember/10 hidden md:flex"
              >
                <Settings className="w-5 h-5" />
              </Button>

              {/* User menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3"
                >
                  <div className="w-8 h-8 rounded-full bg-ember/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-ember" />
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-chalk">{user?.firstName}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>

                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl z-50">
                    <div className="p-3 border-b border-border">
                      <div className="text-sm font-medium text-chalk">{user?.firstName} {user?.lastName}</div>
                      <div className="text-xs text-muted-foreground">{user?.email}</div>
                    </div>
                    <div className="p-1">
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-chalk hover:bg-carbon-lighter rounded-md transition-colors">
                        <Settings className="w-4 h-4" /> Settings
                      </button>
                      <button 
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMenuOpen(!menuOpen)}
                className="xl:hidden text-muted-foreground hover:text-chalk"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Search Bar (expandable) */}
          {searchOpen && (
            <div className="px-4 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers, loans, or sales points..."
                  className="pl-10 bg-carbon-lighter border-border text-chalk placeholder:text-muted-foreground"
                />
              </div>
            </div>
          )}

          {/* Mobile Navigation Menu */}
          {menuOpen && (
            <div className="xl:hidden border-t border-border bg-carbon/50 backdrop-blur-xl">
              <nav className="px-4 py-3 space-y-1">
                <NavLink to="/" className={navLinkClass} end onClick={() => setMenuOpen(false)}>
                  <Calendar className="w-4 h-4" /> Schedule
                </NavLink>
                <NavLink to="/customers" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  <Users className="w-4 h-4" /> Customers
                </NavLink>
                {isStaff && (
                  <NavLink to="/staff" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                    <Shield className="w-4 h-4" /> Staff
                  </NavLink>
                )}
                <NavLink to="/my-activity" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  <User className="w-4 h-4" /> My Activity
                </NavLink>
                <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-chalk w-full">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </nav>
            </div>
          )}
        </div>

        {/* Quick Stats Bar */}
        <div className="bg-gradient-to-r from-ember/10 to-transparent border-t border-ember/20">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-ember" />
                  <span className="text-xs text-muted-foreground">Sales Points:</span>
                  <span className="text-xs font-medium text-chalk">2</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-ember" />
                  <span className="text-xs text-muted-foreground">Total Customers:</span>
                  <span className="text-xs font-medium text-chalk">2</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Last updated: Just now
              </div>
            </div>
          </div>
        </div>
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
                <LayoutDashboard className="w-4 h-4" /> Card View
              </NavLink>
              <NavLink to="/customers/list" className={sidebarLinkClass}>
                <Users className="w-4 h-4" /> Raw Table
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
