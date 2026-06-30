import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import { motion, AnimatePresence } from 'framer-motion';

export default function DriverComparison() {
  const { drivers } = useCommodoreStore();
  const [selectedIds, setSelectedIds] = useState(drivers.slice(0, 2).map(d => d.id));

  const selectedDrivers = useMemo(() => 
    drivers.filter(d => selectedIds.includes(d.id)),
    [drivers, selectedIds]
  );

  const toggleDriver = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      if (selectedIds.length < 4) setSelectedIds([...selectedIds, id]);
    }
  };

  const colors = ['#2dd4bf', '#f43f5e', '#fbbf24', '#8b5cf6'];

  const radarOption = {
    backgroundColor: 'transparent',
    legend: {
      data: selectedDrivers.map(d => d.name),
      bottom: 0,
      textStyle: { color: '#9ca3af', fontSize: 10, fontFamily: 'ui-monospace' },
      itemWidth: 10,
      itemHeight: 10
    },
    radar: {
      indicator: [
        { name: 'Safety', max: 100 },
        { name: 'Efficiency', max: 100 },
        { name: 'On-Time', max: 100 },
        { name: 'Hours', max: 2500 },
        { name: 'Miles (x100)', max: 1000 }
      ],
      shape: 'circle',
      splitNumber: 5,
      axisName: { color: '#6b7280', fontSize: 9 },
      splitLine: { lineStyle: { color: 'rgba(31, 41, 55, 0.5)' } },
      splitArea: { show: false }
    },
    series: [{
      type: 'radar',
      data: selectedDrivers.map((d, i) => ({
        value: [
          parseInt(d.safety_score),
          parseInt(d.efficiency_rating),
          parseFloat(d.on_time_perc),
          parseInt(d.total_hours.replace(',', '')),
          parseInt(d.total_miles.replace(',', '')) / 100
        ],
        name: d.name,
        itemStyle: { color: colors[i] },
        areaStyle: { opacity: 0.1 }
      })),
      symbol: 'circle',
      symbolSize: 4
    }]
  };

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden font-mono">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-teal text-xs uppercase tracking-widest">
          <SafeIcon name="Users" className="w-4 h-4" />
          <span>Operator Benchmarking</span>
        </div>
        <div className="text-[9px] text-gray-500 uppercase">Select up to 4 drivers</div>
      </div>

      <div className="p-3 border-b border-axim-border flex gap-2 overflow-x-auto no-scrollbar">
        {drivers.map((d) => {
          const isSelected = selectedIds.includes(d.id);
          const colorIdx = selectedIds.indexOf(d.id);
          return (
            <button
              key={d.id}
              onClick={() => toggleDriver(d.id)}
              className={`px-3 py-1.5 rounded border text-[10px] whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected 
                  ? 'bg-void border-axim-teal text-white' 
                  : 'bg-void/30 border-axim-border text-gray-500 hover:border-gray-600'
              }`}
            >
              {isSelected && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[colorIdx] }} />}
              {d.name}
            </button>
          );
        })}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex-1 min-h-[300px]">
            <ReactECharts option={radarOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-axim-border p-4 bg-void/20">
          <h4 className="text-[10px] text-gray-500 uppercase mb-4 tracking-widest">Comparative Matrix</h4>
          <div className="space-y-4">
            {selectedDrivers.map((d, i) => (
              <div key={d.id} className="p-3 bg-void/50 border border-axim-border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-white">{d.name}</span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i] }} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[8px] text-gray-500 uppercase">Safety</div>
                    <div className="text-xs font-bold text-axim-success">{d.safety_score}%</div>
                  </div>
                  <div>
                    <div className="text-[8px] text-gray-500 uppercase">Efficiency</div>
                    <div className="text-xs font-bold text-axim-teal">{d.efficiency_rating}%</div>
                  </div>
                  <div>
                    <div className="text-[8px] text-gray-500 uppercase">On-Time</div>
                    <div className="text-xs font-bold text-axim-warn">{d.on_time_perc}%</div>
                  </div>
                  <div>
                    <div className="text-[8px] text-gray-500 uppercase">Weight</div>
                    <div className="text-xs font-bold text-white">
                      {Math.round((parseInt(d.safety_score)*0.4 + parseInt(d.efficiency_rating)*0.3 + parseFloat(d.on_time_perc)*0.3))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}