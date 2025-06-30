import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';

let dbInstance: SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLiteDatabase> => {
  if (!dbInstance) {
    dbInstance = await openDatabaseAsync('inventory.db', { useNewConnection: true });
    await initDB(dbInstance);
  }
  return dbInstance;
};

export const executeQuery = async (sql: string, params: any[] = []): Promise<any> => {
  try {
    const database = await getDatabase();
    return await database.runAsync(sql, params);
  } catch (error) {
    console.error('Erro ao executar query:', sql, error);
    throw error;
  }
};

export const fetchAll = async <T>(
  sql: string,
  params: any[] = []
) => {
  const database = await getDatabase();
  const result = await database.getAllAsync(sql, params);
  return result as T[];
};

const initDB = async (database: SQLiteDatabase) => {
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
      countedItems INTEGER DEFAULT 0,
      inventoryDocument TEXT
    );

    CREATE TABLE IF NOT EXISTS inventory_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inventory_id INTEGER NOT NULL,
    inventoryDocument TEXT,
    year TEXT,
    center TEXT,
    storage TEXT,
    batch TEXT,
    inventoryItem TEXT,
    code TEXT NOT NULL,
    description TEXT,
    expectedQuantity INTEGER,
    unit TEXT,
    averagePrice TEXT
    expectedLocation TEXT,
    reportedLocation TEXT,
    reportedQuantity INTEGER,
    status INTEGER DEFAULT 0,
    observation TEXT,
    operator TEXT,
    countTime TEXT,
    FOREIGN KEY (inventory_id) REFERENCES inventories (id)
  );

  CREATE TABLE IF NOT EXISTS app_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      master_password TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

  `);
};