import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  Clock,
  Eye,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/research', label: 'New Research', icon: Search },
  { to: '/history', label: 'History', icon: Clock },
  { to: '/watchlist', label: 'Watchlist', icon: Eye },
];

export default function Sidebar() {
  const { user, org, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-lg transition-all duration-150 group ${
      isActive
        ? 'bg-accent/10 text-accent'
        : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
    }`;

  const sidebarContent = (
    <>
      <div className="px-5 py-5">
        <h1 className="text-xl font-bold text-white tracking-tighter">
          prism.
        </h1>
      </div>

      <nav className="flex-1 px-3 py-1">
        <ul className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={() => setMobileOpen(false)}
                className={linkClass}
              >
                <Icon size={16} strokeWidth={1.5} />
                {label}
              </NavLink>
            </li>
          ))}
          {user?.role === 'admin' && (
            <li>
              <NavLink
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className={linkClass}
              >
                <Settings size={16} strokeWidth={1.5} />
                Admin
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <div className="px-3 pb-4">
        <div className="p-3 bg-surface-alt rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              {user?.name && (
                <p className="text-[13px] font-medium text-text-primary truncate">
                  {user.name}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.08em] px-2 py-0.5 rounded-md ${
                    user?.role === 'admin'
                      ? 'bg-accent/15 text-accent'
                      : 'bg-white/5 text-text-muted'
                  }`}
                >
                  {user?.role}
                </span>
              </div>
              {org && (
                <p className="text-[11px] text-text-muted truncate mt-1">
                  {org.name}
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-text-muted hover:text-danger hover:bg-danger-glow transition-all cursor-pointer rounded-lg"
              title="Sign out"
            >
              <LogOut size={15} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-surface border border-border rounded-lg text-text-secondary hover:text-text-primary transition-colors"
      >
        <Menu size={18} />
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-bg border-r border-border flex flex-col transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-text-muted hover:text-text-primary rounded-lg"
        >
          <X size={16} />
        </button>
        {sidebarContent}
      </aside>

      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-bg border-r border-border flex-col z-30">
        {sidebarContent}
      </aside>
    </>
  );
}
