'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TimeSeriesPoint } from '@/lib/data';

interface ThroughputChartProps {
  data: TimeSeriesPoint[];
}

export function ThroughputChart({ data }: ThroughputChartProps) {
  const formatted = data.map(d => ({
    time: new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    value: d.value,
  }));

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C5CFC" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#4EA8DE" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 10, fill: 'rgba(245,245,245,0.3)' }}
          tickLine={false}
          axisLine={false}
          interval={3}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'rgba(245,245,245,0.3)' }}
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
          formatter={(val) => [val as number, 'tasks']}
          labelStyle={{ color: 'rgba(245,245,245,0.5)', fontSize: 11 }}
        />
        <Bar dataKey="value" fill="url(#barGrad)" radius={[2, 2, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
