import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import { motion } from 'framer-motion';

export default function DriverPerformance() {
  const { drivers } = useCommodoreStore();

  const getRadarOption = (driver) => ({
    backgroundColor: 'transparent',
    radar: {
      indicator: [
        { name: 'Safety', max: 100 },
        { name: 'Efficiency', max: 100 },
        { name: 'On-Time', max: 100 },
        { name: 'Reliability', max: 100 },
        { name: 'Speed Control', max: 100 }
      ],
      shape: 'circle',
      splitNumber: 4,
      axisName: { color: '#6b7280', fontSize: 8 },
      splitLine: { lineStyle: { color: '#1f2937' } },
      splitArea: { show: false }
    },
    series: [{
      type: 'radar',
      lineStyle: { width: 1, color: '#2dd4bf' },
      data: [[
        parseInt(driver.safety_score),
        parseInt(driver.efficiency_rating),
        parseFloat(driver.on_time_perc),
        92, // Static Reliability for simulation
        88  // Static Speed Control for simulation
      ]],
      symbol: 'none',
      itemStyle: { color: '#2dd4bf' },
      areaStyle: { opacity: 0.1 }
    }]
  });

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden font-mono">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-teal text-sm">
          <SafeIcon name="TrendingUp" className="w-4 h-4" />
          <span>OPERATOR PERFORMANCE ANALYTICS</span>
        </div>
        <div className="text-[10px] text-gray-500 uppercase">Snapshot: Last 30 Days</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {drivers.map((driver, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={driver.id} 
            className="p-4 bg-void/30 border border-axim-border rounded-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-axim-teal/10 border border-axim-teal/30 flex items-center justify-center text-axim-teal">
                  <span className="text-sm font-bold">{driver.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{driver.name}</h4>
                  <p className="text-[10px] text-gray-500 uppercase">Assigned: {driver.assigned_vehicle}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xl font-bold ${parseInt(driver.safety_score) > 90 ? 'text-axim-success' : 'text-axim-warn'}`}>
                  {driver.safety_score}
                </div>
                <div className="text-[9px] text-gray-500 uppercase">Safety Grade</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="h-32">
                <ReactECharts option={getRadarOption(driver)} style={{ height: '100%', width: '100%' }} />
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Efficiency', val: `${driver.efficiency_rating}%`, color: 'bg-axim-teal' },
                  { label: 'On-Time', val: `${driver.on_time_perc}%`, color: 'bg-axim-success' },
                  { label: 'Total Miles', val: driver.total_miles, color: 'bg-gray-600' }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-gray-500 uppercase">{stat.label}</span>
                      <span className="text-white font-bold">{stat.val}</span>
                    </div>
                    <div className="h-1 w-full bg-void rounded-full overflow-hidden">
                      <div className={`h-full ${stat.color}`} style={{ width: stat.val.includes('%') ? stat.val : '75%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}