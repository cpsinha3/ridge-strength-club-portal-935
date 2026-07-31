const TIER_STYLES: Record<string, string> = {
  unlimited: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  '8pack': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  dropin: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const TIER_LABELS: Record<string, string> = {
  unlimited: 'Unlimited',
  '8pack': '8-Pack',
  dropin: 'Drop-in',
};

export default function TierBadge({ tier }: { tier: string }) {
  const style = TIER_STYLES[tier] || TIER_STYLES.dropin;
  const label = TIER_LABELS[tier] || tier;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border ${style}`}>
      {label}
    </span>
  );
}
