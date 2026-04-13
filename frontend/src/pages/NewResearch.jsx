import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { ArrowRight, Sparkles } from 'lucide-react';

const researchSteps = [
  'Figuring out what you mean...',
  'Looking up stuff...',
  'Pulling stock data...',
  'Googling recent news...',
  'Checking SEC filings...',
  'Writing it all down...',
];

export default function NewResearch() {
  const location = useLocation();
  const [query, setQuery] = useState(location.state?.query || '');
  const [loading, setLoading] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setError('');
    setLoading(true);
    setVisibleSteps([0]);

    let stepIndex = 1;
    const interval = setInterval(() => {
      if (stepIndex < researchSteps.length) {
        setVisibleSteps((prev) => [...prev, stepIndex]);
        stepIndex++;
      }
    }, 4000);

    try {
      const res = await api.post('/research/', { query: query.trim() });
      clearInterval(interval);
      navigate(`/research/${res.data.id}`);
    } catch (err) {
      clearInterval(interval);
      setError(err.response?.data?.detail || 'Research failed. Please try again.');
      setLoading(false);
      setVisibleSteps([]);
    }
  };

  const suggestions = [
    'What is going on with NVIDIA vs AMD?',
    'Is Tesla stock a good buy right now?',
    'JPMorgan vs Goldman Sachs for a finance project',
    'What is happening with AI SaaS companies?',
    'Electric vehicles in India trends',
  ];

  return (
    <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-2rem)]">
      <div className="w-full max-w-xl animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-xl bg-accent-glow border border-accent/20 flex items-center justify-center mx-auto mb-5">
            <Sparkles size={20} className="text-accent" />
          </div>
          <h1 className="text-2xl font-semibold text-text-primary mb-2">
            Start a Search
          </h1>
          <p className="text-[14px] text-text-secondary">
            What do you need info on? Just type it out.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              rows={3}
              className="w-full px-5 py-4 bg-surface border border-border rounded-xl text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(255,255,255,0.12)] transition-all disabled:opacity-50 resize-none"
              placeholder="e.g., Tell me about Apple's latest earnings and compare it to Microsoft..."
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-3 bottom-3 flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-black text-[12px] font-bold rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-accent/20"
            >
              Research <ArrowRight size={13} />
            </button>
          </div>
        </form>

        {error && (
          <div className="text-[13px] text-danger bg-danger-glow border border-danger/20 px-4 py-3 rounded-lg mt-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-10 card">
            <div className="space-y-0">
              {researchSteps.map((step, i) => {
                const isVisible = visibleSteps.includes(i);
                const isCurrent = visibleSteps.length > 0 && visibleSteps[visibleSteps.length - 1] === i;

                if (!isVisible) return null;

                return (
                  <div
                    key={step}
                    className="animate-slide-in flex items-center border-l-2 px-4 py-3 transition-all duration-300"
                    style={{
                      borderLeftColor: isCurrent ? '#6366F1' : '#27272A',
                      animationDelay: `${i * 0.1}s`,
                    }}
                  >
                    <span
                      className={`text-[13px] transition-colors duration-300 ${
                        isCurrent ? 'text-text-primary font-medium' : 'text-text-muted'
                      }`}
                    >
                      {step}
                    </span>
                    {isCurrent && (
                      <span className="ml-2.5 inline-block w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && (
          <div className="mt-8">
            <p className="section-header">Try these for your homework</p>
            <div className="space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="w-full text-left px-4 py-3 text-[13px] text-text-secondary hover:text-text-primary bg-surface border border-border hover:border-border-light rounded-lg transition-all cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
