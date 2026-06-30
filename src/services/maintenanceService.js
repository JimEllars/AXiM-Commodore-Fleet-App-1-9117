import { ensureTab, getRows, appendRow, findRowIndexById, updateRow } from '../lib/googleSheets';

const TAB = 'Maintenance';
const HEADERS = ['id', 'vehicle_id', 'type', 'description', 'status', 'cost', 'date', 'created_at', 'updated_at'];

export const maintenanceService = {
  async bootstrap() {
    await ensureTab(TAB, HEADERS);
    const rows = await this.getAll();
    if (rows.length === 0) {
      const initial = [
        [crypto.randomUUID(), 'TRUCK-01', 'Oil Change', 'Routine 10k mile service', 'completed', '$120', '2024-03-15', new Date().toISOString(), new Date().toISOString()],
        [crypto.randomUUID(), 'VAN-04', 'Tire Rotation', 'Front-left showing wear', 'pending', '$85', '2024-05-20', new Date().toISOString(), new Date().toISOString()]
      ];
      for (const m of initial) await appendRow(`${TAB}!A:I`, m);
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

  async updateStatus(id, status) {
    const index = await findRowIndexById(TAB, id);
    if (index === -1) return null;
    const current = (await getRows(`${TAB}!A${index}:I${index}`))[0];
    const updated = [...current];
    updated[4] = status;
    updated[8] = new Date().toISOString();
    return updateRow(`${TAB}!A${index}:I${index}`, updated);
  },

  async addRecord(data) {
    const id = crypto.randomUUID();
    const row = [
      id,
      data.vehicle_id,
      data.type,
      data.description,
      data.status || 'pending',
      data.cost || '$0',
      data.date || new Date().toISOString().split('T')[0],
      new Date().toISOString(),
      new Date().toISOString()
    ];
    await appendRow(`${TAB}!A:I`, row);
    return id;
  }
};