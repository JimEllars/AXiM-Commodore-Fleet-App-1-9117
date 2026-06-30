import { ensureTab, getRows, appendRow } from '../lib/googleSheets';

const TAB = 'RouteHistory';
const HEADERS = ['id', 'vehicle_id', 'stop_id', 'destination_name', 'event_type', 'timestamp', 'created_at'];

export const routeHistoryService = {
  async bootstrap() {
    await ensureTab(TAB, HEADERS);
    const rows = await this.getAll();
    if (rows.length === 0) {
      const initial = [
        [crypto.randomUUID(), 'TRUCK-01', 'stop-1', 'Port Terminal A', 'ARRIVED', '10:45:22', new Date().toISOString()],
        [crypto.randomUUID(), 'TRUCK-01', 'stop-1', 'Port Terminal A', 'COMPLETED', '11:12:05', new Date().toISOString()],
        [crypto.randomUUID(), 'VAN-04', 'stop-4', 'Distribution Center North', 'ARRIVED', '09:30:11', new Date().toISOString()]
      ];
      for (const h of initial) await appendRow(`${TAB}!A:G`, h);
    }
  },

  async getAll() {
    const rows = await getRows(`${TAB}!A2:G`);
    return rows.map(r => {
      const obj = {};
      HEADERS.forEach((h, i) => obj[h] = r[i]);
      return obj;
    });
  },

  async add(vehicleId, stopId, destination, eventType) {
    const id = crypto.randomUUID();
    const row = [
      id, 
      vehicleId, 
      stopId, 
      destination, 
      eventType.toUpperCase(), 
      new Date().toLocaleTimeString(), 
      new Date().toISOString()
    ];
    await appendRow(`${TAB}!A:G`, row);
    return id;
  }
};