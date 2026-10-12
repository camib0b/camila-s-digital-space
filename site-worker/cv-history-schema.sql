CREATE TABLE IF NOT EXISTS cv_generations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company TEXT NOT NULL,
  role_title TEXT NOT NULL,
  language TEXT NOT NULL,
  posting_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  cv_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cv_generations_created_at ON cv_generations (created_at DESC);
