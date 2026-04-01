'use client';

import Link from 'next/link';
import { Agent, AgentStatus } from '@/lib/data';

const STATUS_CONFIG: Record<AgentStatus, { color: string; bg: string; label: string; glow: string }> = {
  online: { color: '#3DD68C', bg: 'rgba(61,214,140,0.1)', label: 'Online', glow: '0 0 6px rgba(61,214,140,0.5)' },
  idle: { color: '#F5A524', bg: 'rgba(245,165,36,0.1)', label: 'Idle', glow: '0 0 6px rgba(245,165,36,0.4)' },
  error: { color: '#F56565', bg: 'rgba(245,101,101,0.1)', label: 'Error', glow: '0 0 6px rgba(245,101,101,0.5)' },
  offline: { color: 'rgba(245,245,245,0.3)', bg: 'rgba(255,255,255,0.04)', label: 'Offline', glow: 'none' },
};

interface AgentCardProps {
  agent: Agent;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export function AgentCard({ agent }: AgentCardProps) {
  const status = STATUS_CONFIG[agent.status];
  const failRate = agent.tasksCompleted > 0
    ? ((agent.tasksFailed / (agent.tasksCompleted + agent.tasksFailed)) * 100).toFixed(1)
    : '0.0';

  return (
    <Link
      href={`/agent/${agent.id}`}
      className="card-glass p-5 flex flex-col gap-3 cursor-pointer no-underline block"
      style={{ textDecoration: 'none' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none">{agent.emoji}</span>
          <div>
            <div className="font-semibold text-sm" style={{ color: '#F5F5F5', letterSpacing: '-0.01em' }}>
              {agent.name}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(245,245,245,0.4)' }}>
              {agent.model}
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-full"
          style={{ background: status.bg }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: status.color, boxShadow: status.glow }}
          />
          <span className="text-xs font-medium" style={{ color: status.color }}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Role */}
      <div
        className="text-xs px-2 py-0.5 rounded w-fit"
        style={{ background: 'rgba(124,92,252,0.1)', color: 'rgba(124,92,252,0.9)', letterSpacing: '0.02em' }}
      >
        {agent.role}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <div className="text-xs font-medium" style={{ color: '#F5F5F5' }}>
            {agent.uptime.toFixed(1)}%
          </div>
          <div className="text-xs" style={{ color: 'rgba(245,245,245,0.35)' }}>uptime</div>
        </div>
        <div>
          <div className="text-xs font-medium" style={{ color: '#F5F5F5' }}>
            {formatTokens(agent.tokensUsed24h)}
          </div>
          <div className="text-xs" style={{ color: 'rgba(245,245,245,0.35)' }}>tokens/24h</div>
        </div>
        <div>
          <div
            className="text-xs font-medium"
            style={{ color: parseFloat(failRate) > 5 ? '#F56565' : '#F5F5F5' }}
          >
            {failRate}%
          </div>
          <div className="text-xs" style={{ color: 'rgba(245,245,245,0.35)' }}>fail rate</div>
        </div>
      </div>

      {/* Uptime bar */}
      <div className="w-full h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-1 rounded-full"
          style={{
            width: `${agent.uptime}%`,
            background: agent.uptime > 95 ? '#3DD68C' : agent.uptime > 85 ? '#F5A524' : '#F56565',
          }}
        />
      </div>
    </Link>
  );
}
