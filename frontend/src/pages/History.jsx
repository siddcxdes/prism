import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SentimentBadge from '../components/ui/SentimentBadge';
import ConfidenceBar from '../components/ui/ConfidenceBar';
import { Search, Trash2, FileText, ArrowRight } from 'lucide-react';

export default function History() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');

  const loadReports = (search = '') => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    api.get(`/research/${params}`)
      .then((res) => setReports(res.data))
      .catch((err) => setError(err.response?.data?.detail || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadReports(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    loadReports(searchQuery);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/research/${id}`);
      setReports(reports.filter((r) => r.id !== id));
    } catch {}
  };

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...reports].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];
    if (sortKey === 'created_at') { aVal = new Date(aVal).getTime(); bVal = new Date(bVal).getTime(); }
    if (sortKey === 'confidence_score') { aVal = aVal || 0; bVal = bVal || 0; }
    if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = (bVal || '').toLowerCase(); }
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const SortHeader = ({ label, field, className = '' }) => (
    <th
      onClick={() => toggleSort(field)}
      className={`text-left text-[11px] font-semibold text-text-muted px-5 py-3 uppercase tracking-[0.1em] cursor-pointer hover:text-text-primary transition-colors select-none ${className}`}
    >
      {label}
      {sortKey === field && <span className="ml-1 text-accent">{sortDir === 'asc' ? '↑' : '↓'}</span>}
    </th>
  );

  return (
    <div className="p-6 lg:p-8 max-w-6xl animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Past Searches</h1>
          <p className="text-[13px] text-text-secondary mt-1">Everything your group has looked up</p>
        </div>
        <Link to="/research" className="flex items-center gap-1.5 px-4 py-2.5 bg-accent hover:bg-accent-hover text-black text-[13px] font-bold rounded-lg transition-all shadow-lg shadow-accent/10">
          New Research
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-md">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Find a past search..." className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(255,255,255,0.12)] transition-all" />
        </div>
      </form>

      {error && (
        <div className="text-[13px] text-danger bg-danger-glow border border-danger/20 px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      {loading ? (
        <div className="border border-border rounded-xl overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-5 py-4 border-b border-border last:border-0 flex items-center gap-4">
              <div className="skeleton h-4 w-6" />
              <div className="skeleton h-4 flex-1 max-w-[300px]" />
              <div className="skeleton h-4 w-16 hidden sm:block" />
              <div className="skeleton h-4 w-20 hidden lg:block" />
            </div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-12 h-12 rounded-xl bg-accent-glow flex items-center justify-center mx-auto mb-4">
            <FileText size={20} className="text-accent" />
          </div>
          <p className="text-[14px] text-text-primary font-medium mb-1">No past searches yet</p>
          <p className="text-[13px] text-text-secondary">
            <Link to="/research" className="text-accent hover:text-accent-hover">Start your first search</Link>
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="text-left text-[11px] font-semibold text-text-muted px-5 py-3 uppercase tracking-[0.1em] w-12">#</th>
                  <SortHeader label="Query" field="query" />
                  <SortHeader label="Type" field="query_type" className="hidden sm:table-cell" />
                  <SortHeader label="Sentiment" field="sentiment" className="hidden md:table-cell" />
                  <th className="text-left text-[11px] font-semibold text-text-muted px-5 py-3 uppercase tracking-[0.1em] hidden lg:table-cell">Confidence</th>
                  <th className="text-left text-[11px] font-semibold text-text-muted px-5 py-3 uppercase tracking-[0.1em] hidden lg:table-cell">Tags</th>
                  <SortHeader label="Date" field="created_at" className="hidden lg:table-cell" />
                  <th className="w-24" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((r, i) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors group">
                    <td className="px-5 py-3.5 text-[12px] text-text-muted font-mono tabular-nums">{String(i + 1).padStart(2, '0')}</td>
                    <td className="px-5 py-3.5 text-[13px] text-text-primary truncate max-w-[300px]">{r.query}</td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="text-[11px] text-text-muted uppercase tracking-wider">{r.query_type || '—'}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell"><SentimentBadge sentiment={r.sentiment} /></td>
                    <td className="px-5 py-3.5 hidden lg:table-cell"><ConfidenceBar score={r.confidence_score} /></td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {(r.tags || []).map((tag, ti) => (
                          <span key={ti} className="text-[10px] text-accent bg-accent-glow px-2 py-0.5 rounded-md">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-text-muted whitespace-nowrap hidden lg:table-cell">
                      {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/research/${r.id}`} className="p-1.5 text-accent hover:bg-accent-glow rounded-md transition-all">
                          <ArrowRight size={14} />
                        </Link>
                        <button onClick={() => handleDelete(r.id)} className="p-1.5 text-text-muted hover:text-danger hover:bg-danger-glow rounded-md transition-all cursor-pointer">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
