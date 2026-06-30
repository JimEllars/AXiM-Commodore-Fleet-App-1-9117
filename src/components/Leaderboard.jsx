import React from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import { motion } from 'framer-motion';

export default function Leaderboard() {
  const { drivers } = useCommodoreStore();
  
  const sortedDrivers = [...drivers].sort((a, b) => {
    const scoreA = (parseInt(a.safety_score) + parseInt(a.efficiency_rating) + parseFloat(a.on_time_perc)) / 3;
    const scoreB = (parseInt(b.safety_score) + parseInt(b.efficiency_rating) + parseFloat(b.on_time_perc)) / 3;
    return scoreB - scoreA;
  });

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden font-mono">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-success text-xs uppercase tracking-widest">
          <SafeIcon name="Award" className="w-4 h-4" />
          <span>Operator Efficiency Standings</span>
        </div>
        <div className="text-[9px] text-gray-500 uppercase">Cycle: May 2024</div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-axim-panel z-10 border-b border-axim-border">
            <tr>
              <th className="p-3 text-[9px] text-gray-500 uppercase">Rank</th>
              <th className="p-3 text-[9px] text-gray-500 uppercase">Operator</th>
              <th className="p-3 text-[9px] text-gray-500 uppercase text-right">Aggregate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-axim-border/30">
            {sortedDrivers.map((driver, idx) => {
              const score = Math.round((parseInt(driver.safety_score) + parseInt(driver.efficiency_rating) + parseFloat(driver.on_time_perc)) / 3);
              return (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={driver.id} 
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="p-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${idx === 0 ? 'bg-axim-warn text-void' : 'bg-void border border-axim-border text-gray-500'}`}>
                      #{idx + 1}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-xs text-white font-bold">{driver.name}</div>
                    <div className="text-[9px] text-gray-500 uppercase">{driver.assigned_vehicle}</div>
                  </td>
                  <td className="p-3 text-right">
                    <div className={`text-sm font-bold ${score > 90 ? 'text-axim-success' : 'text-axim-teal'}`}>
                      {score}%
                    </div>
                    <div className="text-[8px] text-gray-600 uppercase">Overall Gain</div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}