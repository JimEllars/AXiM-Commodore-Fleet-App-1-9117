import { ensureTab, getRows, appendRow, updateRow, deleteRow, findRowIndexById } from '../lib/googleSheets';

const TAB = 'Geofences';
const HEADERS = ['id', 'name', 'lat', 'lng', 'radius_km', 'type', 'severity', 'active', 'created_at', 'updated_at'];

export const geofenceService = {
  async bootstrap() {
    await ensureTab(TAB, HEADERS);
    const rows = await this.getAll();
    if (rows.length === 0) {
      const initial = [
        [crypto.randomUUID(), 'Port Zone Alpha', '42', '35', '5', 'PREFERRED', 'INFO', 'true', new Date().toISOString(), new Date().toISOString()],
        [crypto.randomUUID(), 'Hazmat Restricted Area', '52', '65', '2.5', 'RESTRICTED', 'CRITICAL', 'true', new Date().toISOString(), new Date().toISOString()],
        [crypto.randomUUID(), 'Congestion Zone 4', '48', '55', '8', 'ADVISORY', 'WARN', 'true', new Date().toISOString(), new Date().toISOString()]
      ];
      for (const g of initial) await appendRow(`${TAB}!A:J`, g);
    }
  },

  async getAll() {
    const rows = await getRows(`${TAB}!A2:J`);
    return rows.map(r => {
      const obj = {};
      HEADERS.forEach((h, i) => {
        let val = r[i];
        if (h === 'active') val = val === 'true';
        if (h === 'radius_km' || h === 'lat' || h === 'lng') val = parseFloat(val);
        obj[h] = val;
      });
      return obj;
    });
  },

  async add(data) {
    const row = [
      crypto.randomUUID(),
      data.name,
      String(data.lat),
      String(data.lng),
      String(data.radius_km),
      data.type || 'ADVISORY',
      data.severity || 'INFO',
      'true',
      new Date().toISOString(),
      new Date().toISOString()
    ];
    await appendRow(`${TAB}!A:J`, row);
  },

  async update(id, data) {
    const index = await findRowIndexById(TAB, id);
    if (index === -1) return null;
    const current = (await getRows(`${TAB}!A${index}:J${index}`))[0];
    const updated = HEADERS.map((h, i) => {
      if (h === 'updated_at') return new Date().toISOString();
      if (data[h] !== undefined) return String(data[h]);
      return current[i];
    });
    return updateRow(`${TAB}!A${index}:J${index}`, updated);
  },

  async remove(id) {
    return deleteRow(TAB, id);
  }
};