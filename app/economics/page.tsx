'use client';

import { getModelCosts, getAgentCosts, getFleetStats } from '@/lib/data';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

function CostTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { model?: string } }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#161616',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8,
      fontSize: 12,
      color: '#F5F5F5',
      padding: '8px 12px',
    }}>
      <div style={{ color: 'rgba(245,245,245,0.5)', fontSize: 11 }}>{payload[0].payload.model ?? payload[0].name}</div>
      <div className="font-semibold">${payload[0].value.toFixed(2)}</div>
    </div>
  );
}

export default function EconomicsPage() {
  const modelCosts = getModelCosts();
  const agentCosts = getAgentCosts();
  const stats = getFleetStats();

  const totalDailyCost = stats.totalCost;
  const projectedMonthly = totalDailyCost * 30;

  const agentBarData = agentCosts.map(a => ({
    name: `${a.emoji} ${a.name}`,
    cost: a.cost,
    tasks: a.tasks,
  }));

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1" style={{ letterSpacing: '-0.03em' }}>
          <span className="gradient-text">Economics</span>
        </h1>
        <p className="text-sm" style={{ color: 'rgba(245,245,245,0.45)' }}>
          Token costs, model spend, and fleet efficiency
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Daily Burn', value: `$${totalDailyCost.toFixed(2)}` },
          { label: 'Monthly Projected', value: `$${projectedMonthly.toFixed(2)}`, accent: true },
          { label: 'Total Tokens 24h', value: `${(stats.tokensTotal / 1_000_000).toFixed(1)}M` },
          { label: 'Cost / Task', value: `$${(totalDailyCost / Math.max(1, agentCosts.reduce((s, a) => s + a.tasks, 0))).toFixed(4)}` },
        ].map(s => (
          <div key={s.label} className="card-glass p-4">
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(245,245,245,0.35)', letterSpacing: '0.08em' }}>
              {s.label}
            </div>
            <div className={`text-2xl font-bold`} style={{ letterSpacing: '-0.03em' }}>
              {s.accent ? <span className="gradient-text">{s.value}</span> : s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Pie chart */}
        <div className="card-glass p-5">
          <div className="text-sm font-semibold mb-1" style={{ color: '#F5F5F5' }}>Cost by Model</div>
          <div className="text-xs mb-4" style={{ color: 'rgba(245,245,245,0.4)' }}>24h token spend per model</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={modelCosts}
                dataKey="cost"
                nameKey="model"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                isAnimationActive={false}
              >
                {modelCosts.map((m, i) => (
                  <Cell key={i} fill={m.color} opacity={0.85} />
                ))}
              </Pie>
              <Tooltip content={<CostTooltip />} />
              <Legend
                formatter={(value) => (
                  <span style={{ color: 'rgba(245,245,245,0.65)', fontSize: 12 }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cost per agent bar */}
        <div className="card-glass p-5">
          <div className="text-sm font-semibold mb-1" style={{ color: '#F5F5F5' }}>Cost by Agent</div>
          <div className="text-xs mb-4" style={{ color: 'rgba(245,245,245,0.4)' }}>24h USD spend per agent</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={agentBarData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: 'rgba(245,245,245,0.3)' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `$${v.toFixed(2)}`}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={90}
                tick={{ fontSize: 11, fill: 'rgba(245,245,245,0.6)' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#161616',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#F5F5F5',
                  padding: '6px 10px',
                }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                formatter={(val) => [`$${(val as number).toFixed(2)}`, 'cost']}
              />
              <Bar dataKey="cost" fill="#7C5CFC" radius={[0, 2, 2, 0]} isAnimationActive={false} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Efficiency table */}
      <div className="card-glass p-5">
        <div className="text-sm font-semibold mb-4" style={{ color: '#F5F5F5' }}>Cost Efficiency — Tasks per Dollar</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Agent', 'Model', 'Cost/24h', 'Tasks', 'Tasks/$', 'Tokens'].map(h => (
                  <th
                    key={h}
                    className="text-left pb-3 pr-4"
                    style={{ color: 'rgba(245,245,245,0.35)', fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agentCosts.map((a, i) => (
                <tr
                  key={a.id}
                  style={{ borderBottom: i < agentCosts.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                >
                  <td className="py-3 pr-4">
                    <span>{a.emoji} {a.name}</span>
                  </td>
                  <td className="py-3 pr-4" style={{ color: 'rgba(245,245,245,0.5)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                    {/* find model from AGENTS */}
                    —
                  </td>
                  <td className="py-3 pr-4 font-medium">${a.cost.toFixed(2)}</td>
                  <td className="py-3 pr-4" style={{ color: 'rgba(245,245,245,0.65)' }}>{a.tasks}</td>
                  <td className="py-3 pr-4">
                    <span
                      className="font-semibold"
                      style={{ color: a.efficiency > 50 ? '#3DD68C' : a.efficiency > 20 ? '#F5A524' : '#F56565' }}
                    >
                      {a.efficiency.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3" style={{ color: 'rgba(245,245,245,0.4)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                    {(a.tokens / 1_000_000).toFixed(2)}M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
