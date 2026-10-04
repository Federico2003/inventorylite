-- Crea la tabla de productos (se puede ejecutar varias veces sin error)
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
);
