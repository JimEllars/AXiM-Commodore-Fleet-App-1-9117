import React, { useEffect, useRef } from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';

export default function TelemetryLogs() {
  const { telemetryLogs, setOnyxTrace } = useCommodoreStore();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [telemetryLogs]);

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-teal font-mono text-sm">
          <SafeIcon name="Terminal" className="w-4 h-4" />
          <span>4. EDGE TELEMETRY LOGS</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-axim-success animate-pulse"></div>
          <span className="text-[10px] text-gray-500 font-mono">KV SYNC ACTIVE</span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 bg-void font-mono text-[11px] leading-relaxed space-y-1"
      >
        {telemetryLogs.map(log => {
          let textColor = 'text-gray-400';
          if (log.level === 'WARN') textColor = 'text-axim-warn';
          if (log.level === 'CRITICAL') textColor = 'text-axim-alert';
          if (log.level === 'INFO' && log.message.includes('injection')) textColor = 'text-axim-teal';

          return (
            <div key={log.id} className="flex gap-2 group hover:bg-axim-panel/50 p-1 rounded transition-colors">
              <span className="text-gray-600 whitespace-nowrap">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
              <span className={`w-12 font-bold ${textColor}`}>[{log.level}]</span>
              <span className={`flex-1 ${textColor}`}>{log.message}</span>
              
              {(log.level === 'CRITICAL' || log.level === 'WARN') && (
                <button 
                  onClick={() => setOnyxTrace(log)}
                  className="opacity-0 group-hover:opacity-100 ml-2 px-2 py-0.5 bg-axim-teal/10 text-axim-teal border border-axim-teal/30 rounded whitespace-nowrap transition-opacity flex items-center gap-1 hover:bg-axim-teal hover:text-void"
                >
                  <SafeIcon name="Cpu" className="w-3 h-3" />
                  ONYX TRACE
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}