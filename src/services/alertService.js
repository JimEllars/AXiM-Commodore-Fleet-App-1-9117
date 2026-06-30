import { ensureTab, getRows, appendRow, deleteRow, updateRow, findRowIndexById } from '../lib/googleSheets';

const TAB = 'Alerts';
const HEADERS = ['id', 'source', 'type', 'message', 'lat', 'lng', 'status', 'created_at', 'updated_at'];

export const alertService = {
  async bootstrap() {
    await ensureTab(TAB, HEADERS);
    const rows = await this.getAll();
    if (rows.length === 0) {
      const initial = [
        [crypto.randomUUID(), 'VendOS', 'CRITICAL', 'Machine #994 Out of Stock (High Velocity Goods)', '42', '35', 'active', new Date().toISOString(), new Date().toISOString()],
        [crypto.randomUUID(), 'AgentView', 'WARN', 'Field Tech requires parts delivery at Site Gamma', '55', '60', 'active', new Date().toISOString(), new Date().toISOString()]
      ];
      for (const a of initial) await appendRow(`${TAB}!A:I`, a);
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

  async add(data) {
    const row = [
      crypto.randomUUID(),
      data.source || 'SYSTEM',
      data.type || 'INFO',
      data.message,
      data.lat || '0',
      data.lng || '0',
      'active',
      new Date().toISOString(),
      new Date().toISOString()
    ];
    await appendRow(`${TAB}!A:I`, row);
  },

  async updateStatus(id, status) {
    const index = await findRowIndexById(TAB, id);
    if (index === -1) return null;
    const current = (await getRows(`${TAB}!A${index}:I${index}`))[0];
    const updated = [...current];
    updated[6] = status;
    updated[8] = new Date().toISOString();
    return updateRow(`${TAB}!A${index}:I${index}`, updated);
  },

  async remove(id) {
    return deleteRow(TAB, id);
  }
};