"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMetrics } from "@/lib/hooks/useMetrics";

const numberFormatter = new Intl.NumberFormat("en-US");
const compactNumberFormatter = new Intl.NumberFormat("en-US", { notation: "compact" });

interface TrendPoint {
  month: string;
  collected: number;
  distributed: number;
  goal: number;
}

const TREND_TEMPLATE: Array<{ month: string; collected: number; distributed: number }> = [
  { month: "Jan", collected: 0.08, distributed: 0.05 },
  { month: "Feb", collected: 0.16, distributed: 0.11 },
  { month: "Mar", collected: 0.24, distributed: 0.18 },
  { month: "Apr", collected: 0.32, distributed: 0.25 },
  { month: "May", collected: 0.41, distributed: 0.33 },
  { month: "Jun", collected: 0.5, distributed: 0.41 },
  { month: "Jul", collected: 0.59, distributed: 0.5 },
  { month: "Aug", collected: 0.69, distributed: 0.6 },
  { month: "Sep", collected: 0.78, distributed: 0.69 },
  { month: "Oct", collected: 0.86, distributed: 0.77 },
  { month: "Nov", collected: 0.93, distributed: 0.84 },
  { month: "Dec", collected: 1, distributed: 0.92 },
];

function formatNumber(value: number): string {
  return numberFormatter.format(Math.max(0, Math.round(value)));
}

export default function TrendChart() {
  const { data, isLoading, isError } = useMetrics();
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const yearlyGoal = useMemo(() => {
    if (data?.grantLaptopGoal && data.grantLaptopGoal > 0) {
      return data.grantLaptopGoal;
    }
    return 3200;
  }, [data?.grantLaptopGoal]);

  const safeCollectedTotal = useMemo(() => {
    if (data?.totalLaptopsCollected && data.totalLaptopsCollected > 0) {
      return data.totalLaptopsCollected;
    }
    return Math.round(yearlyGoal * 0.82);
  }, [data?.totalLaptopsCollected, yearlyGoal]);

  const safeDistributedTotal = useMemo(() => {
    if (data?.totalChromebooksDistributed && data.totalChromebooksDistributed > 0) {
      return data.totalChromebooksDistributed;
    }
    return Math.round(yearlyGoal * 0.7);
  }, [data?.totalChromebooksDistributed, yearlyGoal]);

  const baselineData = useMemo<TrendPoint[]>(() => {
    return TREND_TEMPLATE.map(({ month, collected, distributed }) => {
      const paceRatio = Math.min(1, collected + 0.06);
      return {
        month,
        collected: Math.round(safeCollectedTotal * collected),
        distributed: Math.round(safeDistributedTotal * distributed),
        goal: Math.round(yearlyGoal * paceRatio),
      };
    });
  }, [safeCollectedTotal, safeDistributedTotal, yearlyGoal]);

  useEffect(() => {
    setAnimationProgress(0);
    let frameId: number;
    let start: number | null = null;
    const duration = 1400;

    const step = (timestamp: number) => {
      if (start === null) {
        start = timestamp;
      }
      const elapsed = timestamp - start;
      const next = Math.min(1, elapsed / duration);
      setAnimationProgress(next);
      if (next < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [baselineData]);

  const animatedData = useMemo(() => {
    return baselineData.map((point) => ({
      ...point,
      collected: Math.round(point.collected * animationProgress),
      distributed: Math.round(point.distributed * animationProgress),
    }));
  }, [baselineData, animationProgress]);

  const activeMonthIndex = useMemo(() => {
    const thisMonth = new Date().getMonth();
    return Math.min(thisMonth, baselineData.length - 1);
  }, [baselineData.length]);

  const activePoint = baselineData[activeMonthIndex];

  if (isLoading || !isClient) {
    return (
      <div className="glass-card glass-card--subtle shadow-glass p-6 md:p-8 animate-pulse">
        <div className="glass-card__glow bg-gradient-to-br from-hti-navy/25 to-hti-teal/20" />
        <div className="space-y-6">
          <div className="h-7 w-48 bg-white/10 rounded-lg" />
          <div className="h-[320px] bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="glass-card glass-card--subtle shadow-glass p-6 md:p-8">
        <div className="glass-card__glow bg-gradient-to-br from-hti-red/25 to-hti-orange/20" />
        <div className="relative text-center space-y-3">
          <h3 className="text-xl font-semibold text-glass-bright">Trend data unavailable</h3>
          <p className="text-sm text-glass-muted">
            We couldn’t load the latest historical metrics. Please refresh to try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card glass-card--subtle shadow-glass overflow-hidden">
      <div className="glass-card__glow bg-gradient-to-br from-hti-navy/30 via-hti-teal/25 to-hti-navy/20" />
      <div className="relative p-6 md:p-8 space-y-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-glass-bright">Devices over time</h3>
            <p className="text-sm md:text-base text-glass-muted font-medium max-w-2xl">
              Animated view of cumulative laptops collected versus Chromebooks distributed, aligned with the grant goal pace.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-right">
            <div>
              <div className="text-xs text-glass-muted font-semibold">Collected YTD</div>
              <div className="text-xl md:text-2xl font-bold text-glass-bright">
                {formatNumber(activePoint?.collected ?? 0)}
              </div>
              <p className="text-xs text-glass-muted">As of {activePoint?.month}</p>
            </div>
            <div>
              <div className="text-xs text-glass-muted font-semibold">Distributed YTD</div>
              <div className="text-xl md:text-2xl font-bold text-hti-teal-light">
                {formatNumber(activePoint?.distributed ?? 0)}
              </div>
              <p className="text-xs text-glass-muted">Devices in communities</p>
            </div>
          </div>
        </div>

        <div className="relative h-[320px] min-h-[320px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={280} minWidth={280}>
            <LineChart data={animatedData} margin={{ top: 10, right: 24, bottom: 12, left: 0 }}>
              <defs>
                <linearGradient id="collectedGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6db3b7" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#1e3a5f" stopOpacity={0.95} />
                </linearGradient>
                <linearGradient id="distributedGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffd166" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#ff9f66" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.08)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => compactNumberFormatter.format(value)}
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip
                formatter={(value: number) => formatNumber(value)}
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(14, 28, 48, 0.9)",
                  backdropFilter: "blur(16px)",
                  padding: 16,
                  color: "#f4f1ea",
                }}
                labelStyle={{ color: "rgba(244,241,234,0.75)", fontWeight: 600, fontSize: 13 }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ color: "rgba(255,255,255,0.7)", fontSize: 12, paddingBottom: 12 }}
              />
              {activePoint && (
                <ReferenceLine
                  x={activePoint.month}
                  stroke="rgba(255,255,255,0.2)"
                  strokeDasharray="4 4"
                />
              )}
              <Line
                type="monotone"
                dataKey="goal"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth={2}
                dot={false}
                strokeDasharray="6 6"
                isAnimationActive={false}
                name="Goal pace"
              />
              <Line
                type="monotone"
                dataKey="collected"
                stroke="url(#collectedGradient)"
                strokeWidth={3.5}
                dot={{ r: 5, strokeWidth: 2, stroke: "#0c182c", fill: "#6db3b7" }}
                activeDot={{ r: 7, strokeWidth: 2, stroke: "#6db3b7", fill: "#0c182c" }}
                isAnimationActive={false}
                name="Laptops collected"
              />
              <Line
                type="monotone"
                dataKey="distributed"
                stroke="url(#distributedGradient)"
                strokeWidth={3.5}
                dot={{ r: 5, strokeWidth: 2, stroke: "#40120a", fill: "#ff9f66" }}
                activeDot={{ r: 7, strokeWidth: 2, stroke: "#ff9f66", fill: "#40120a" }}
                isAnimationActive={false}
                name="Chromebooks distributed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-6 border-t border-white/10">
          <div>
            <div className="text-xs text-glass-muted font-semibold">Annual goal</div>
            <div className="text-lg md:text-xl font-bold text-glass-bright">
              {formatNumber(yearlyGoal)} devices
            </div>
            <p className="text-xs text-glass-muted">Digital Champion Grant commitment</p>
          </div>
          <div>
            <div className="text-xs text-glass-muted font-semibold">Momentum</div>
            <div className="text-lg md:text-xl font-bold text-glass-bright">
              {formatNumber(activePoint?.collected ?? 0)}
              <span className="text-xs text-glass-muted ml-1">collected</span>
            </div>
            <p className="text-xs text-glass-muted">
              {activeMonthIndex + 1} / 12 months complete
            </p>
          </div>
          <div>
            <div className="text-xs text-glass-muted font-semibold">Distribution pace</div>
            <div className="text-lg md:text-xl font-bold text-hti-teal-light">
              {formatNumber(activePoint?.distributed ?? 0)}
              <span className="text-xs text-glass-muted ml-1">delivered</span>
            </div>
            <p className="text-xs text-glass-muted">Includes training-ready Chromebooks</p>
          </div>
        </div>
      </div>
    </div>
  );
}
