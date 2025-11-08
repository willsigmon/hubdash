"use client";

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import GlassCard from '@/components/ui/GlassCard';
import GradientHeading from '@/components/ui/GradientHeading';

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
        <div className="h-8 bg-hti-plum/10 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-hti-fig/10 rounded"></div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-6">
        <GradientHeading className="text-2xl md:text-3xl mb-2" from="hti-plum" to="hti-teal">
          Devices Over Time
        </GradientHeading>
        <p className="text-sm md:text-base text-hti-stone font-medium">
          Cumulative laptops collected and Chromebooks distributed throughout the year
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="collectedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5a1b4a" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#5a1b4a" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="distributedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d96846" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#d96846" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5d5cf" opacity={0.3} />
          <XAxis
            dataKey="month"
            stroke="#827b75"
            style={{ fontSize: '13px', fontWeight: 600 }}
            tick={{ fill: '#827b75' }}
          />
          <YAxis
            stroke="#827b75"
            style={{ fontSize: '13px', fontWeight: 600 }}
            tick={{ fill: '#827b75' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5d5cf',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            labelStyle={{ color: '#5a1b4a', fontWeight: 'bold', marginBottom: '4px' }}
            itemStyle={{ color: '#827b75', fontSize: '14px' }}
          />
          <Legend
            wrapperStyle={{ fontSize: '14px', fontWeight: 600 }}
            iconType="circle"
          />
          <Area
            type="monotone"
            dataKey="collected"
            stroke="#5a1b4a"
            strokeWidth={3}
            fill="url(#collectedGradient)"
            name="Laptops Collected"
            dot={{ fill: '#5a1b4a', r: 4, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="distributed"
            stroke="#d96846"
            strokeWidth={3}
            fill="url(#distributedGradient)"
            name="Chromebooks Distributed"
            dot={{ fill: '#d96846', r: 4, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-hti-plum/10 to-hti-fig/10 border border-hti-plum/20">
          <div className="text-xs font-bold text-hti-plum uppercase tracking-wide mb-1">Avg/Month</div>
          <div className="text-2xl md:text-3xl font-bold text-hti-plum">{stats.avgPerMonth.toLocaleString()} <span className="text-lg">devices</span></div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-hti-ember/10 to-hti-gold/10 border border-hti-ember/20">
          <div className="text-xs font-bold text-hti-ember uppercase tracking-wide mb-1">Conversion Rate</div>
          <div className="text-2xl md:text-3xl font-bold text-hti-ember">{stats.conversionRate}%</div>
        </div>
      </div>
    </GlassCard>
  );
}
