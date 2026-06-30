import React from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';

export default function FinancialLedger() {
  const { fleetCosts } = useCommodoreStore();
  const sortedCosts = [...fleetCosts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden font-mono">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-success text-xs uppercase tracking-widest">
          <SafeIcon name="DollarSign" className="w-4 h-4" />
          <span>Expenditure Ledger</span>
        </div>
        <div className="text-[10px] text-gray-500">Live Burn Rate Audit</div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-axim-panel z-10 border-b border-axim-border">
            <tr>
              <th className="p-3 text-[9px] text-gray-500 uppercase">Category</th>
              <th className="p-3 text-[9px] text-gray-500 uppercase">Asset</th>
              <th className="p-3 text-[9px] text-gray-500 uppercase text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-axim-border/30">
            {sortedCosts.map((cost) => (
              <tr key={cost.id} className="hover:bg-white/5 transition-colors">
                <td className="p-3">
                  <div className="text-xs text-white flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      cost.category === 'FUEL' ? 'bg-axim-teal' : 
                      cost.category === 'MAINTENANCE' ? 'bg-axim-alert' : 'bg-axim-warn'
                    }`}></div>
                    {cost.category}
                  </div>
                  <div className="text-[8px] text-gray-600 truncate max-w-[100px]">{cost.description}</div>
                </td>
                <td className="p-3 text-xs text-gray-400 font-bold">{cost.vehicle_id}</td>
                <td className="p-3 text-right text-xs text-white font-bold">${parseFloat(cost.amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}