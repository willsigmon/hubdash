"use client";

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { MapPin, Users, Package, TrendingUp } from 'lucide-react';

interface CountyData {
  name: string;
  devicesDistributed: number;
  partners: number;
  peopleServed: number;
  lat: number;
  lng: number;
  status: 'high' | 'moderate' | 'active';
}

interface InteractiveCountyMapProps {
  className?: string;
}

/**
 * Interactive County Map Component
 * Uses D3.js for advanced data visualization with drill-down capabilities
 */
export default function InteractiveCountyMap({ className = '' }: InteractiveCountyMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [selectedCounty, setSelectedCounty] = useState<CountyData | null>(null);
  const [hoveredCounty, setHoveredCounty] = useState<CountyData | null>(null);

  // Mock county data - in real app, this would come from API
  const countyData: CountyData[] = useMemo(() => [
    { name: 'Wake', devicesDistributed: 245, partners: 12, peopleServed: 1800, lat: 35.8, lng: -78.6, status: 'active' },
    { name: 'Mecklenburg', devicesDistributed: 189, partners: 8, peopleServed: 1350, lat: 35.2, lng: -80.8, status: 'active' },
    { name: 'Guilford', devicesDistributed: 156, partners: 6, peopleServed: 1100, lat: 36.1, lng: -79.8, status: 'high' },
    { name: 'Forsyth', devicesDistributed: 134, partners: 5, peopleServed: 950, lat: 36.1, lng: -80.2, status: 'moderate' },
    { name: 'Durham', devicesDistributed: 98, partners: 4, peopleServed: 720, lat: 35.9, lng: -78.9, status: 'high' },
    { name: 'Orange', devicesDistributed: 87, partners: 3, peopleServed: 620, lat: 36.1, lng: -79.1, status: 'moderate' },
    { name: 'Alamance', devicesDistributed: 76, partners: 3, peopleServed: 540, lat: 36.0, lng: -79.4, status: 'active' },
    { name: 'Buncombe', devicesDistributed: 65, partners: 2, peopleServed: 480, lat: 35.6, lng: -82.5, status: 'moderate' },
    { name: 'Catawba', devicesDistributed: 54, partners: 2, peopleServed: 390, lat: 35.7, lng: -81.2, status: 'active' },
    { name: 'Davidson', devicesDistributed: 43, partners: 1, peopleServed: 310, lat: 35.8, lng: -80.2, status: 'moderate' },
  ], []);

  // Calculate dimensions and scales
  const dimensions = useMemo(() => {
    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    return {
      width,
      height,
      margin,
      innerWidth: width - margin.left - margin.right,
      innerHeight: height - margin.top - margin.bottom,
    };
  }, []);

  // Scales for positioning and sizing
  const scales = useMemo(() => {
    const lngExtent = d3.extent(countyData, d => d.lng) as [number, number];
    const latExtent = d3.extent(countyData, d => d.lat) as [number, number];
    const devicesExtent = d3.extent(countyData, d => d.devicesDistributed) as [number, number];

    return {
      x: d3.scaleLinear()
        .domain(lngExtent)
        .range([dimensions.margin.left, dimensions.innerWidth])
        .nice(),
      y: d3.scaleLinear()
        .domain(latExtent)
        .range([dimensions.innerHeight, dimensions.margin.top])
        .nice(),
      radius: d3.scaleSqrt()
        .domain(devicesExtent)
        .range([8, 24]),
      color: d3.scaleOrdinal<string>()
        .domain(['high', 'moderate', 'active'])
        .range(['#e45927', '#fad506', '#008080']),
    };
  }, [countyData, dimensions]);

  // Render the map
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${dimensions.margin.left},${dimensions.margin.top})`);

    // Add background
    g.append('rect')
      .attr('width', dimensions.innerWidth)
      .attr('height', dimensions.innerHeight)
      .attr('fill', '#f8fafc')
      .attr('rx', 8);

    // Add county circles
    const circles = g.selectAll('.county-circle')
      .data(countyData)
      .enter()
      .append('circle')
      .attr('class', 'county-circle')
      .attr('cx', d => scales.x(d.lng))
      .attr('cy', d => scales.y(d.lat))
      .attr('r', d => scales.radius(d.devicesDistributed))
      .attr('fill', d => scales.color(d.status))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('opacity', 0.8)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        setHoveredCounty(d);
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', scales.radius(d.devicesDistributed) * 1.2)
          .attr('stroke-width', 3);
      })
      .on('mouseout', function(event, d) {
        setHoveredCounty(null);
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', scales.radius(d.devicesDistributed))
          .attr('stroke-width', 2);
      })
      .on('click', function(event, d) {
        setSelectedCounty(selectedCounty?.name === d.name ? null : d);
      });

    // Add county labels
    g.selectAll('.county-label')
      .data(countyData)
      .enter()
      .append('text')
      .attr('class', 'county-label')
      .attr('x', d => scales.x(d.lng))
      .attr('y', d => scales.y(d.lat) - scales.radius(d.devicesDistributed) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('fill', '#1e3a5f')
      .text(d => d.name);

    // Add legend
    const legend = g.append('g')
      .attr('transform', `translate(20, ${dimensions.innerHeight - 100})`);

    const legendData = [
      { status: 'active', label: 'Active', color: '#008080' },
      { status: 'high', label: 'High Priority', color: '#e45927' },
      { status: 'moderate', label: 'Moderate', color: '#fad506' },
    ];

    legend.selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`)
      .each(function(d) {
        const item = d3.select(this);

        item.append('circle')
          .attr('r', 6)
          .attr('fill', d.color);

        item.append('text')
          .attr('x', 15)
          .attr('y', 4)
          .attr('font-size', '12px')
          .attr('fill', '#64748b')
          .text(d.label);
      });

  }, [countyData, scales, dimensions, selectedCounty]);

  return (
    <div className={`relative ${className}`}>
      {/* Main Map */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-hti-teal/20">
        <div className="p-4 bg-gradient-to-r from-hti-navy/8 to-hti-teal/8 border-b border-hti-navy/10">
          <h3 className="text-lg font-semibold text-hti-navy flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            North Carolina County Distribution
          </h3>
          <p className="text-sm text-hti-stone mt-1">
            Interactive map showing device distribution across served counties
          </p>
        </div>

        <div className="p-6">
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full h-auto"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCounty && (
        <div
          ref={tooltipRef}
          className="absolute z-10 bg-white rounded-lg shadow-xl border border-hti-teal/20 p-4 pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <h4 className="font-semibold text-hti-navy">{hoveredCounty.name} County</h4>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-hti-teal" />
              <span>{hoveredCounty.devicesDistributed} devices distributed</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-hti-navy" />
              <span>{hoveredCounty.partners} partners</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-hti-yellow" />
              <span>{hoveredCounty.peopleServed} people served</span>
            </div>
          </div>
        </div>
      )}

      {/* Detail Panel */}
      {selectedCounty && (
        <div className="mt-6 bg-white rounded-xl shadow-lg border border-hti-teal/20 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-hti-teal to-hti-teal-light">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {selectedCounty.name} County Details
            </h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-hti-teal/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-8 h-8 text-hti-teal" />
                </div>
                <div className="text-2xl font-bold text-hti-navy">{selectedCounty.devicesDistributed}</div>
                <div className="text-sm text-hti-stone">Devices Distributed</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-hti-navy/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-hti-navy" />
                </div>
                <div className="text-2xl font-bold text-hti-navy">{selectedCounty.partners}</div>
                <div className="text-sm text-hti-stone">Partner Organizations</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-hti-yellow/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-hti-yellow" />
                </div>
                <div className="text-2xl font-bold text-hti-navy">{selectedCounty.peopleServed}</div>
                <div className="text-sm text-hti-stone">People Served</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-hti-teal/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-hti-stone">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedCounty.status === 'active'
                    ? 'bg-hti-teal/10 text-hti-teal'
                    : selectedCounty.status === 'high'
                    ? 'bg-hti-red/10 text-hti-red'
                    : 'bg-hti-yellow/15 text-hti-navy'
                }`}>
                  {selectedCounty.status === 'active' ? 'Active' :
                   selectedCounty.status === 'high' ? 'High Priority' : 'Moderate'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

