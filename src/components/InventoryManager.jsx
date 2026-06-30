import React, { useState } from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import { motion, AnimatePresence } from 'framer-motion';
import InventoryIntake from './InventoryIntake';

export default function InventoryManager() {
  const { inventory, selectedVehicleId, activeVehicles } = useCommodoreStore();
  const [showIntake, setShowIntake] = useState(false);
  
  const vehicle = activeVehicles[selectedVehicleId];
  const items = inventory.filter(i => i.vehicle_id === selectedVehicleId);
  const totalWeight = items.reduce((acc, curr) => acc + parseFloat(curr.weight_kg), 0);
  const capacity = vehicle?.type === 'TRUCK' ? 10000 : 2500;
  const loadPercentage = Math.min(100, Math.round((totalWeight / capacity) * 100));

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden font-mono">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-teal text-sm">
          <SafeIcon name="Package" className="w-4 h-4" />
          <span>PAYLOAD & INVENTORY</span>
        </div>
        <button 
          onClick={() => setShowIntake(!showIntake)}
          className="text-[10px] text-axim-teal hover:text-white transition-colors flex items-center gap-1"
        >
          <SafeIcon name={showIntake ? 'X' : 'Plus'} className="w-3 h-3" />
          {showIntake ? 'CANCEL' : 'LOAD ITEM'}
        </button>
      </div>

      <div className="p-4 bg-void/30 border-b border-axim-border">
        <div className="flex justify-between items-end mb-2">
          <div>
            <div className="text-[9px] text-gray-500 uppercase">Gross Payload</div>
            <div className="text-lg font-bold text-white">{totalWeight.toLocaleString()} KG</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-gray-500 uppercase">Utilization</div>
            <div className={`text-lg font-bold ${loadPercentage > 90 ? 'text-axim-alert' : 'text-axim-teal'}`}>{loadPercentage}%</div>
          </div>
        </div>
        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${loadPercentage > 90 ? 'bg-axim-alert' : 'bg-axim-teal'}`}
            style={{ width: `${loadPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {showIntake && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-3 overflow-hidden mt-3"
            >
              <InventoryIntake onClose={() => setShowIntake(false)} />
            </motion.div>
          )}
        </AnimatePresence>
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-axim-panel z-10 border-b border-axim-border">
            <tr>
              <th className="p-3 text-[9px] text-gray-500 uppercase">Item</th>
              <th className="p-3 text-[9px] text-gray-500 uppercase text-right">Qty</th>
              <th className="p-3 text-[9px] text-gray-500 uppercase text-right">Mass</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-axim-border/30">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="p-3">
                  <div className="text-xs text-gray-200">{item.item_name}</div>
                  <div className="text-[9px] text-gray-500 uppercase">{item.status}</div>
                </td>
                <td className="p-3 text-right text-xs text-gray-400 font-mono">
                  {item.quantity} <span className="text-[9px]">{item.unit}</span>
                </td>
                <td className="p-3 text-right text-xs text-axim-teal font-mono">
                  {item.weight_kg}kg
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}