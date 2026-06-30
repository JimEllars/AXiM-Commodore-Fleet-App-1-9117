import React from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';

export default function FleetStats() {
  const { fleetStats } = useCommodoreStore();

  const metrics = [
    { label: 'ACTIVE ASSETS', value: fleetStats.active_assets, icon: 'Truck', color: 'text-axim-teal' },
    { label: 'FUEL EFFICIENCY', value: fleetStats.fuel_efficiency, icon: 'Droplet', color: 'text-axim-warn' },
    { label: 'SYSTEM UPTIME', value: fleetStats.uptime, icon: 'Shield', color: 'text-axim-success' },
    { label: 'PENDING TASKS', value: fleetStats.pending_tasks, icon: 'Zap', color: 'text-axim-alert' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {metrics.map((m, idx) => (
        <div key={idx} className="bg-axim-panel border border-axim-border p-3 rounded-lg flex items-center gap-4">
          <div className={`p-2 bg-void rounded-lg ${m.color}`}>
            <SafeIcon name={m.icon} className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{m.label}</div>
            <div className="text-lg font-bold text-white font-mono">{m.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}