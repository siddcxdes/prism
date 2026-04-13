import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';

function sentimentToScore(sentiment) {
  const s = (sentiment || 'neutral').toLowerCase();
  if (s === 'positive') return 100;
  if (s === 'negative') return 0;
  return 50;
}

function sentimentToColor(sentiment) {
  const s = (sentiment || 'neutral').toLowerCase();
  if (s === 'positive') return '#FFFFFF';
  if (s === 'negative') return '#444444';
  return '#888888';
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-[#111] border border-[#333] px-3 py-2 rounded shadow-2xl">
      <p className="text-[12px] text-white font-medium mb-1">{data.name}</p>
      <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
        {data.sentiment || 'neutral'}
      </p>
    </div>
  );
};

export default function CompanyComparisonChart({ companies }) {
  if (!companies || companies.length === 0) return null;

  const chartData = companies.map((c) => ({
    name: c.ticker || c.symbol || c.name.slice(0,6) || 'N/A',
    score: sentimentToScore(c.sentiment),
    sentiment: c.sentiment || 'neutral',
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={chartData} barSize={24}>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: '#222' }} tickLine={false} dy={5} />
          <YAxis tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} domain={[0, 100]} ticks={[0, 50, 100]} width={30} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar dataKey="score" radius={[4, 4, 0, 0]} animationDuration={1500}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={sentimentToColor(entry.sentiment)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
