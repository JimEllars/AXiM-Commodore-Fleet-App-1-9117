import React from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';

export default function ControlCenter() {
  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden font-mono">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-warn text-xs uppercase tracking-widest">
          <SafeIcon name="Sliders" className="w-4 h-4" />
          <span>System Parameters</span>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-5">
        {[
          { label: 'Auto-Reroute Fuel %', val: '15%', color: 'bg-axim-warn' },
          { label: 'Max Stress (GSR)', val: '80%', color: 'bg-axim-alert' },
          { label: 'SLA Buffer (Mins)', val: '20m', color: 'bg-axim-teal' },
          { label: 'Onyx Solver Depth', val: '64', color: 'bg-axim-success' }
        ].map((p, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between text-[9px] uppercase">
              <span className="text-gray-500">{p.label}</span>
              <span className="text-white font-bold">{p.val}</span>
            </div>
            <div className="h-1 w-full bg-void rounded-full overflow-hidden">
              <div className={`h-full ${p.color}`} style={{ width: '60%' }} />
            </div>
          </div>
        ))}
        <button className="w-full py-2 mt-4 bg-void border border-axim-border text-axim-teal text-[10px] font-bold rounded hover:border-axim-teal transition-all uppercase">
          Commit Config Swarm
        </button>
      </div>
    </div>
  );
}