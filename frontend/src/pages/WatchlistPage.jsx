import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Plus, Trash2, ArrowRight, Eye } from 'lucide-react';

export default function WatchlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ company_name: '', ticker: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadWatchlist = () => {
    api.get('/watchlist/')
      .then((res) => setItems(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadWatchlist(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/watchlist/', form);
      setForm({ company_name: '', ticker: '' });
      setShowAdd(false);
      loadWatchlist();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add');
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/watchlist/${id}`);
      setItems(items.filter((i) => i.id !== id));
    } catch {}
  };

  const handleResearch = (item) => {
    navigate('/research', { state: { query: `${item.company_name} (${item.ticker}) stock analysis` } });
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Tracked Companies</h1>
          <p className="text-[13px] text-text-secondary mt-1">
            Keep an eye on these stocks for your project
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-accent hover:bg-accent-hover text-black text-[13px] font-bold rounded-lg transition-all shadow-lg shadow-accent/10 cursor-pointer"
        >
          <Plus size={14} />
          Add Company
        </button>
      </div>

      {showAdd && (
        <div className="card mb-6 animate-fade-in">
          {error && (
            <div className="text-[13px] text-danger bg-danger-glow border border-danger/20 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleAdd} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-[11px] font-medium text-text-muted uppercase tracking-[0.12em] mb-2">Company Name</label>
              <input
                type="text"
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                required
                placeholder="Apple Inc."
                className="input"
              />
            </div>
            <div className="w-32">
              <label className="block text-[11px] font-medium text-text-muted uppercase tracking-[0.12em] mb-2">Ticker</label>
              <input
                type="text"
                value={form.ticker}
                onChange={(e) => setForm({ ...form, ticker: e.target.value.toUpperCase() })}
                required
                placeholder="AAPL"
                className="input font-mono text-center"
              />
            </div>
            <button type="submit" className="btn-primary shrink-0 text-black">
              Add
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card flex items-center gap-4">
              <div className="skeleton h-5 w-32" />
              <div className="skeleton h-4 w-16" />
              <div className="skeleton h-4 w-20 ml-auto" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-12 h-12 rounded-xl bg-accent-glow flex items-center justify-center mx-auto mb-4">
            <Eye size={20} className="text-accent" />
          </div>
          <p className="text-[14px] text-text-primary font-medium mb-1">No companies tracked</p>
          <p className="text-[13px] text-text-secondary">
            Keep track of companies you research often
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="card card-hover flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-accent-glow flex items-center justify-center">
                  <span className="text-[12px] font-bold text-accent">{item.ticker.slice(0, 2)}</span>
                </div>
                <div>
                  <p className="text-[14px] font-medium text-text-primary">
                    {item.company_name}
                  </p>
                  <span className="text-[11px] text-text-muted font-mono">
                    {item.ticker}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleResearch(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-accent hover:bg-accent-glow rounded-lg transition-all cursor-pointer"
                >
                  Research
                  <ArrowRight size={12} />
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-2 text-text-muted hover:text-danger hover:bg-danger-glow transition-all cursor-pointer rounded-lg"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
