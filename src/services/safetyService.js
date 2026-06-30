import { ensureTab, getRows, appendRow } from '../lib/googleSheets';

const TAB = 'SafetyIncidents';
const HEADERS = ['id', 'vehicle_id', 'driver_id', 'incident_type', 'severity', 'description', 'lat', 'lng', 'timestamp'];

export const safetyService = {
  async bootstrap() {
    await ensureTab(TAB, HEADERS);
    const rows = await this.getAll();
    if (rows.length === 0) {
      const initial = [
        [crypto.randomUUID(), 'TRUCK-01', 'AV-992', 'GEOFENCE_BREACH', 'CRITICAL', 'Unauthorized entry into Port Zone Hazmat', '42.1', '30.5', new Date().toISOString()],
        [crypto.randomUUID(), 'VAN-04', 'AV-441', 'OVERSPEED', 'WARN', 'Sustained speed 85MPH in 65MPH zone', '60.2', '70.1', new Date().toISOString()]
      ];
      for (const s of initial) await appendRow(`${TAB}!A:I`, s);
    }
  },

  async getAll() {
    const rows = await getRows(`${TAB}!A2:I`);
    return rows.map(r => {
      const obj = {};
      HEADERS.forEach((h, i) => obj[h] = r[i]);
      return obj;
    });
  },

  async logIncident(data) {
    const row = [
      crypto.randomUUID(),
      data.vehicle_id,
      data.driver_id,
      data.type,
      data.severity,
      data.message,
      data.lat || '0',
      data.lng || '0',
      new Date().toISOString()
    ];
    await appendRow(`${TAB}!A:I`, row);
  }
};