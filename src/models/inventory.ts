import * as FileSystem from 'expo-file-system';
import * as Papa from 'papaparse';
import { executeQuery, fetchAll } from '@/services/database';
import { Inventory, CSVParseResult } from '@/types/types';


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
      complete: (results) => resolve(results),
      error: (error : any) => reject(error)
    });
  });
  
  const qtyItems = parseResult.data.length;
  const importDate = new Date().toISOString();
  
  const result = await executeQuery(
    `INSERT INTO inventories 
    (archiveName, uriArchive, importDate, qtyItems) 
    VALUES (?, ?, ?, ?);`,
    [fileName, fileUri, importDate, qtyItems]
  );
  
  return result;
};

export const fetchInventories = async () => {
  return await fetchAll<Inventory>(
    'SELECT * FROM inventories ORDER BY importDate DESC;'
  );
};

// Atualiza a quantidade de itens contados
export const updateQtyCountedItems = async (
  id: number,
  counted: number
) => {
  const result = await executeQuery(
    'UPDATE inventories SET qtyCountedItems = ? WHERE id = ?;',
    [id, counted]
  );
  return result;
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

// Obtém um inventário específico
export const fetchInventoryById = async (
  id: number
): Promise<Inventory | null> => {
  const result = await fetchAll<Inventory>(
    'SELECT * FROM inventories WHERE id = ?;',
    [id]
  );
  return result[0] || null;
};