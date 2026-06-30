import React from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import { motion } from 'framer-motion';

export default function OptimizationHistory() {
  const { optimizationHistory } = useCommodoreStore();

  const sortedHistory = [...optimizationHistory].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden font-mono">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-teal text-xs uppercase tracking-widest">
          <SafeIcon name="Cpu" className="w-4 h-4" />
          <span>Optimization Audit Ledger</span>
        </div>
        <div className="text-[10px] text-gray-500">History v1.0</div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-axim-panel z-10 border-b border-axim-border">
            <tr>
              <th className="p-3 text-[9px] text-gray-500 uppercase">Timestamp</th>
              <th className="p-3 text-[9px] text-gray-500 uppercase">Asset</th>
              <th className="p-3 text-[9px] text-gray-500 uppercase text-right">Time Saved</th>
              <th className="p-3 text-[9px] text-gray-500 uppercase text-right">Gain</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-axim-border/30">
            {sortedHistory.map((log, idx) => (
              <motion.tr 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                key={log.id} 
                className="hover:bg-axim-teal/5 transition-colors group"
              >
                <td className="p-3">
                  <div className="text-[10px] text-gray-400">
                    {new Date(log.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-[9px] text-gray-600">
                    {new Date(log.created_at).toLocaleTimeString()}
                  </div>
                </td>
                <td className="p-3">
                  <span className="text-xs text-white font-bold">{log.vehicle_id}</span>
                </td>
                <td className="p-3 text-right">
                  <span className="text-xs text-axim-success">-{log.time_saved_mins}m</span>
                </td>
                <td className="p-3 text-right">
                  <span className="text-[10px] bg-axim-teal/10 text-axim-teal px-1.5 py-0.5 rounded border border-axim-teal/20 font-bold">
                    {log.efficiency_gain}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}