import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.db');

const db = new Database(dbPath, {
    verbose: console.log,
    timeout: 5000
});
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export default db;
