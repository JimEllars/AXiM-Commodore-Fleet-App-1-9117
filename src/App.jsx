import ErrorBoundary from './common/ErrorBoundary';
import React, { useEffect, useState } from 'react';
import MapPanel from './components/MapPanel';
import ManifestMonitor from './components/ManifestMonitor';
import TelemetryLogs from './components/TelemetryLogs';
import FleetStats from './components/FleetStats';
import MaintenanceHub from './components/MaintenanceHub';
import FleetAnalytics from './components/FleetAnalytics';
import DriverDirectives from './components/DriverDirectives';
import RiskMonitor from './components/RiskMonitor';
import InventoryManager from './components/InventoryManager';
import OnyxAnalysisModal from './components/OnyxAnalysisModal';
import AssetProfile from './components/AssetProfile';
import DriverRoster from './components/DriverRoster';
import GeofenceManager from './components/GeofenceManager';
import GeofenceAlerts from './components/GeofenceAlerts';
import FinancialLedger from './components/FinancialLedger';
import TaskInjector from './components/TaskInjector';
import BioTelemetry from './components/BioTelemetry';
import CertificationManager from './components/CertificationManager';
import ProfitabilityHUD from './components/ProfitabilityHUD';
import ControlCenter from './components/ControlCenter';
import AdaptiveRouteController from './components/AdaptiveRouteController';
import DiagnosticSwarm from './components/DiagnosticSwarm';
import Leaderboard from './components/Leaderboard';
import { useCommodoreStore } from './store/useCommodoreStore';
import SafeIcon from './common/SafeIcon';

function App() {
  const { init, isLoading, activeTab, setActiveTab, simulateVitals, currentUser, connectionStatus, setConnectionStatus } = useCommodoreStore();
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);
  const [showRoleToast, setShowRoleToast] = useState(true);



  useEffect(() => {
    const handleToast = (e) => {
      // Very basic implementation for the requested toast
      alert(e.detail);
    };
    window.addEventListener('axim-toast', handleToast);
    return () => window.removeEventListener('axim-toast', handleToast);
  }, []);

  useEffect(() => {
    const handleOnline = () => setConnectionStatus('live');
    const handleOffline = () => setConnectionStatus('disconnected');
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setConnectionStatus]);

  useEffect(() => {
    if (!isLoading && showRoleToast) {
      const timer = setTimeout(() => setShowRoleToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, showRoleToast]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      simulateVitals();
    }, 5000);
    return () => clearInterval(interval);
  }, [isLoading, simulateVitals]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-void flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-axim-teal/20 border-t-axim-teal rounded-full animate-spin"></div>
        <div className="text-axim-teal font-mono text-sm tracking-[0.3em] animate-pulse">INITIALIZING COMMODORE CORE...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void text-gray-200 p-4 font-sans flex flex-col overflow-hidden">

      {showRoleToast && currentUser && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
          <div className="bg-axim-panel border border-axim-teal rounded-lg shadow-[0_0_15px_rgba(45,212,191,0.2)] p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-axim-teal/20 flex items-center justify-center text-axim-teal">
              <SafeIcon name="Shield" className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">Active Clearance</div>
              <div className="text-sm font-bold text-white tracking-widest">{currentUser.role}</div>
            </div>
          </div>
        </div>
      )}

      <OnyxAnalysisModal />
      
      <header className="flex items-center justify-between mb-4 pb-4 border-b border-axim-border shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-axim-teal/10 border border-axim-teal rounded flex items-center justify-center text-axim-teal">
              <SafeIcon name="Activity" className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-white">COMMODORE</h1>
              <p className="text-xs font-mono text-axim-teal uppercase tracking-widest">Fleet & Route Orchestrator</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-1 bg-void border border-axim-border p-1 rounded-lg">
            {[
              { id: 'fleet', label: 'TACTICAL', icon: 'Monitor' },
              { id: 'maintenance', label: 'HEALTH', icon: 'Tool' },
              { id: 'analytics', label: 'ANALYTICS', icon: 'BarChart' }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-md text-[11px] font-mono transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-axim-teal text-void font-bold shadow-[0_0_15px_rgba(45,212,191,0.3)]' : 'text-gray-500 hover:text-white'}`}
              >
                <SafeIcon name={tab.icon} className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setShowAssetDrawer(!showAssetDrawer)}
            className="flex items-center gap-2 px-3 py-1.5 bg-axim-panel border border-axim-border rounded text-[10px] font-mono text-axim-teal hover:border-axim-teal transition-all"
          >
            <SafeIcon name="Truck" className="w-3.5 h-3.5" />
            {showAssetDrawer ? 'HIDE UNIT PROFILE' : 'SHOW UNIT PROFILE'}
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-axim-panel border border-axim-border rounded text-[10px] font-mono">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'live' ? 'bg-axim-success animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.5)]' :
              connectionStatus === 'reconnecting' ? 'bg-axim-warn animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]' :
              'bg-axim-alert shadow-[0_0_8px_rgba(239,68,68,0.5)]'
            }`}></div>
            <span className={
              connectionStatus === 'live' ? 'text-axim-success' :
              connectionStatus === 'reconnecting' ? 'text-axim-warn' :
              'text-axim-alert'
            }>
              {connectionStatus === 'live' ? 'SYSTEM LIVE' :
               connectionStatus === 'reconnecting' ? 'RECONNECTING...' :
               'EDGE DISCONNECTED'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm font-mono text-gray-400">
            <SafeIcon name="Clock" className="w-4 h-4" />
            <span>{new Date().toISOString().split('T')[1].split('.')[0]} UTC</span>
          </div>
        </div>
      </header>

      <FleetStats />

      <main className="flex-1 min-h-0 overflow-hidden relative">
        <ErrorBoundary>
        <div className="flex h-full gap-4">
          <div className="flex-1 min-w-0 overflow-hidden">
            {activeTab === 'fleet' && (
              <div className="h-full flex flex-col gap-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 h-[45%] gap-4 shrink-0">
                  <MapPanel />
                  <ManifestMonitor />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 h-[25%] gap-4 shrink-0">
                  <GeofenceAlerts />
                  <DriverDirectives />
                  <BioTelemetry />
                  <RiskMonitor />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 h-[30%] gap-4 min-h-0">
                  <div className="md:col-span-2 grid grid-cols-3 gap-4">
                    <div className="col-span-1"><GeofenceManager /></div>
                    <div className="col-span-2 grid grid-cols-2 gap-4">
                      <TelemetryLogs />
                      <TaskInjector />
                    </div>
                  </div>
                  <AdaptiveRouteController />
                </div>
              </div>
            )}

            {activeTab === 'maintenance' && (
              <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
                    <MaintenanceHub />
                    <DiagnosticSwarm />
                  </div>
                  <div className="h-48 grid grid-cols-2 gap-4 shrink-0">
                    <CertificationManager />
                    <ControlCenter />
                  </div>
                </div>
                <div className="space-y-4 flex flex-col min-h-0">
                  <div className="flex-1 min-h-0"><DriverRoster /></div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              currentUser?.role === 'DISPATCHER' ? (
                <div className="h-full flex flex-col items-center justify-center bg-axim-panel border border-axim-border rounded-lg">
                  <div className="w-16 h-16 rounded-full border border-axim-alert flex items-center justify-center text-axim-alert mb-4">
                    <SafeIcon name="ShieldAlert" className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
                  <p className="text-gray-400 font-mono text-sm uppercase tracking-widest text-center">
                    Commander Clearance Required<br/>
                    Contact your System Administrator
                  </p>
                </div>
              ) : (
                <div className="h-full flex flex-col gap-4 overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[500px] shrink-0">
                    <div className="lg:col-span-3">
                      <FleetAnalytics />
                    </div>
                    <ProfitabilityHUD />
                  </div>
                  <div className="grid grid-cols-3 gap-4 h-64 shrink-0">
                    <div className="col-span-1"><FinancialLedger /></div>
                    <div className="col-span-1"><InventoryManager /></div>
                    <div className="col-span-1"><Leaderboard /></div>
                  </div>
                </div>
              )
            )}
          </div>

          {showAssetDrawer && (
            <aside className="w-80 shrink-0 hidden xl:block">
              <AssetProfile />
            </aside>
          )}
        </div>
              </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;