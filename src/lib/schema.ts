import { query } from "./db";

export async function createTables() {
  const sqls = [
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      display_name TEXT,
      self_intro_text TEXT,
      self_intro_markdown TEXT,
      is_admin BOOLEAN DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS cit_requests (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      title TEXT,
      appeal_point TEXT,
      content_markdown TEXT,
      max_reports INTEGER,
      is_active BOOLEAN DEFAULT 0,
      is_public BOOLEAN DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS cit_reports (
      id TEXT PRIMARY KEY,
      request_id TEXT,
      user_id TEXT,
      content_markdown TEXT,
      is_active BOOLEAN DEFAULT 0,
      is_public BOOLEAN DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (request_id) REFERENCES cit_requests(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS cit_comments (
      id TEXT PRIMARY KEY,
      target_type TEXT, -- 'request' or 'report'
      target_id TEXT,
      user_id TEXT, -- Nullable for guests
      guest_name TEXT, -- Nullable
      content TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS cit_histories (
      id TEXT PRIMARY KEY,
      target_type TEXT,
      target_id TEXT,
      old_data TEXT, -- JSON string
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS cit_likes (
      id TEXT PRIMARY KEY,
      target_type TEXT,
      target_id TEXT,
      user_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS user_passwords (
      user_id TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
  ];

  for (const sql of sqls) {
    await query(sql);
  }
}
