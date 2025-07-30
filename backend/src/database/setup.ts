import db from './index';

db.prepare(
    `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        fname TEXT NOT NULL,
        lname TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );   
`,
).run();

db.prepare(
    `
    CREATE TABLE IF NOT EXISTS user_auth (
        user_id INTEGER PRIMARY KEY,
        password_hash VARCHAR NOT NULL,
        last_changed_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
`,
).run();

db.prepare(
    `
    CREATE TABLE IF NOT EXISTS sessions (
        session_id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expires_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
`,
).run();

console.log('Users table created');
console.log('User auth table created');
console.log('Sessions table created');
