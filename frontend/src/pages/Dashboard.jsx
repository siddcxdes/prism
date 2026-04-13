import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SentimentBadge from '../components/ui/SentimentBadge';
import { ArrowRight, Search, FileText, TrendingUp, Clock, Plus } from 'lucide-react';

export default function Dashboard() {
  const { user, org } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/research/')
      .then((res) => setReports(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate('/research', { state: { query: query.trim() } });
    }
  };

  const recent = reports.slice(0, 5);
  const positive = reports.filter((r) => r.sentiment === 'positive').length;
  const negative = reports.filter((r) => r.sentiment === 'negative').length;
  const avgConfidence = reports.length
    ? Math.round(reports.reduce((a, r) => a + (r.confidence_score || 0), 0) / reports.length)
    : 0;

  const stats = [
    {
      label: 'Total Reports',
      value: reports.length,
      icon: FileText,
      color: '#6366F1',
    },
    {
      label: 'Positive Sentiment',
      value: `${positive}`,
      icon: TrendingUp,
      color: '#22C55E',
    },
    {
      label: 'Avg Confidence',
      value: `${avgConfidence}%`,
      icon: Search,
      color: '#F59E0B',
    },
    {
      label: 'This Month',
      value: reports.filter((r) => {
        const d = new Date(r.created_at);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length,
      icon: Clock,
      color: '#8B5CF6',
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-6xl animate-fade-in">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-text-primary">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-[13px] text-text-secondary mt-1">
          {org?.name || 'Your study group'} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Quick search */}
      <form onSubmit={handleQuickSearch} className="mb-8">
        <div className="relative max-w-2xl">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a company or topic for your project..."
            className="w-full pl-11 pr-28 py-3.5 bg-surface border border-border rounded-xl text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] transition-all"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-black text-[12px] font-bold rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            Research <ArrowRight size={13} />
          </button>
        </div>
      </form>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card">
              <div className="skeleton h-3 w-20 mb-3" />
              <div className="skeleton h-7 w-14" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card group">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: `${stat.color}15` }}
                >
                  <stat.icon size={14} style={{ color: stat.color }} />
                </div>
                <span className="text-[11px] font-medium text-text-muted uppercase tracking-[0.1em]">
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-semibold text-text-primary tabular-nums">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 mb-8">
        <Link
          to="/research"
          className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-black text-[13px] font-bold rounded-lg transition-all shadow-lg shadow-accent/10 hover:shadow-accent/20"
        >
          <Plus size={14} />
          New Research
        </Link>
        <Link
          to="/watchlist"
          className="btn-ghost"
        >
          Saved Companies
        </Link>
        <Link
          to="/history"
          className="btn-ghost"
        >
          View Past Searches
        </Link>
      </div>

      {/* Recent reports */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-header mb-0">Recent Searches</h2>
          {reports.length > 5 && (
            <Link to="/history" className="text-[12px] text-accent hover:text-accent-hover transition-colors">
              View all →
            </Link>
          )}
        </div>

        {loading ? (
          <div className="border border-border rounded-xl overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-5 py-4 border-b border-border last:border-0 flex items-center gap-4">
                <div className="skeleton h-4 flex-1 max-w-[280px]" />
                <div className="skeleton h-4 w-16" />
                <div className="skeleton h-4 w-20" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-12 h-12 rounded-xl bg-accent-glow flex items-center justify-center mx-auto mb-4">
              <Search size={20} className="text-accent" />
            </div>
            <p className="text-[14px] text-text-primary font-medium mb-1">No searches yet</p>
            <p className="text-[13px] text-text-secondary">
              Try searching something above to get started
            </p>
          </div>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden">
            {recent.map((r, i) => (
              <Link
                key={r.id}
                to={`/research/${r.id}`}
                className={`flex items-center justify-between px-5 py-4 transition-colors hover:bg-surface-hover ${
                  i < recent.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-[11px] text-text-muted font-mono tabular-nums shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[13px] text-text-primary truncate">
                    {r.query}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {(r.tags || []).length > 0 && (
                    <span className="text-[10px] text-accent bg-accent-glow px-2 py-0.5 rounded-md hidden lg:inline">
                      {r.tags[0]}
                    </span>
                  )}
                  <SentimentBadge sentiment={r.sentiment} />
                  <span className="text-[11px] text-text-muted hidden sm:inline">
                    {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <ArrowRight size={13} className="text-text-muted" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
