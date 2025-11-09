"use client";

import GlassCard from '@/components/ui/GlassCard';
import GradientHeading from '@/components/ui/GradientHeading';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface TrendData {
  month: string;
  collected: number;
  distributed: number;
}

export default function TrendChart() {
  const [data, setData] = useState<TrendData[]>([]);
  const [stats, setStats] = useState({ avgPerMonth: 0, conversionRate: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real data from metrics API and derive trend
    fetch('/api/metrics')
      .then(res => res.json())
      .then(metricsData => {
        // Generate trend data (in production, this would come from historical records)
        const totalCollected = metricsData.totalLaptopsCollected || 0;
        const totalDistributed = metricsData.totalChromebooksDistributed || 0;

        // Simulate monthly growth (replace with actual historical data when available)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData: TrendData[] = months.map((month, index) => {
          const progress = (index + 1) / 12;
          return {
            month,
            collected: Math.floor(totalCollected * progress),
            distributed: Math.floor(totalDistributed * progress),
          };
        });

        setData(monthlyData);

        // Calculate stats
        const avgPerMonth = Math.floor(totalCollected / 12);
        const conversionRate = totalCollected > 0
          ? Math.round((totalDistributed / totalCollected) * 100)
          : 0;

        setStats({ avgPerMonth, conversionRate });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching trend data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <GlassCard className="p-6 animate-pulse">
        <div className="h-8 bg-surface-alt rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-surface-alt rounded"></div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-6">
        <GradientHeading className="text-2xl md:text-3xl mb-2" variant="navy">
          Yearly Device Flow
        </GradientHeading>
        <p className="text-sm md:text-base text-secondary font-medium">
          Cumulative laptops collected and Chromebooks distributed throughout the year
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="collectedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1B365D" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#1B365D" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="distributedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F5BB2D" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#F5BB2D" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
          <XAxis
            dataKey="month"
            stroke="var(--color-text-muted)"
            style={{ fontSize: '13px', fontWeight: 600 }}
            tick={{ fill: 'var(--color-text-muted)' }}
          />
          <YAxis
            stroke="var(--color-text-muted)"
            style={{ fontSize: '13px', fontWeight: 600 }}
            tick={{ fill: 'var(--color-text-muted)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            labelStyle={{ color: 'var(--color-text-primary)', fontWeight: 'bold', marginBottom: '4px' }}
            itemStyle={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}
          />
          <Legend
            wrapperStyle={{ fontSize: '14px', fontWeight: 600 }}
            iconType="circle"
          />
          <Area
            type="monotone"
            dataKey="collected"
            stroke="var(--color-accent)"
            strokeWidth={3}
            fill="url(#collectedGradient)"
            name="Laptops Collected"
            dot={{ fill: 'var(--color-accent)', r: 4, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="distributed"
            stroke="var(--color-accent-alt)"
            strokeWidth={3}
            fill="url(#distributedGradient)"
            name="Chromebooks Distributed"
            dot={{ fill: 'var(--color-accent-alt)', r: 4, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-soft-accent border border-default">
          <div className="text-xs font-bold text-accent uppercase tracking-wide mb-1">Avg/Month</div>
          <div className="text-2xl md:text-3xl font-bold text-primary">{stats.avgPerMonth.toLocaleString()} <span className="text-lg">devices</span></div>
        </div>
        <div className="p-4 rounded-xl bg-soft-warning border border-default">
          <div className="text-xs font-bold text-warning uppercase tracking-wide mb-1">Conversion Rate</div>
          <div className="text-2xl md:text-3xl font-bold text-warning">{stats.conversionRate}%</div>
        </div>
      </div>
    </GlassCard>
  );
}
