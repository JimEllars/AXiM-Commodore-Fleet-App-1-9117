import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';

export default function OptimizerImpactView() {
  const { activeOptimization, commitOptimization, discardOptimization } = useCommodoreStore();

  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    grid: { left: '10%', right: '10%', bottom: '15%', top: '10%' },
    xAxis: {
      type: 'category',
      data: ['Current', 'Optimized'],
      axisLabel: { color: '#6b7280', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [
      {
        data: [
          { value: activeOptimization.originalTime, itemStyle: { color: '#1f2937' } },
          { value: activeOptimization.optimizedTime, itemStyle: { color: '#2dd4bf' } }
        ],
        type: 'bar',
        barWidth: '40%',
        label: { show: true, position: 'top', color: '#fff', fontSize: 10, formatter: '{c}m' }
      }
    ]
  };

  return (
    <div className="flex-1 flex flex-col h-full font-mono">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-2 bg-void/50 border border-axim-border rounded">
          <div className="text-[9px] text-gray-500 uppercase mb-1">Time Delta</div>
          <div className="text-lg font-bold text-axim-success">
            -{activeOptimization.originalTime - activeOptimization.optimizedTime}m
          </div>
        </div>
        <div className="p-2 bg-void/50 border border-axim-border rounded">
          <div className="text-[9px] text-gray-500 uppercase mb-1">Fuel Save</div>
          <div className="text-lg font-bold text-axim-teal">
            {(activeOptimization.originalFuel - activeOptimization.optimizedFuel).toFixed(1)}g
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-void/20 rounded border border-axim-border mb-4">
        <ReactECharts option={option} style={{ height: '100%' }} />
      </div>

      <div className="space-y-2 mt-auto">
        <button 
          onClick={commitOptimization}
          className="w-full py-2 bg-axim-teal text-void font-bold rounded text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)]"
        >
          Commit New Sequence
        </button>
        <button 
          onClick={discardOptimization}
          className="w-full py-2 bg-void border border-axim-border text-gray-500 text-[10px] uppercase hover:text-white transition-all"
        >
          Discard Proposal
        </button>
      </div>
    </div>
  );
}