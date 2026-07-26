import { create } from 'zustand';
import { vehicleService } from '../services/vehicleService';
import { manifestService } from '../services/manifestService';
import { alertService } from '../services/alertService';
import { logService } from '../services/logService';
import { maintenanceService } from '../services/maintenanceService';
import { directiveService } from '../services/directiveService';
import { routeHistoryService } from '../services/routeHistoryService';
import { suggestionService } from '../services/suggestionService';
import { inventoryService } from '../services/inventoryService';
import { geofenceService } from '../services/geofenceService';
import { costService } from '../services/costService';
import { optimizationHistoryService } from '../services/optimizationHistoryService';
import { driverService } from '../services/driverService';
import { safetyService } from '../services/safetyService';
import { routeOptimizerService } from '../services/routeOptimizerService';
import { predictiveService } from '../services/predictiveService';

export const useCommodoreStore = create((set, get) => ({
  activeVehicles: {},
  selectedVehicleId: null,
  isTracking: false,
  manifests: {},
  ecosystemAlerts: [],
  telemetryLogs: [],
  maintenanceRecords: [],
  directives: [],
  routeHistory: [],
  routeSuggestions: [],
  inventory: [],
  geofences: [],
  fleetCosts: [],
  optimizationHistory: [],
  drivers: [],
  safetyIncidents: [],
  operatorVitals: {},
  diagnostics: [],
  activeTab: 'fleet',
  isOptimizing: false,
  activeOptimization: null,
  activeOnyxTrace: null,
  isLoading: true,
  fleetStats: {
    active_assets: 0,
    fuel_efficiency: '6.8 mpg',
    uptime: '99.94%',
    pending_tasks: 0
  },

  init: async () => {
    set({ isLoading: true });
    try {
      await Promise.all([
        vehicleService.bootstrap(),
        manifestService.bootstrap(),
        alertService.bootstrap(),
        logService.bootstrap(),
        maintenanceService.bootstrap(),
        directiveService.bootstrap(),
        routeHistoryService.bootstrap(),
        suggestionService.bootstrap(),
        inventoryService.bootstrap(),
        geofenceService.bootstrap(),
        costService.bootstrap(),
        optimizationHistoryService.bootstrap(),
        driverService.bootstrap(),
        safetyService.bootstrap(),
        predictiveService.bootstrap()
      ]);

      const [vehicles, alerts, logs, maintenance, directives, history, suggestions, inventory, geofences, costs, optHistory, drivers, safety, diags] = await Promise.all([
        vehicleService.getAll(),
        alertService.getAll(),
        logService.getAll(),
        maintenanceService.getAll(),
        directiveService.getAll(),
        routeHistoryService.getAll(),
        suggestionService.getAll(),
        inventoryService.getAll(),
        geofenceService.getAll(),
        costService.getAll(),
        optimizationHistoryService.getAll(),
        driverService.getAll(),
        safetyService.getAll(),
        predictiveService.getAll()
      ]);

      const vehicleMap = {};
      const vitalsMap = {};
      vehicles.forEach(v => {
        vehicleMap[v.id] = v;
        if (v.driver_id) {
          vitalsMap[v.driver_id] = { bpm: 72, stress: 15, fatigue: 0 };
        }
      });

      set({ 
        activeVehicles: vehicleMap, 
        selectedVehicleId: vehicles[0]?.id || null,
        ecosystemAlerts: alerts,
        telemetryLogs: logs,
        maintenanceRecords: maintenance,
        directives: directives,
        routeHistory: history,
        routeSuggestions: suggestions,
        inventory: inventory,
        geofences: geofences,
        fleetCosts: costs,
        optimizationHistory: optHistory,
        drivers: drivers,
        safetyIncidents: safety,
        diagnostics: diags,
        operatorVitals: vitalsMap,
        fleetStats: {
          ...get().fleetStats,
          active_assets: vehicles.length,
          pending_tasks: alerts.length
        },
        isLoading: false 
      });

      if (vehicles[0]?.id) {
        get().loadManifest(vehicles[0].id);
      }
    } catch (error) {
      console.error('Commodore Init Failed:', error);
      set({ isLoading: false });
    }
  },

  simulateVitals: async () => {
    const { activeVehicles, geofences, ecosystemAlerts, operatorVitals, drivers, diagnostics } = get();
    const updatedVehicles = { ...activeVehicles };
    const updatedVitals = { ...operatorVitals };
    const updatedDiags = [...diagnostics];
    let changed = false;

    for (const id of Object.keys(updatedVehicles)) {
      const v = { ...updatedVehicles[id] };
      const d = drivers.find(drv => drv.id === v.driver_id || drv.assigned_vehicle === v.id);
      
      if (v.status === 'en_route') {
        changed = true;
        
        // Telemetry Jitter
        const lat = parseFloat(v.lat);
        const lng = parseFloat(v.lng);
        const rad = (parseInt(v.heading) * Math.PI) / 180;
        v.lat = (lat + Math.sin(rad) * 0.05).toFixed(4);
        v.lng = (lng + Math.cos(rad) * 0.05).toFixed(4);
        
        // Component Wear Simulation
        updatedDiags.filter(diag => diag.vehicle_id === v.id).forEach(diag => {
          const degradation = Math.random() * 0.05;
          diag.health_score = (parseFloat(diag.health_score) - degradation).toFixed(2);
          if (parseFloat(diag.health_score) < 75 && diag.status !== 'CRITICAL') {
            get().triggerProactiveAlert(v.name, 'WARN', `DIAGNOSTIC: ${diag.component} health dropped below 75%.`, v.lat, v.lng);
            diag.status = 'WATCH';
          }
        });

        if (d && updatedVitals[d.id]) {
          const vit = updatedVitals[d.id];
          vit.bpm = Math.max(60, Math.min(140, vit.bpm + (Math.random() - 0.45) * 4));
          vit.stress = Math.max(5, Math.min(100, vit.stress + (Math.random() - 0.45) * 5));
          vit.fatigue = Math.min(100, vit.fatigue + 0.1);

          if (vit.stress > 85) {
            const msg = `BIO-HAZARD: Operator ${d.name} exhibiting critical stress levels (${Math.round(vit.stress)}%).`;
            if (!ecosystemAlerts.find(a => a.message === msg)) {
              get().triggerProactiveAlert(d.name, 'CRITICAL', msg, v.lat, v.lng);
            }
          }
        }

        v.speed_mph = (parseFloat(v.speed_mph) + (Math.random() - 0.5) * 4).toFixed(1);
        updatedVehicles[id] = v;
      }
    }

    if (changed) {
      set({ activeVehicles: updatedVehicles, operatorVitals: updatedVitals, diagnostics: updatedDiags });
    }
  },

  triggerAdaptiveOptimization: async (strategy) => {
    const vehicleId = get().selectedVehicleId;
    const manifest = get().manifests[vehicleId];
    set({ isOptimizing: true, activeOptimization: null });
    
    const proposal = await routeOptimizerService.calculateOptimization(vehicleId, manifest, strategy);
    set({ activeOptimization: proposal, isOptimizing: false });
    await logService.add('INFO', `Onyx Solver: Adaptive route proposal generated for ${vehicleId} using ${strategy} strategy.`);
  },

  commitOptimization: async () => {
    const { activeOptimization, selectedVehicleId, manifests } = get();
    if (!activeOptimization) return;

    set({ isOptimizing: true });
    const manifest = manifests[selectedVehicleId];
    
    await routeOptimizerService.commitOptimization(selectedVehicleId, manifest.id, activeOptimization.newSequence);
    
    await optimizationHistoryService.log(selectedVehicleId, {
      timeSaved: (activeOptimization.originalTime - activeOptimization.optimizedTime).toString(),
      fuelSaved: (activeOptimization.originalFuel - activeOptimization.optimizedFuel).toFixed(1),
      gain: `+${Math.round(((activeOptimization.originalTime - activeOptimization.optimizedTime) / activeOptimization.originalTime) * 100)}%`
    });

    const [newManifest, optHistory] = await Promise.all([
      manifestService.getForVehicle(selectedVehicleId),
      optimizationHistoryService.getAll()
    ]);

    set({ 
      manifests: { ...get().manifests, [selectedVehicleId]: newManifest },
      optimizationHistory: optHistory,
      activeOptimization: null,
      isOptimizing: false 
    });
  },

  discardOptimization: () => set({ activeOptimization: null }),

  triggerProactiveAlert: async (source, type, message, lat, lng) => {
    await alertService.add({ source, type, message, lat, lng });
    const alerts = await alertService.getAll();
    set({ ecosystemAlerts: alerts });
    await logService.add(type, `[PROACTIVE] ${message}`);

    // Dispatch to AXiM Core central telemetry
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseKey) {
        const { createClient } = await import('@supabase/supabase-js');
        const client = createClient(supabaseUrl, supabaseKey);
        await client.functions.invoke('telemetry-ingress', {
          body: {
            device_id: source,
            event_type: `FLEET_ALERT_${type}`,
            severity: type === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
            message,
            coordinates: { lat, lng },
            source: 'AXiM_COMMODORE_FLEET_APP'
          }
        });
      }
    } catch (e) {
      console.warn('[COMMODORE_TELEMETRY] Core telemetry dispatch failed:', e);
    }
  },

  resolveAlert: async (id) => {
    const alert = get().ecosystemAlerts.find(a => a.id === id);
    if (alert) {
      const vehicle = Object.values(get().activeVehicles).find(v => alert.message.includes(v.name) || alert.source === v.name);
      await safetyService.logIncident({
        vehicle_id: vehicle?.id || 'SYSTEM',
        driver_id: vehicle?.driver_id || 'UNASSIGNED',
        type: alert.type,
        severity: alert.type,
        message: alert.message,
        lat: alert.lat,
        lng: alert.lng
      });
    }
    await alertService.remove(id);
    const alerts = await alertService.getAll();
    const safety = await safetyService.getAll();
    set({ ecosystemAlerts: alerts, safetyIncidents: safety });
  },

  updateStopStatus: async (stopId, status) => {
    const vehicleId = get().selectedVehicleId;
    await manifestService.updateStopStatus(stopId, status);
    await get().loadManifest(vehicleId);
  },

  loadManifest: async (vehicleId) => {
    const manifest = await manifestService.getForVehicle(vehicleId);
    set((state) => ({ manifests: { ...state.manifests, [vehicleId]: manifest } }));
  },

  setSelectedVehicle: (id) => {
    set({ selectedVehicleId: id, isTracking: true });
    if (!get().manifests[id]) get().loadManifest(id);
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setIsTracking: (isTracking) => set({ isTracking }),
  setOnyxTrace: (trace) => set({ activeOnyxTrace: trace }),
  sendDirective: async (vehicleId, message) => {
    await directiveService.send(vehicleId, message);
    const directives = await directiveService.getAll();
    set({ directives });
    await logService.add('INFO', `Directive issued to ${vehicleId}: ${message}`);
  }
}));