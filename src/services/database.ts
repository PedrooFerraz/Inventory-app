import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';

let db: SQLiteDatabase;

export const getDatabase = async () => {
  if (!db) {
    db = await openDatabaseAsync('inventory.db', { useNewConnection: true });

    await initDB();
  }
  return db;
};

export const executeQuery = async <T>(
  sql: string,
  params: any[] = []
) => {
  const database = await getDatabase();
  return await database.runAsync(sql, params);
};

export const fetchAll = async <T>(
  sql: string,
  params: any[] = []
) => {
  const database = await getDatabase();
  const result = await database.getAllAsync(sql, params);
  return result as T[];
};

export const initDB = async () => {
  const database = await getDatabase();

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS operators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS inventories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fileName TEXT NOT NULL,
      fileUri TEXT NOT NULL UNIQUE,
      importDate TEXT NOT NULL,
      status INTEGER NOT NULL DEFAULT 0,
      totalItems INTEGER NOT NULL,
      countedItems INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS inventory_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inventory_id INTEGER NOT NULL,
    code TEXT NOT NULL,
    description TEXT NOT NULL,
    expectedLocation TEXT,
    reportedLocation TEXT,
    expectedQuantity INTEGER NOT NULL,
    reportedQuantity INTEGER,
    status INTEGER DEFAULT 0,
    observation TEXT,
    operator TEXT,
    countTime TEXT,
    FOREIGN KEY (inventory_id) REFERENCES inventories (id)
  );
  `);
};