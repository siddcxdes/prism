import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

function parseTrendsData(trends) {
  if (!trends) return [];
  if (Array.isArray(trends)) {
    return trends.map((item, i) => ({
      period: item.period || item.date || `P${i + 1}`,
      interest: typeof item.interest === 'number' ? item.interest : (item.value || 50),
    }));
  }
  if (typeof trends === 'string') {
    const numbers = trends.match(/\d+/g);
    if (numbers && numbers.length >= 3) {
      return numbers.slice(0, 8).map((n, i) => ({
        period: `Q${i + 1}`,
        interest: Math.min(100, Math.max(0, parseInt(n))),
      }));
    }
    const isGrowing = /grow|increase|rise|surge|expand|boom/i.test(trends);
    const isDecline = /decline|decrease|fall|drop|shrink/i.test(trends);
    const points = 8;
    const data = [];
    let base = isDecline ? 75 : isGrowing ? 30 : 50;
    for (let i = 0; i < points; i++) {
      const trend = isGrowing ? 7 : isDecline ? -5 : 1;
      const noise = (Math.sin(i * 1.5) * 8) + (Math.cos(i * 0.7) * 5);
      base = Math.min(95, Math.max(10, base + trend + noise));
      data.push({
        period: ['Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3', 'Q4'][i],
        interest: Math.round(base),
      });
    }
    return data;
  }
  return [];
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111] border border-[#333] px-3 py-2 rounded shadow-2xl">
      <p className="text-[10px] text-neutral-500 font-mono mb-1">{label}</p>
      <p className="text-[13px] text-white font-mono">{payload[0].value}</p>
    </div>
  );
};

export default function MarketGrowthChart({ trends }) {
  const chartData = parseTrendsData(trends);
  if (chartData.length === 0) return null;

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="interestGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#FFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
          <XAxis dataKey="period" tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: '#222' }} tickLine={false} dy={10} />
          <YAxis tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} domain={[0, 100]} width={30} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="interest" stroke="#FFF" strokeWidth={2} fill="url(#interestGradient)" dot={false} activeDot={{ r: 4, fill: '#FFF', strokeWidth: 0 }} animationDuration={1500} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
