"use client";

import { useEffect, useState } from "react";

interface Metric {
  label: string;
  value: number;
  suffix: string;
  icon: string;
  color: string;
  description: string;
  isFeatured?: boolean;
  progress?: number;
}

export default function ImpactMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [animatedValues, setAnimatedValues] = useState<number[]>([]);
  const [animatedProgress, setAnimatedProgress] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch metrics from API
    fetch('/api/metrics')
      .then(res => res.json())
      .then(data => {
        const grantProgress = Math.round(
          ((data.grantLaptopsPresented || 0) / Math.max(data.grantLaptopGoal || 1500, 1)) * 100
        );

        const metricsData: Metric[] = [
          {
            label: "Grant Laptops Presented",
            value: data.grantLaptopsPresented || 0,
            suffix: ` / 1,500`,
            icon: "🎯",
            color: "from-hti-red to-orange-500",
            description: "Since Sept 9, 2024 (Grant Period)",
            isFeatured: true,
            progress: grantProgress,
          },
          {
            label: "Total Laptops (All-Time)",
            value: data.totalLaptopsCollected || 0,
            suffix: "+",
            icon: "💻",
            color: "from-gray-600 to-gray-400",
            description: "Overall collection since inception",
          },
          {
            label: "Counties Served",
            value: data.countiesServed || 0,
            suffix: "",
            icon: "📍",
            color: "from-hti-red to-orange-400",
            description: "Through Digital Champion Grant",
          },
          {
            label: "People Trained",
            value: data.peopleTrained || 0,
            suffix: "+",
            icon: "👥",
            color: "from-hti-yellow to-yellow-300",
            description: "Digital literacy participants",
          },
          {
            label: "E-Waste Diverted",
            value: data.eWasteTons || 0,
            suffix: " tons",
            icon: "♻️",
            color: "from-green-600 to-green-400",
            description: "Kept out of landfills",
          },
          {
            label: "Partner Organizations",
            value: data.partnerOrganizations || 0,
            suffix: "",
            icon: "🤝",
            color: "from-purple-600 to-purple-400",
            description: "Community collaborations",
          },
        ];

        setMetrics(metricsData);
        setAnimatedValues(metricsData.map(() => 0));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching metrics:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (metrics.length === 0) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    metrics.forEach((metric, index) => {
      let currentStep = 0;
      const increment = metric.value / steps;

      const timer = setInterval(() => {
        currentStep++;
        setAnimatedValues((prev) => {
          const newValues = [...prev];
          newValues[index] = Math.min(
            Math.floor(increment * currentStep),
            metric.value
          );
          return newValues;
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, interval);
    });

    // Animate grant progress bar
    const grantMetric = metrics[0];
    if (grantMetric.progress !== undefined) {
      let currentStep = 0;
      const increment = grantMetric.progress / steps;

      const progressTimer = setInterval(() => {
        currentStep++;
        setAnimatedProgress(
          Math.min(Math.floor(increment * currentStep), grantMetric.progress || 0)
        );

        if (currentStep >= steps) {
          clearInterval(progressTimer);
        }
      }, interval);
    }
  }, [metrics]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Featured card skeleton */}
        <div className="h-64 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse" />
        {/* Regular cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-xl bg-gray-200 animate-pulse h-44" />
          ))}
        </div>
      </div>
    );
  }

  // Separate featured metric from others
  const featuredMetric = metrics[0];
  const otherMetrics = metrics.slice(1);

  return (
    <div className="space-y-8">
      {/* Featured Grant Metrics Card */}
      {featuredMetric && (
        <div
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-100"
        >
          {/* Animated background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${featuredMetric.color} opacity-3 group-hover:opacity-5 transition-opacity duration-300`} />

          {/* Top accent bar */}
          <div className={`h-2 bg-gradient-to-r ${featuredMetric.color}`} />

          <div className="relative p-8 md:p-10">
            {/* Header with icon and badge */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{featuredMetric.icon}</div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-hti-navy">
                    {featuredMetric.label}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {featuredMetric.description}
                  </p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full bg-gradient-to-br ${featuredMetric.color} text-white text-sm font-semibold shadow-lg`}>
                {animatedProgress}% Complete
              </div>
            </div>

            {/* Main metrics display */}
            <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-5xl md:text-6xl font-bold text-hti-navy">
                  {animatedValues[0]?.toLocaleString() || 0}
                </div>
                <span className="text-2xl font-semibold text-gray-600">
                  {featuredMetric.suffix}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Goal: 1,500 laptops by end of grant period
              </p>
            </div>

            {/* Progress bar section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Grant Progress</span>
                <span className="text-sm font-bold text-hti-navy">
                  {animatedProgress}%
                </span>
              </div>

              {/* Animated progress bar */}
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full bg-gradient-to-r ${featuredMetric.color} rounded-full transition-all duration-500 ease-out shadow-md`}
                  style={{ width: `${animatedProgress}%` }}
                />
              </div>

              {/* Progress milestones */}
              <div className="flex justify-between text-xs text-gray-700 font-semibold mt-4 pt-2">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Bottom decoration */}
          <div className={`h-1 bg-gradient-to-r ${featuredMetric.color}`} />
        </div>
      )}

      {/* Regular Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherMetrics.map((metric, index) => (
          <div
            key={metric.label}
            className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100"
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-3 group-hover:opacity-5 transition-opacity`} />

            <div className="relative p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="text-5xl">{metric.icon}</div>
                <div className={`px-2 py-1 rounded-full bg-gradient-to-br ${metric.color} text-white text-xs font-medium shadow-sm`}>
                  Live
                </div>
              </div>

              {/* Value section */}
              <div>
                <div className="text-4xl font-bold text-hti-navy mb-1">
                  {animatedValues[index + 1]?.toLocaleString() || 0}
                  <span className="text-2xl font-semibold text-gray-600">
                    {metric.suffix}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-gray-700">
                  {metric.label}
                </h4>
              </div>

              {/* Description */}
              <div className="text-xs text-gray-500 leading-relaxed">
                {metric.description}
              </div>
            </div>

            {/* Bottom accent line */}
            <div className={`h-1 bg-gradient-to-r ${metric.color}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
