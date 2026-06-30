import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import FinOpsDashboard from './FinOpsDashboard';
import OptimizationHistory from './OptimizationHistory';
import DriverPerformance from './DriverPerformance';
import DriverComparison from './DriverComparison';

export default function FleetAnalytics() {
  const { activeVehicles } = useCommodoreStore();
  const [viewMode, setViewMode] = useState('benchmarking'); // 'benchmarking' or 'individual'
  
  const vehicles = Object.values(activeVehicles);

  const fuelOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: vehicles.map(v => v.name),
      axisLabel: { color: '#6b7280', fontSize: 10, fontFamily: 'ui-monospace' },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#6b7280', fontSize: 10, fontFamily: 'ui-monospace' },
      splitLine: { lineStyle: { color: '#1f2937' } }
    },
    series: [
      {
        name: 'Fuel Level %',
        type: 'bar',
        data: vehicles.map(v => v.fuel),
        itemStyle: { color: '#2dd4bf', borderRadius: [4, 4, 0, 0] }
      }
    ]
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto pr-2">
      {/* Driver Performance Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-[500px]">
        <div className="lg:col-span-3 flex flex-col gap-3">
          <div className="flex bg-void/50 border border-axim-border p-1 rounded-lg self-start">
            <button 
              onClick={() => setViewMode('benchmarking')}
              className={`px-4 py-1.5 rounded-md text-[10px] font-mono transition-all ${viewMode === 'benchmarking' ? 'bg-axim-teal text-void font-bold' : 'text-gray-500 hover:text-white'}`}
            >
              BENCHMARKING
            </button>
            <button 
              onClick={() => setViewMode('individual')}
              className={`px-4 py-1.5 rounded-md text-[10px] font-mono transition-all ${viewMode === 'individual' ? 'bg-axim-teal text-void font-bold' : 'text-gray-500 hover:text-white'}`}
            >
              INDIVIDUAL PROFILES
            </button>
          </div>
          
          <div className="flex-1 min-h-0">
            {viewMode === 'benchmarking' ? <DriverComparison /> : <DriverPerformance />}
          </div>
        </div>
        <FinOpsDashboard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[400px]">
        <div className="bg-axim-panel border border-axim-border rounded-lg p-4 flex flex-col">
          <div className="flex items-center gap-2 text-axim-teal font-mono text-xs mb-6 uppercase tracking-widest">
            <SafeIcon name="BarChart" className="w-4 h-4" />
            <span>Fleet Fuel Consumption Topology</span>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ReactECharts option={fuelOption} style={{ height: '100%' }} />
          </div>
        </div>
        <OptimizationHistory />
      </div>

      <div className="bg-axim-panel border border-axim-border rounded-lg p-6 mb-4">
        <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
          <SafeIcon name="Activity" className="w-4 h-4 text-axim-teal" />
          SYSTEM THROUGHPUT METRICS
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'AVG DWELL TIME', val: '12.4m', delta: '-2.1%' },
            { label: 'ROUTE EFFICIENCY', val: '94.2%', delta: '+0.8%' },
            { label: 'SLA COMPLIANCE', val: '98.9%', delta: '+0.1%' },
            { label: 'TELEMETRY PPS', val: '1,442', delta: '+124' },
          ].map((m, i) => (
            <div key={i} className="border-l border-axim-border pl-4">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">{m.label}</div>
              <div className="text-xl font-bold text-white font-mono mt-1">{m.val}</div>
              <div className={`text-[10px] font-mono mt-1 ${m.delta.startsWith('+') ? 'text-axim-success' : 'text-axim-alert'}`}>
                {m.delta} FROM PREV. CYCLE
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}