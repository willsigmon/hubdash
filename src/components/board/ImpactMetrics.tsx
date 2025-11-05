"use client";

import { useEffect, useState } from "react";

interface Metric {
  label: string;
  value: number;
  suffix: string;
  icon: string;
  color: string;
  description: string;
}

export default function ImpactMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [animatedValues, setAnimatedValues] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch metrics from API
    fetch('/api/metrics')
      .then(res => res.json())
      .then(data => {
        const metricsData: Metric[] = [
          {
            label: "Laptops Collected",
            value: data.laptopsCollected || 0,
            suffix: "+",
            icon: "💻",
            color: "from-hti-navy to-hti-teal",
            description: "Total devices donated to HTI",
          },
          {
            label: "Chromebooks Distributed",
            value: data.chromebooksDistributed || 0,
            suffix: "+",
            icon: "🎯",
            color: "from-hti-teal to-hti-teal-light",
            description: "Refurbished devices delivered",
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
  }, [metrics]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-xl bg-gray-200 animate-pulse h-40" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={metric.label}
          className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-5 group-hover:opacity-10 transition-opacity`} />

          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{metric.icon}</div>
              <div className={`px-3 py-1 rounded-full bg-gradient-to-br ${metric.color} text-white text-xs font-medium`}>
                Live
              </div>
            </div>

            <div className="mb-2">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {animatedValues[index]?.toLocaleString() || 0}
                <span className="text-2xl">{metric.suffix}</span>
              </div>
              <div className="text-sm font-medium text-gray-700">
                {metric.label}
              </div>
            </div>

            <div className="text-xs text-gray-500">
              {metric.description}
            </div>
          </div>

          {/* Bottom accent line */}
          <div className={`h-1 bg-gradient-to-r ${metric.color}`} />
        </div>
      ))}
    </div>
  );
}
