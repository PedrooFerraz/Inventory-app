import * as FileSystem from 'expo-file-system';
import * as Papa from 'papaparse';
import { executeQuery, fetchAll } from '@/services/database';
import { Inventory, CSVParseResult, Item } from '@/types/types';


export const insertInventory = async (
  fileUri: string,
  fileName: string
) => {
  // Read csv file
  const fileContent = await FileSystem.readAsStringAsync(fileUri);

  // csv to json
  const parseResult = await new Promise<CSVParseResult>((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results),
      error: (error: any) => reject(error)
    });
  });

  const items = parseResult.data
    .filter(item => item['Material'] && item['Material'].trim() !== '')
    .map(item => ({
      code: item['Material'],
      description: item['Texto Breve'],
      expectedLocation: item['Posição Depósito'] || '',
      expectedQuantity: formatQuantity(item['Estoque Utilização Livre'] || 0)
    }));

  const totalItems = items.length;
  const importDate = new Date().toLocaleDateString("pt-br");

  const result = await executeQuery(
    `INSERT INTO inventories 
    (fileName, fileUri, importDate, totalItems) 
    VALUES (?, ?, ?, ?);`,
    [fileName, fileUri, importDate, totalItems]
  );

  const inventoryId = result.lastInsertRowId!;

  items.forEach(item => {
    insertInventoryItem(
      inventoryId,
      {
        code: item.code,
        description: item.description,
        location: item.expectedLocation,
        quantity: item.expectedQuantity
      }
    );
  });

  return result;
};

export const fetchInventories = async () => {
  return await fetchAll<Inventory>(
    'SELECT * FROM inventories ORDER BY importDate DESC;'
  );
};

export const updateItemCount = async (
  itemId: number,
  item : {
    reportedQuantity: number,
    reportedLocation: string,
    observation: string,
    operator: string,
    status: number,
    countTime: string
  }
) => {
  return await executeQuery(
    `UPDATE inventory_items SET reportedQuantity = ?, reportedLocation = ?, observation = ?, operator = ?, status = ?, countTime = ? WHERE id = ?;`,
    [item.reportedQuantity, item.reportedLocation, item.observation, item.operator, item.status, item.countTime, itemId]
  );
};

export const updateInventoryStatus = async (
  id: number,
  status: number
) => {
  const result = await executeQuery(
    'UPDATE inventories SET status = ? WHERE id = ?;',
    [id, status]
  );
  return result;
};

export const updateInventoryCountedItems = async (
  inventoryID: number,
  counted: number
) =>{
  const result = await executeQuery(
    `UPDATE inventories SET countedItems = ? WHERE id = ?`,
    [counted, inventoryID])
  return result
}

export const updateInventoryTotalItems = async (
  inventoryID: number,
  total: number
) =>{
  const result = await executeQuery(
    `UPDATE inventories SET totalItems = ? WHERE id = ?`,
    [total, inventoryID])
  return result
}

export const fetchInventoryById = async (
  id: number
): Promise<Inventory | null> => {
  const result = await fetchAll<Inventory>(
    'SELECT * FROM inventories WHERE id = ?;',
    [id]
  );
  return result[0] || null;
};

export const insertInventoryItem = async (
  inventoryId: number,
  items: { code: string; description: string; location: string; quantity: number }
) => {
  const result = executeQuery(
    "INSERT INTO inventory_items (inventory_id, code, description, expectedLocation, expectedQuantity) VALUES (?, ?, ?, ?, ?);",
    [inventoryId, items.code, items.description, items.location, items.quantity]
  );
  return result;
}

export const fetchItemByCode = async (
  inventoryId: number,
  materialCode: string
) : Promise<Item[]> => {
  return await  fetchAll<Item>(
    `SELECT * FROM inventory_items WHERE inventory_id = ? AND code = ? LIMIT 1;`,
    [inventoryId, materialCode]
  );
};

export const fetchItemsByInventoryId = async (inventoryId: number) => {
  return await fetchAll(
    `SELECT * FROM inventory_items WHERE inventory_id = ? ORDER BY code ASC;`,
    [inventoryId]
  );
};

export const fetchItemById = async (inventoryId: number, itemId: number) =>{
  return await fetchAll<Item>(
    `SELECT * FROM inventory_items WHERE inventory_id = ? AND id = ?`,
    [inventoryId, itemId])
}

export const fetchDescriptionByCode = async (inventoryId: number, code: string) => {
  const res = await fetchAll<Item>(
    `SELECT description FROM inventory_items WHERE inventory_id = ? AND code = ? LIMIT 1;`,
    [inventoryId, code]
  )
  return res
}

export const deleteInventory = async (inventoryId: number) => {
  const result = await executeQuery(
    `
    DELETE FROM inventories WHERE id = ?;
    DELETE FROM inventory_items WHERE inventory_id = ?
    `,
    [inventoryId, inventoryId]
  )
  return result;
}


const formatQuantity = (value: string | number): number => {
  if (typeof value === 'number') return Math.floor(value); // If already a number, take all

  // remove dots and commas
  const numericString = value
    .replace(/\./g, '') 
    .replace(/,/g, '.');

  return Math.floor(parseFloat(numericString));
};