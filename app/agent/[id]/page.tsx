'use client';

import { use } from 'react';
import Link from 'next/link';
import { AGENTS, getAgentTasks, getAgentErrors, getAgentUptimeHistory, getAgentTokenHistory, getAgentConfig } from '@/lib/data';
import { UptimeChart } from '@/components/UptimeChart';
import { SparklineChart } from '@/components/SparklineChart';
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { notFound } from 'next/navigation';

function formatDuration(s: number): string {
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const STATUS_COLORS = {
  online: '#3DD68C',
  idle: '#F5A524',
  error: '#F56565',
  offline: 'rgba(245,245,245,0.3)',
};

const TASK_STATUS_CONFIG = {
  success: { color: '#3DD68C', icon: CheckCircle, bg: 'rgba(61,214,140,0.08)' },
  failed: { color: '#F56565', icon: XCircle, bg: 'rgba(245,101,101,0.08)' },
  running: { color: '#4EA8DE', icon: Clock, bg: 'rgba(78,168,222,0.08)' },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AgentDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const agent = AGENTS.find(a => a.id === id);

  if (!agent) return notFound();

  const tasks = getAgentTasks(id);
  const errors = getAgentErrors(id);
  const uptimeHistory = getAgentUptimeHistory(id);
  const tokenHistory = getAgentTokenHistory(id);
  const config = getAgentConfig(id);

  const statusColor = STATUS_COLORS[agent.status];
  const failRate = ((agent.tasksFailed / (agent.tasksCompleted + agent.tasksFailed)) * 100).toFixed(1);

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      {/* Back nav */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 mb-6 text-sm no-underline transition-colors duration-150"
        style={{ color: 'rgba(245,245,245,0.45)' }}
      >
        <ArrowLeft size={13} />
        Fleet Overview
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <span className="text-5xl leading-none">{agent.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold" style={{ letterSpacing: '-0.03em' }}>
              {agent.name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm" style={{ color: 'rgba(245,245,245,0.5)' }}>{agent.model}</span>
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{ background: 'rgba(124,92,252,0.1)', color: 'rgba(124,92,252,0.9)' }}
              >
                {agent.role}
              </span>
            </div>
            <p className="text-sm mt-2 max-w-xl" style={{ color: 'rgba(245,245,245,0.5)' }}>
              {agent.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: `${statusColor}15`, border: `1px solid ${statusColor}30` }}>
          <div className="w-2 h-2 rounded-full" style={{ background: statusColor }} />
          <span className="text-sm font-medium capitalize" style={{ color: statusColor }}>
            {agent.status}
          </span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Uptime', value: `${agent.uptime.toFixed(1)}%` },
          { label: 'Tasks Done', value: agent.tasksCompleted.toLocaleString() },
          { label: 'Fail Rate', value: `${failRate}%` },
          { label: 'Last Active', value: timeAgo(agent.lastSeen) },
        ].map(s => (
          <div key={s.label} className="card-glass p-4">
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(245,245,245,0.35)', letterSpacing: '0.08em' }}>
              {s.label}
            </div>
            <div className="text-xl font-bold" style={{ letterSpacing: '-0.02em' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="card-glass p-5">
          <div className="text-sm font-semibold mb-1" style={{ color: '#F5F5F5' }}>Uptime — Last 7 Days</div>
          <div className="text-xs mb-4" style={{ color: 'rgba(245,245,245,0.4)' }}>Daily uptime percentage</div>
          <UptimeChart data={uptimeHistory} />
        </div>

        <div className="card-glass p-5">
          <div className="text-sm font-semibold mb-1" style={{ color: '#F5F5F5' }}>Token Usage — 24h</div>
          <div className="text-xs mb-4" style={{ color: 'rgba(245,245,245,0.4)' }}>Tokens per hour</div>
          <SparklineChart data={tokenHistory} color="#4EA8DE" height={120} showTooltip />
        </div>
      </div>

      {/* Tasks + Errors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Recent tasks */}
        <div className="card-glass p-5">
          <div className="text-sm font-semibold mb-4" style={{ color: '#F5F5F5' }}>Recent Tasks</div>
          <div className="flex flex-col gap-2">
            {tasks.map(task => {
              const cfg = TASK_STATUS_CONFIG[task.status];
              const Icon = cfg.icon;
              return (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ background: cfg.bg }}
                >
                  <Icon size={14} style={{ color: cfg.color, marginTop: 1, flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate" style={{ color: '#F5F5F5' }}>{task.title}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs" style={{ color: 'rgba(245,245,245,0.4)' }}>
                        {timeAgo(task.startedAt)}
                      </span>
                      {task.duration && (
                        <span className="text-xs" style={{ color: 'rgba(245,245,245,0.3)' }}>
                          · {formatDuration(task.duration)}
                        </span>
                      )}
                      <span className="text-xs" style={{ color: 'rgba(245,245,245,0.3)' }}>
                        · {(task.tokensUsed / 1000).toFixed(0)}K tok
                      </span>
                    </div>
                    {task.error && (
                      <div className="text-xs mt-1 font-mono" style={{ color: '#F56565' }}>{task.error}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error log */}
        <div className="card-glass p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={14} style={{ color: '#F5A524' }} />
            <div className="text-sm font-semibold" style={{ color: '#F5F5F5' }}>Error Log</div>
            <span
              className="text-xs px-1.5 py-0.5 rounded ml-auto"
              style={{ background: 'rgba(245,101,101,0.1)', color: '#F56565' }}
            >
              {errors.length}
            </span>
          </div>
          {errors.length === 0 ? (
            <div className="text-sm" style={{ color: 'rgba(245,245,245,0.35)' }}>No errors recorded.</div>
          ) : (
            <div className="flex flex-col gap-2">
              {errors.map((err, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg"
                  style={{ background: 'rgba(245,101,101,0.05)', border: '1px solid rgba(245,101,101,0.15)' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono" style={{ color: '#F56565' }}>{err.code}</span>
                    <span className="text-xs" style={{ color: 'rgba(245,245,245,0.35)' }}>
                      {timeAgo(err.timestamp)}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: 'rgba(245,245,245,0.65)' }}>{err.message}</div>
                </div>
              ))}
            </div>
          )}

          {/* Config viewer */}
          <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-sm font-semibold mb-3" style={{ color: '#F5F5F5' }}>Config / ROLE.md</div>
            <pre
              className="text-xs p-3 rounded-lg overflow-auto scrollbar-thin"
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(245,245,245,0.65)',
                fontFamily: 'var(--font-mono)',
                maxHeight: 240,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}
            >
              {config}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
