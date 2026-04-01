'use client';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, sub, accent, icon }: StatCardProps) {
  return (
    <div
      className="card-glass p-4 flex flex-col gap-1"
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: 'rgba(245,245,245,0.4)', letterSpacing: '0.08em' }}
        >
          {label}
        </span>
        {icon && <span style={{ color: 'rgba(245,245,245,0.3)' }}>{icon}</span>}
      </div>
      <div
        className="text-2xl font-bold leading-none"
        style={{
          letterSpacing: '-0.03em',
          color: accent ? undefined : '#F5F5F5',
        }}
      >
        {accent ? <span className="gradient-text">{value}</span> : value}
      </div>
      {sub && (
        <div className="text-xs mt-1" style={{ color: 'rgba(245,245,245,0.4)' }}>
          {sub}
        </div>
      )}
    </div>
  );
}
