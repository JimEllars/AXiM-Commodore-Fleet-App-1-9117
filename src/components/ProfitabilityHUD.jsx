import React from 'react';
import useSWR from 'swr';
import ReactECharts from 'echarts-for-react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';

const fetcher = url => fetch(url, { headers: { 'Cache-Control': 'max-age=60, stale-while-revalidate=120' } }).then(res => res.json());
export default function ProfitabilityHUD() {
  const { activeVehicles, fleetCosts, currentUser } = useCommodoreStore();
  const { data: finOpsData } = useSWR('/api/finops/burn-rate', fetcher, { fallbackData: { avgMargin: '24.2%', dailyBurn: '$4,120' } });
  
  const profitData = Object.values(activeVehicles).map(v => {
    const costs = fleetCosts
      .filter(c => c.vehicle_id === v.id)
      .reduce((sum, c) => sum + parseFloat(c.amount), 0);
    
    // Simulated revenue based on load and miles
    const revenue = (parseInt(v.load) / 100) * 5000 + 1200; 
    return {
      name: v.name,
      profit: revenue - costs,
      margin: ((revenue - costs) / revenue) * 100
    };
  });

  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, confine: true },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: { color: '#6b7280', fontSize: 9 },
      splitLine: { lineStyle: { color: '#1f2937' } }
    },
    yAxis: {
      type: 'category',
      data: profitData.map(d => d.name),
      axisLabel: { color: '#9ca3af', fontSize: 10 }
    },
    series: [
      {
        name: 'Net Profit ($)',
        type: 'bar',
        data: profitData.map(d => d.profit),
        itemStyle: {
          color: (params) => params.value > 0 ? '#10b981' : '#f43f5e',
          borderRadius: [0, 4, 4, 0]
        }
      }
    ]
  };

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden font-mono">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-success text-xs uppercase tracking-widest">
          <SafeIcon name="TrendingUp" className="w-4 h-4" />
          <span>Profitability Topology</span>
        </div>
        {currentUser?.role !== 'COMMANDER' && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 text-[9px]">
            <SafeIcon name="Lock" className="w-3 h-3" />
            <span>READ ONLY</span>
          </div>
        )}
      </div>
      <div className="flex-1 p-4 min-h-[300px]">
        <ReactECharts option={option} style={{ height: '100%' }} />
      </div>
      <div className="p-3 bg-void/50 border-t border-axim-border grid grid-cols-2 gap-2">
        <div className="text-center p-2 border border-axim-border rounded">
          <div className="text-[8px] text-gray-500 uppercase">Fleet Avg Margin</div>
          <div className="text-sm font-bold text-axim-teal">{finOpsData.avgMargin}</div>
        </div>
        <div className="text-center p-2 border border-axim-border rounded">
          <div className="text-[8px] text-gray-500 uppercase">Daily Burn</div>
          <div className="text-sm font-bold text-axim-alert">{finOpsData.dailyBurn}</div>
        </div>
      </div>
    </div>
  );
}