import { ensureTab, getRows, appendRow, updateRow, findRowIndexById } from '../lib/googleSheets';

const TAB = 'Vehicles';
const HEADERS = [
  'id', 'type', 'name', 'lat', 'lng', 'status', 'speed_mph', 
  'heading', 'fuel', 'battery', 'load', 'driver', 'driver_id', 
  'created_at', 'updated_at'
];

export const vehicleService = {
  async bootstrap() {
    await ensureTab(TAB, HEADERS);
    const rows = await this.getAll();
    if (rows.length === 0) {
      const initial = [
        [crypto.randomUUID(), 'TRUCK', 'TRUCK-01', '45', '30', 'en_route', '62.4', '90', '82', '94', '85%', 'Sarah Jenkins', 'AV-992', new Date().toISOString(), new Date().toISOString()],
        [crypto.randomUUID(), 'VAN', 'VAN-04', '60', '70', 'idle', '0', '0', '45', '98', '0%', 'Marcus Thorne', 'AV-441', new Date().toISOString(), new Date().toISOString()],
        [crypto.randomUUID(), 'TRUCK', 'OTR-99', '20', '50', 'maintenance', '0', '180', '12', '40', 'N/A', 'Unassigned', '', new Date().toISOString(), new Date().toISOString()]
      ];
      for (const v of initial) {
        await appendRow(`${TAB}!A:O`, v);
      }
    }
  },

  async getAll() {
    const rows = await getRows(`${TAB}!A2:O`);
    return rows.map(r => {
      const obj = {};
      HEADERS.forEach((h, i) => obj[h] = r[i]);
      return obj;
    });
  },

  async update(id, data) {
    const index = await findRowIndexById(TAB, id);
    if (index === -1) return null;
    const current = (await getRows(`${TAB}!A${index}:O${index}`))[0];
    const updated = HEADERS.map((h, i) => {
      if (h === 'updated_at') return new Date().toISOString();
      return data[h] !== undefined ? String(data[h]) : current[i];
    });
    return updateRow(`${TAB}!A${index}:O${index}`, updated);
  }
};