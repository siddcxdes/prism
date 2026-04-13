import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

export default function StockChart({ stockData }) {
  if (!stockData) return null;

  let chartData = [];
  let currentPrice = null;
  let priceChange = null;

  try {
    if (stockData.historical_prices && Array.isArray(stockData.historical_prices)) {
      chartData = stockData.historical_prices.map((item) => ({
        date: new Date(item.date || item.Date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: parseFloat(item.close || item.Close),
      }));
    } else if (stockData.prices && typeof stockData.prices === 'object') {
      chartData = Object.entries(stockData.prices).map(([date, price]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: parseFloat(price),
      }));
    }

    if (chartData.length > 0) {
      currentPrice = chartData[chartData.length - 1].price;
      const firstPrice = chartData[0].price;
      if (firstPrice > 0) {
        priceChange = ((currentPrice - firstPrice) / firstPrice * 100).toFixed(2);
      }
    }

    if (stockData.current_price) currentPrice = parseFloat(stockData.current_price);
    if (stockData.price_change_pct != null) priceChange = parseFloat(stockData.price_change_pct).toFixed(2);
  } catch {
    return (
      <div className="h-full w-full flex items-center justify-center p-6 border border-dashed border-[#222] rounded-lg">
        <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider text-center">Data Unavailable</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6 border border-dashed border-[#222] rounded-lg">
        <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider text-center">Stock history not accessible for this ticker<br/><span className="text-[9px] opacity-60 mt-2 block">(Try using exchange suffixes like .NS)</span></p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[#111] border border-[#333] px-3 py-2 rounded shadow-2xl">
        <p className="text-[10px] text-neutral-500 font-mono mb-1">{label}</p>
        <p className="text-[13px] text-white font-mono">${payload[0].value.toFixed(2)}</p>
      </div>
    );
  };

  const isPositive = parseFloat(priceChange) >= 0;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          {currentPrice != null && (
            <p className="text-3xl font-mono text-white tracking-tight">${currentPrice.toFixed(2)}</p>
          )}
        </div>
        {priceChange != null && (
          <span className={`text-[14px] font-mono ${isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
            {isPositive ? '+' : ''}{priceChange}%
          </span>
        )}
      </div>

      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: '#222' }} tickLine={false} interval="preserveStartEnd" dy={10} />
            <YAxis tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} width={50} tickFormatter={(v) => `$${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="price" stroke="#FFF" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#FFF', strokeWidth: 0 }} animationDuration={1500} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
