import React from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';

export default function DriverRoster() {
  const { drivers } = useCommodoreStore();

  const getRoleBadge = (role) => {
    switch (role?.toUpperCase()) {
      case 'COMMANDER': return 'bg-axim-alert/20 text-axim-alert border-axim-alert/30';
      case 'DISPATCHER': return 'bg-axim-warn/20 text-axim-warn border-axim-warn/30';
      case 'ANALYST': return 'bg-axim-teal/20 text-axim-teal border-axim-teal/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'; // OPERATOR
    }
  };


  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden font-mono">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-teal text-sm">
          <SafeIcon name="Users" className="w-4 h-4" />
          <span>PERSONNEL ROSTER</span>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-[10px] text-gray-500 uppercase">Total: {drivers.length}</div>
          <div className="text-[8px] text-gray-600 mt-0.5" title="Role assignments are managed upstream via Cloudflare Zero Trust.">
            READ-ONLY UPSTREAM SYNC
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-axim-panel z-10 border-b border-axim-border">
            <tr>
              <th className="p-3 text-[9px] text-gray-500 uppercase">Operator / Clearance</th>
              <th className="p-3 text-[9px] text-gray-500 uppercase text-center">Status</th>
              <th className="p-3 text-[9px] text-gray-500 uppercase text-right">Assigned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-axim-border/30">
            {drivers.map(driver => (
              <tr key={driver.id} className="hover:bg-white/5 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="text-xs text-white font-bold">{driver.name}</div>
                    <span className={`text-[8px] px-1 py-0.5 rounded border ${getRoleBadge(driver.role || 'OPERATOR')}`}>
                      {driver.role || 'OPERATOR'}
                    </span>
                  </div>
                  <div className="text-[9px] text-gray-500 uppercase">ID: {driver.license_no}</div>
                </td>
                <td className="p-3 text-center">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border ${
                    driver.status === 'active' 
                    ? 'bg-axim-success/20 text-axim-success border-axim-success/30' 
                    : 'bg-axim-warn/20 text-axim-warn border-axim-warn/30'
                  }`}>
                    {driver.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="text-xs text-axim-teal">{driver.assigned_vehicle}</div>
                  <div className="text-[9px] text-gray-600">{driver.total_hours} hrs logged</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}