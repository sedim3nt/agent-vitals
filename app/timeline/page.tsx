'use client';

import { useState, useMemo } from 'react';
import { AGENTS, getTimelineEvents, TimelineEvent, EventSeverity } from '@/lib/data';
import { CheckCircle, XCircle, Clock, AlertTriangle, Activity, Settings } from 'lucide-react';

const SEVERITY_CONFIG: Record<EventSeverity, { color: string; bg: string }> = {
  success: { color: '#3DD68C', bg: 'rgba(61,214,140,0.08)' },
  error: { color: '#F56565', bg: 'rgba(245,101,101,0.08)' },
  warning: { color: '#F5A524', bg: 'rgba(245,165,36,0.08)' },
  info: { color: '#4EA8DE', bg: 'rgba(78,168,222,0.08)' },
};

const TYPE_ICONS = {
  task_complete: CheckCircle,
  task_failed: XCircle,
  task_started: Clock,
  error: AlertTriangle,
  status_change: Activity,
  config_update: Settings,
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function TimelinePage() {
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const allEvents = useMemo(() => getTimelineEvents(80), []);

  const filtered = useMemo(() => {
    return allEvents.filter(e => {
      if (filterAgent !== 'all' && e.agentId !== filterAgent) return false;
      if (filterSeverity !== 'all' && e.severity !== filterSeverity) return false;
      if (filterType !== 'all' && e.type !== filterType) return false;
      return true;
    });
  }, [allEvents, filterAgent, filterSeverity, filterType]);

  const filterBtnStyle = (active: boolean) => ({
    padding: '4px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid',
    background: active ? 'rgba(124,92,252,0.15)' : 'transparent',
    borderColor: active ? 'rgba(124,92,252,0.5)' : 'rgba(255,255,255,0.1)',
    color: active ? '#7C5CFC' : 'rgba(245,245,245,0.55)',
    transition: 'all 150ms ease',
  } as React.CSSProperties);

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1" style={{ letterSpacing: '-0.03em' }}>
          <span className="gradient-text">Activity Timeline</span>
        </h1>
        <p className="text-sm" style={{ color: 'rgba(245,245,245,0.45)' }}>
          Reverse-chronological feed of all agent actions
        </p>
      </div>

      {/* Filters */}
      <div className="card-glass p-4 mb-6 flex flex-wrap gap-4">
        {/* Agent filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider" style={{ color: 'rgba(245,245,245,0.35)', letterSpacing: '0.08em' }}>Agent</span>
          <div className="flex flex-wrap gap-1">
            <button style={filterBtnStyle(filterAgent === 'all')} onClick={() => setFilterAgent('all')}>All</button>
            {AGENTS.map(a => (
              <button key={a.id} style={filterBtnStyle(filterAgent === a.id)} onClick={() => setFilterAgent(a.id)}>
                {a.emoji} {a.name}
              </button>
            ))}
          </div>
        </div>

        {/* Severity filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider" style={{ color: 'rgba(245,245,245,0.35)', letterSpacing: '0.08em' }}>Severity</span>
          <div className="flex gap-1">
            {(['all', 'success', 'info', 'warning', 'error'] as const).map(s => (
              <button key={s} style={filterBtnStyle(filterSeverity === s)} onClick={() => setFilterSeverity(s)}>
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Event count */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs" style={{ color: 'rgba(245,245,245,0.4)' }}>
          {filtered.length} events
        </span>
        <span className="text-xs" style={{ color: 'rgba(245,245,245,0.25)' }}>
          Showing last 80 events
        </span>
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-1">
        {filtered.map((event, i) => {
          const sev = SEVERITY_CONFIG[event.severity];
          const Icon = TYPE_ICONS[event.type] ?? Activity;
          const showDate = i === 0 || new Date(filtered[i - 1].timestamp).toDateString() !== new Date(event.timestamp).toDateString();

          return (
            <div key={event.id}>
              {showDate && (
                <div
                  className="text-xs py-2 mb-1 mt-3"
                  style={{ color: 'rgba(245,245,245,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)', letterSpacing: '0.04em' }}
                >
                  {new Date(event.timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
              )}
              <EventRow event={event} sev={sev} Icon={Icon} />
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div
            className="text-center py-16 text-sm"
            style={{ color: 'rgba(245,245,245,0.3)' }}
          >
            No events match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}

function EventRow({
  event,
  sev,
  Icon,
}: {
  event: TimelineEvent;
  sev: { color: string; bg: string };
  Icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
}) {
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-lg group transition-all duration-150"
      style={{ background: 'transparent' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Icon */}
      <div
        className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center mt-0.5"
        style={{ background: sev.bg }}
      >
        <Icon size={12} style={{ color: sev.color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium" style={{ color: '#F5F5F5' }}>
            {event.agentEmoji} {event.agentName}
          </span>
          <span className="text-xs" style={{ color: 'rgba(245,245,245,0.45)' }}>
            {event.message}
          </span>
        </div>
      </div>

      {/* Timestamp */}
      <div className="flex-shrink-0 text-right">
        <div className="text-xs" style={{ color: 'rgba(245,245,245,0.3)', fontFamily: 'var(--font-mono)' }}>
          {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'rgba(245,245,245,0.2)' }}>
          {timeAgo(event.timestamp)}
        </div>
      </div>
    </div>
  );
}
