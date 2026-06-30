import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';

export default function FinOpsDashboard() {
  const { fleetCosts } = useCommodoreStore();

  const categories = ['FUEL', 'MAINTENANCE', 'TOLL', 'LABOR'];
  const data = categories.map(cat => ({
    name: cat,
    value: fleetCosts
      .filter(c => c.category === cat)
      .reduce((acc, curr) => acc + parseFloat(curr.amount), 0)
  }));

  const chartOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#111827', borderWidth: 2 },
      label: { show: true, color: '#9ca3af', fontSize: 10, fontFamily: 'ui-monospace' },
      data: data.map((d, i) => ({
        ...d,
        itemStyle: { color: ['#2dd4bf', '#f43f5e', '#fbbf24', '#10b981'][i] }
      }))
    }]
  };

  return (
    <div className="bg-axim-panel border border-axim-border rounded-lg p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-axim-teal font-mono text-xs uppercase tracking-widest">
          <SafeIcon name="DollarSign" className="w-4 h-4" />
          <span>Fleet Burn Rate Analysis</span>
        </div>
        <div className="text-[10px] font-mono text-gray-500">PERIOD: Q2 2024</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-void/50 border border-axim-border rounded">
          <div className="text-[9px] text-gray-500 font-mono mb-1 uppercase">Total Expenditure</div>
          <div className="text-xl font-bold text-white font-mono">
            ${data.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
          </div>
        </div>
        <div className="p-3 bg-void/50 border border-axim-border rounded">
          <div className="text-[9px] text-gray-500 font-mono mb-1 uppercase">Avg. Cost / Mile</div>
          <div className="text-xl font-bold text-axim-teal font-mono">$1.42</div>
        </div>
      </div>

      <div className="flex-1 min-h-[250px]">
        <ReactECharts option={chartOption} style={{ height: '100%' }} />
      </div>

      <div className="mt-4 pt-4 border-t border-axim-border">
        <div className="space-y-2">
          {data.map((d, i) => (
            <div key={i} className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-gray-500 uppercase">{d.name}</span>
              <span className="text-white font-bold">${d.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}