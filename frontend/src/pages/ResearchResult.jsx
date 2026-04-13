import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import SentimentBadge from '../components/ui/SentimentBadge';
import ConfidenceBar from '../components/ui/ConfidenceBar';
import StockChart from '../components/ui/StockChart';
import CompanyOverview from '../components/research/CompanyOverview';
import NewsArticles from '../components/research/NewsArticles';
import CompanyComparisonChart from '../components/research/CompanyComparisonChart';
import MarketGrowthChart from '../components/research/MarketGrowthChart';
import { ArrowLeft, Download, Trash2, Plus, X, Globe, BarChart2, Hash, BookOpen } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

function Sparkline({ sentiment }) {
  const s = (sentiment || 'neutral').toLowerCase();
  const color = s === 'positive' ? '#10B981' : s === 'negative' ? '#EF4444' : '#FFFFFF';
  const trend = s === 'positive' ? 1 : s === 'negative' ? -1 : 0;

  const data = [];
  let v = 50;
  for (let i = 0; i < 12; i++) {
    v = Math.max(10, Math.min(90, v + trend * 3 + (Math.sin(i * 1.2) * 6) + (Math.random() - 0.5) * 8));
    data.push({ v: Math.round(v) });
  }

  return (
    <ResponsiveContainer width="100%" height={24}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function ResearchResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    api.get(`/research/${id}`)
      .then((res) => setReport(res.data))
      .catch((err) => setError(err.response?.data?.detail || 'Failed to load report'))
      .finally(() => setLoading(false));
  }, [id]);

  const exportCSV = () => {
    if (!report) return;
    const rows = [
      ['Property', 'Value'],
      ['Query', report.query],
      ['Type', report.query_type || 'General'],
      ['Sentiment', report.sentiment],
      ['Confidence', `${report.confidence_score || 'N/A'}%`],
      ['Summary', `"${(report.summary || '').replace(/"/g, '""')}"`],
      ['Generated On', new Date(report.created_at).toISOString()],
      ...((report.key_insights || []).map((k, i) => [`Insight ${i + 1}`, `"${k.replace(/"/g, '""')}"`])),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-report-${report.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (!confirm('Permanently delete this report?')) return;
    try {
      await api.delete(`/research/${id}`);
      navigate('/history');
    } catch {}
  };

  const addTag = async () => {
    const tag = tagInput.trim();
    if (!tag || !report) return;
    const newTags = [...(report.tags || []), tag];
    try {
      await api.patch(`/research/${id}/tags`, { tags: newTags });
      setReport({ ...report, tags: newTags });
      setTagInput('');
    } catch {}
  };

  const removeTag = async (tagToRemove) => {
    if (!report) return;
    const newTags = (report.tags || []).filter((t) => t !== tagToRemove);
    try {
      await api.patch(`/research/${id}/tags`, { tags: newTags });
      setReport({ ...report, tags: newTags });
    } catch {}
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto h-screen flex flex-col justify-center items-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
        <p className="text-[12px] text-neutral-500 font-mono uppercase tracking-[0.2em]">Synthesizing Data</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="btn-ghost mb-8 border-none"><ArrowLeft size={14} className="inline mr-2"/> Return</button>
        <div className="p-4 border border-red-500/20 bg-red-500/10 text-red-500 text-[13px] rounded-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto animate-fade-in bg-[#050505] min-h-screen">
      
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#222]">
        <div className="flex-1">
          <button onClick={() => navigate(-1)} className="text-[11px] text-neutral-500 hover:text-white uppercase tracking-[0.15em] font-semibold flex items-center gap-2 mb-4 transition-colors"><ArrowLeft size={12} /> Return</button>
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight leading-tight mb-3">
            {report.query}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="text-[12px] text-neutral-400 font-mono">
              {new Date(report.created_at).toLocaleDateString('en-US', { disable: false, month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className="h-4 w-[1px] bg-[#333] hidden sm:block"/>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-500 uppercase tracking-widest">Sentiment</span>
              <SentimentBadge sentiment={report.sentiment} />
            </div>
            {report.confidence_score != null && (
              <>
                <div className="h-4 w-[1px] bg-[#333] hidden sm:block"/>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-neutral-500 uppercase tracking-widest">Confidence</span>
                  <div className="w-24"><ConfidenceBar score={report.confidence_score} /></div>
                </div>
              </>
            )}
            <div className="h-4 w-[1px] bg-[#333] hidden sm:block"/>
            <span className="text-[12px] text-neutral-400 font-mono">{(report.sources || []).length} Sources</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="flex gap-2">
            <button onClick={exportCSV} className="btn-ghost flex items-center gap-2 text-[11px] uppercase tracking-wider backdrop-blur-sm bg-white/5 border-white/10"><Download size={14} /> Export</button>
            <button onClick={handleDelete} className="btn-ghost flex items-center gap-2 text-[11px] uppercase tracking-wider text-red-400 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-300"><Trash2 size={14} /> Delete</button>
          </div>
          
          <div className="flex items-center gap-2 bg-[#111] p-1.5 rounded-lg border border-[#222]">
            {(report.tags || []).map((tag, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-white bg-white/10 px-2 py-1 rounded">
                {tag} <button onClick={() => removeTag(tag)} className="hover:text-red-400"><X size={10} /></button>
              </span>
            ))}
            <form onSubmit={(e) => { e.preventDefault(); addTag(); }} className="flex items-center">
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add Tag..." className="bg-transparent border-none text-[10px] uppercase font-mono tracking-wider text-neutral-400 w-24 px-2 focus:outline-none focus:text-white" />
              {tagInput.trim() && <button type="submit" className="text-white bg-white/10 p-1 rounded hover:bg-white/20 transition-colors"><Plus size={10} /></button>}
            </form>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
        
        {/* Left Column (Primary Content) - span 8 */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          
          {/* Executive Summary */}
          <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-6 relative overflow-hidden group">
            <h2 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><BookOpen size={14}/> Quick Summary</h2>
            <p className="text-[15px] text-neutral-200 leading-relaxed font-light">
              {report.summary}
            </p>
          </div>

          {/* Key Insights (Bento Split) */}
          {report.key_insights && report.key_insights.length > 0 && (
            <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-6">
              <h2 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-5 flex items-center gap-2"><Hash size={14}/> Main Takeaways</h2>
              <div className="grid gap-4">
                {report.key_insights.map((insight, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-[#111] border border-[#222] rounded-lg">
                    <span className="text-white font-mono text-[14px] font-bold">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-[14px] text-neutral-300 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stock Performance isolated large block */}
          {report.stock_data && (
            <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-6">
              <h2 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><BarChart2 size={14} /> Stock Chart</h2>
              <div className="h-[350px]">
                <StockChart stockData={report.stock_data} />
              </div>
            </div>
          )}

          {/* Top Companies / Comparison Chart */}
          {report.top_companies && report.top_companies.length > 0 && (
            <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-6">
              <h2 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-6">Similar Companies</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {report.top_companies.map((company, i) => (
                  <div key={i} className="bg-[#111] border border-[#222] p-4 rounded-lg flex flex-col justify-between">
                    <div>
                      <p className="text-[13px] text-white font-medium truncate mb-1">{company.name || company.company}</p>
                      <p className="text-[11px] text-neutral-500 font-mono mb-3">{company.ticker || company.symbol}</p>
                    </div>
                    <div className="mt-auto">
                      <div className="mb-3 opacity-60"><Sparkline sentiment={company.sentiment} /></div>
                      {company.sentiment && <SentimentBadge sentiment={company.sentiment} />}
                    </div>
                  </div>
                ))}
              </div>
              <CompanyComparisonChart companies={report.top_companies} />
            </div>
          )}

          {/* Market Growth Chart (if trends present) */}
          {report.trends && (
            <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-6">
              <h2 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-4">Trend Graph</h2>
              <div className="h-[250px]">
                <MarketGrowthChart trends={report.trends} />
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Secondary Data) - span 4 */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">

          {/* Company Overview Card */}
          {report.query_type === 'company' && report.company_overview && (
            <div className="bg-white text-black rounded-xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Globe size={100} />
              </div>
              <h2 className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-4">Company Basics</h2>
              <div className="relative z-10">
                <CompanyOverview data={report.company_overview} theme="light" />
              </div>
            </div>
          )}

          {/* Financials Bento Box */}
          {report.financial_comparison && report.financial_comparison.length > 0 && (
            <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-6 overflow-hidden">
              <h2 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-4">Numbers</h2>
              <div className="space-y-3">
                {report.financial_comparison.map((row, i) => (
                  <div key={i} className="flex flex-col pb-3 border-b border-[#222] last:border-0 last:pb-0">
                    <span className="text-[12px] text-neutral-400 mb-1">{row.metric || row.name}</span>
                    <div className="flex justify-between items-end">
                      <span className="text-[15px] font-mono text-white">{row.value}</span>
                      <span className="text-[11px] text-neutral-600 font-mono">Vs avg {row.industry_average || row.industry_avg || row.avg || '—'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* News Feed */}
          {report.news_articles && report.news_articles.length > 0 && (
            <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-6">
              <h2 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-4">Recent News</h2>
              <NewsArticles articles={report.news_articles} />
            </div>
          )}

          {/* Sources List */}
          {report.sources && report.sources.length > 0 && (
            <div className="bg-[#111] border border-[#222] rounded-xl p-6">
              <h2 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-4">Links / Sources</h2>
              <ul className="space-y-3">
                {report.sources.map((source, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-[10px] text-neutral-600 mt-1">{(i+1).toString().padStart(2, '0')}</span>
                    <a href={source} target="_blank" rel="noopener noreferrer" className="text-[11px] text-neutral-400 hover:text-white break-all hover:underline underline-offset-2">
                      {source}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
