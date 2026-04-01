'use client';

import { ResponsiveContainer, AreaChart, Area, Tooltip, YAxis } from 'recharts';
import { TimeSeriesPoint } from '@/lib/data';

interface SparklineChartProps {
  data: TimeSeriesPoint[];
  color?: string;
  height?: number;
  showTooltip?: boolean;
}

export function SparklineChart({ data, color = '#7C5CFC', height = 48, showTooltip = false }: SparklineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <defs>
          <linearGradient id={`sparkGrad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis domain={['auto', 'auto']} hide />
        {showTooltip && (
          <Tooltip
            contentStyle={{
              background: '#161616',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              fontSize: 12,
              color: '#F5F5F5',
              padding: '6px 10px',
            }}
            labelStyle={{ color: 'rgba(245,245,245,0.5)', fontSize: 11 }}
            formatter={(val) => [(val as number).toLocaleString(), 'tokens']}
            labelFormatter={(label) => new Date(label as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          />
        )}
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#sparkGrad-${color.replace('#', '')})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
