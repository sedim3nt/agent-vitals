'use client';

import { AGENTS, FLEET_TOKEN_SPARKLINE, TASK_THROUGHPUT, getFleetStats } from '@/lib/data';
import { AgentCard } from '@/components/AgentCard';
import { StatCard } from '@/components/StatCard';
import { SparklineChart } from '@/components/SparklineChart';
import { ThroughputChart } from '@/components/ThroughputChart';
import { Activity, Cpu, AlertTriangle, Zap } from 'lucide-react';

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export default function Dashboard() {
  const stats = getFleetStats();

  return (
    <div className="max-w-[1300px] mx-auto px-6 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-1"
          style={{ letterSpacing: '-0.03em' }}
        >
          <span className="gradient-text">Fleet Overview</span>
        </h1>
        <p className="text-sm" style={{ color: 'rgba(245,245,245,0.45)' }}>
          Real-time health monitoring across {stats.totalAgents} agents — Last updated just now
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Total Agents"
          value={stats.totalAgents}
          icon={<Cpu size={14} />}
        />
        <StatCard
          label="Active Now"
          value={stats.activeNow}
          sub={`${stats.totalAgents - stats.activeNow} idle or offline`}
          icon={<Activity size={14} />}
          accent
        />
        <StatCard
          label="Errors Today"
          value={stats.errorsToday}
          sub="across all agents"
          icon={<AlertTriangle size={14} />}
        />
        <StatCard
          label="Tokens 24h"
          value={formatTokens(stats.tokensTotal)}
          sub={`$${stats.totalCost.toFixed(2)} estimated`}
          icon={<Zap size={14} />}
          accent
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Token burn sparkline */}
        <div className="card-glass p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold" style={{ color: '#F5F5F5' }}>Token Burn</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(245,245,245,0.4)' }}>24h rolling — all agents</div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(124,92,252,0.12)', color: '#7C5CFC' }}>
              {formatTokens(stats.tokensTotal)} total
            </span>
          </div>
          <SparklineChart data={FLEET_TOKEN_SPARKLINE} color="#7C5CFC" height={80} showTooltip />
        </div>

        {/* Task throughput */}
        <div className="card-glass p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold" style={{ color: '#F5F5F5' }}>Task Throughput</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(245,245,245,0.4)' }}>Tasks/hour, last 24h</div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(78,168,222,0.12)', color: '#4EA8DE' }}>
              live
            </span>
          </div>
          <ThroughputChart data={TASK_THROUGHPUT} />
        </div>
      </div>

      {/* Agent grid */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold" style={{ color: 'rgba(245,245,245,0.7)', letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '11px' }}>
          Agent Roster
        </h2>
        <span className="text-xs" style={{ color: 'rgba(245,245,245,0.35)' }}>
          Click an agent for details
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {AGENTS.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
