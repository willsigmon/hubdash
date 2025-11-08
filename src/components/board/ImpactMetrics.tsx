"use client";

import MetricCard from "@/components/ui/MetricCard";
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
            color: "from-hti-ember to-hti-gold",
            description: "Since Sept 9, 2024 (Grant Period)",
            isFeatured: true,
            progress: grantProgress,
          },
          {
            label: "Total Laptops (All-Time)",
            value: data.totalLaptopsCollected || 0,
            suffix: "+",
            icon: "💻",
            color: "from-hti-plum to-hti-fig",
            description: "Overall collection since inception",
          },
          {
            label: "Counties Served",
            value: data.countiesServed || 0,
            suffix: "",
            icon: "📍",
            color: "from-hti-sunset to-hti-ember",
            description: "Through Digital Champion Grant",
          },
          {
            label: "People Trained",
            value: data.peopleTrained || 0,
            suffix: "+",
            icon: "👥",
            color: "from-hti-gold to-hti-soleil",
            description: "Digital literacy participants",
          },
          {
            label: "E-Waste Diverted",
            value: data.eWasteTons || 0,
            suffix: " tons",
            icon: "♻️",
            color: "from-hti-fig to-hti-mist",
            description: "Kept out of landfills",
          },
          {
            label: "Partner Organizations",
            value: data.partnerOrganizations || 0,
            suffix: "",
            icon: "🤝",
            color: "from-hti-ember to-hti-gold",
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
        <div className="space-y-6">
          <MetricCard
            label={featuredMetric.label}
            value={animatedValues[0] ?? 0}
            suffix={featuredMetric.suffix}
            icon={featuredMetric.icon}
            description={featuredMetric.description}
            highlight
            gradientClass={featuredMetric.color}
          />

          {/* Progress bar section */}
          <div className="space-y-3 rounded-2xl p-6 glass border elevation-md">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-hti-plum">Grant Progress</span>
              <span className="text-sm font-bold text-hti-ember">{animatedProgress}%</span>
            </div>
            <div className="w-full h-3 bg-hti-sand/80 rounded-full overflow-hidden shadow-inner border border-hti-gold/30">
              <div
                className={`h-full bg-gradient-to-r ${featuredMetric.color} rounded-full transition-all duration-500 ease-out shadow-md`}
                style={{ width: `${animatedProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-hti-plum font-bold mt-2">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )}

      {/* Regular Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherMetrics.map((metric, index) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={animatedValues[index + 1] ?? 0}
            suffix={metric.suffix}
            icon={metric.icon}
            description={metric.description}
            gradientClass={metric.color}
          />
        ))}
      </div>
    </div>
  );
}
