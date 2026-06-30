import React from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';

export default function CertificationManager() {
  const { drivers } = useCommodoreStore();

  const getStatusColor = (expiry) => {
    const days = Math.floor((new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'text-axim-alert';
    if (days < 30) return 'text-axim-warn';
    return 'text-axim-success';
  };

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden font-mono text-[10px]">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-teal uppercase tracking-widest">
          <SafeIcon name="Shield" className="w-4 h-4" />
          <span>Compliance & Certs</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {drivers.map(driver => (
          <div key={driver.id} className="p-3 bg-void/30 border border-axim-border rounded">
            <div className="flex justify-between items-start mb-2">
              <span className="text-white font-bold">{driver.name}</span>
              <span className={`font-bold ${getStatusColor(driver.license_expiry)}`}>
                EXP: {driver.license_expiry}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {driver.certifications.split(',').map(cert => (
                <span key={cert} className="px-1.5 py-0.5 bg-axim-teal/10 text-axim-teal border border-axim-teal/20 rounded uppercase text-[8px]">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}