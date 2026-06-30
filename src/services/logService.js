import { ensureTab, getRows, appendRow } from '../lib/googleSheets';

const TAB = 'Logs';
const HEADERS = ['id', 'timestamp', 'level', 'message', 'created_at'];

export const logService = {
  async bootstrap() {
    await ensureTab(TAB, HEADERS);
  },

  async getAll(limit = 50) {
    const rows = await getRows(`${TAB}!A2:E`);
    return rows.slice(-limit).reverse().map(r => {
      const obj = {};
      HEADERS.forEach((h, i) => obj[h] = r[i]);
      return obj;
    });
  },

  async add(level, message) {
    const id = crypto.randomUUID();
    const row = [id, new Date().toISOString(), level, message, new Date().toISOString()];
    await appendRow(`${TAB}!A:E`, row);
    return id;
  }
};