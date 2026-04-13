export default function ConfidenceBar({ score, showLabel = false }) {
  if (score == null) return null;

  const clamped = Math.max(0, Math.min(100, score));

  let fillColor = 'bg-success';
  let glowColor = 'shadow-success/20';
  if (clamped < 40) {
    fillColor = 'bg-danger';
    glowColor = 'shadow-danger/20';
  } else if (clamped < 70) {
    fillColor = 'bg-warning';
    glowColor = 'shadow-warning/20';
  }

  if (!showLabel) {
    return (
      <div className="flex items-center gap-2.5">
        <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden max-w-[100px]">
          <div
            className={`h-full ${fillColor} rounded-full transition-all duration-700`}
            style={{ width: `${clamped}%` }}
          />
        </div>
        <span className="text-[12px] font-medium text-text-muted tabular-nums">
          {clamped}%
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[300px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-[0.12em] text-text-muted font-semibold">
          Confidence
        </span>
        <span className="text-[14px] font-semibold text-text-primary tabular-nums">
          {clamped}%
        </span>
      </div>
      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full ${fillColor} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
