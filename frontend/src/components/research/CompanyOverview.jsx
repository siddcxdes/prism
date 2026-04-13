export default function CompanyOverview({ data, theme = 'dark' }) {
  if (!data) return null;

  const fields = [
    { label: 'Entity', value: data.name || data.company_name },
    { label: 'Founded', value: data.founded },
    { label: 'HQ', value: data.headquarters || data.hq },
    { label: 'Sector', value: data.industry },
    { label: 'Leadership', value: data.ceo },
    { label: 'Headcount', value: data.employees },
  ].filter((f) => f.value);

  const textPrim = theme === 'light' ? 'text-black' : 'text-white';
  const textSec = theme === 'light' ? 'text-neutral-600' : 'text-neutral-400';
  const textMut = theme === 'light' ? 'text-neutral-500' : 'text-neutral-500';

  return (
    <div className="flex flex-col gap-6">
      {data.description && (
        <p className={`text-[12px] ${textSec} leading-relaxed`}>
          {data.description}
        </p>
      )}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {fields.map((f) => (
          <div key={f.label}>
            <p className={`text-[10px] ${textMut} uppercase tracking-[0.2em] mb-1 font-semibold`}>
              {f.label}
            </p>
            <p className={`text-[13px] ${textPrim} font-medium`}>{f.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
