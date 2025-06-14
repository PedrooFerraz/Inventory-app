import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';

let db: SQLiteDatabase;

export const getDatabase = async () => {
  if (!db) {
    db = await openDatabaseAsync('inventory.db', {useNewConnection: true});
    
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
      archiveName TEXT NOT NULL,
      uriArchive TEXT NOT NULL UNIQUE,
      importDate TEXT NOT NULL,
      status INTEGER NOT NULL DEFAULT 0,
      qtyItems INTEGER NOT NULL,
      qtyCountedItems INTEGER DEFAULT 0
    );
  `);
};