export default function SentimentBadge({ sentiment }) {
  const s = (sentiment || 'neutral').toLowerCase();

  const styles = {
    positive: 'bg-success/12 text-success border-success/20',
    negative: 'bg-danger/12 text-danger border-danger/20',
    neutral: 'bg-white/5 text-text-muted border-white/5',
  };

  return (
    <span
      className={`inline-block text-[10px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md border ${styles[s] || styles.neutral}`}
    >
      {s}
    </span>
  );
}
