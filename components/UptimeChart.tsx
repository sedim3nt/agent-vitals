'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { UptimeDay } from '@/lib/data';

interface UptimeChartProps {
  data: UptimeDay[];
}

export function UptimeChart({ data }: UptimeChartProps) {
  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={4}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: 'rgba(245,245,245,0.3)' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'rgba(245,245,245,0.3)' }}
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
          tickFormatter={v => `${v}%`}
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
          formatter={(val) => [`${(val as number).toFixed(1)}%`, 'uptime']}
        />
        <Bar dataKey="uptime" radius={[2, 2, 0, 0]} isAnimationActive={false}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.uptime > 95 ? '#3DD68C' : entry.uptime > 85 ? '#F5A524' : '#F56565'}
              opacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
