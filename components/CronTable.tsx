'use client';

import { CronJob } from '@/lib/data';
import { CheckCircle, XCircle, Clock, Pause } from 'lucide-react';

function timeAgo(iso: string | null): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return 'just now';
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function timeUntil(iso: string | null): string {
  if (!iso) return '—';
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return 'overdue';
  if (diff < 60_000) return '<1m';
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m`;
  return `${Math.floor(diff / 3600_000)}h ${Math.floor((diff % 3600_000) / 60_000)}m`;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; Icon: typeof CheckCircle }> = {
  ok: { color: '#3DD68C', bg: 'rgba(61,214,140,0.08)', Icon: CheckCircle },
  error: { color: '#F56565', bg: 'rgba(245,101,101,0.08)', Icon: XCircle },
  unknown: { color: 'rgba(245,245,245,0.35)', bg: 'rgba(255,255,255,0.04)', Icon: Clock },
  disabled: { color: 'rgba(245,245,245,0.25)', bg: 'rgba(255,255,255,0.02)', Icon: Pause },
};

interface CronTableProps {
  crons: CronJob[];
}

export function CronTable({ crons }: CronTableProps) {
  return (
    <div>
      <h2
        className="text-sm font-semibold mb-4"
        style={{ color: 'rgba(245,245,245,0.7)', letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '11px' }}
      >
        Cron Jobs
      </h2>
      <div className="card-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Status', 'Name', 'Schedule', 'Last Run', 'Next Run', 'Target'].map(h => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-medium uppercase"
                    style={{ color: 'rgba(245,245,245,0.35)', letterSpacing: '0.06em' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {crons.map(cron => {
                const statusKey = !cron.enabled ? 'disabled' : cron.lastStatus;
                const cfg = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.unknown;
                const Icon = cfg.Icon;

                return (
                  <tr
                    key={cron.id}
                    className="transition-colors duration-100"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
                          style={{ background: cfg.bg }}
                        >
                          <Icon size={11} style={{ color: cfg.color }} />
                          <span className="text-xs font-medium capitalize" style={{ color: cfg.color }}>
                            {!cron.enabled ? 'disabled' : cron.lastStatus}
                          </span>
                        </div>
                        {cron.consecutiveErrors > 0 && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(245,101,101,0.12)', color: '#F56565' }}
                          >
                            {cron.consecutiveErrors}×
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ color: '#F5F5F5' }}>{cron.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <code
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(245,245,245,0.6)' }}
                      >
                        {cron.schedule}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs" style={{ color: 'rgba(245,245,245,0.55)' }}>
                        {timeAgo(cron.lastRunAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs" style={{ color: 'rgba(245,245,245,0.55)' }}>
                        {timeUntil(cron.nextRunAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(124,92,252,0.08)', color: 'rgba(124,92,252,0.8)' }}
                      >
                        {cron.sessionTarget}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Error details */}
        {crons.some(c => c.lastError) && (
          <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-xs font-medium mb-2" style={{ color: 'rgba(245,245,245,0.45)' }}>
              Recent Errors
            </div>
            {crons.filter(c => c.lastError).map(c => (
              <div
                key={c.id}
                className="text-xs p-2 rounded mb-1 font-mono"
                style={{ background: 'rgba(245,101,101,0.06)', color: '#F56565' }}
              >
                <span style={{ color: 'rgba(245,245,245,0.5)' }}>{c.name}:</span> {c.lastError}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
