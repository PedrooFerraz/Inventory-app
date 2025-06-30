import * as FileSystem from 'expo-file-system';
import * as Papa from 'papaparse';
import { executeQuery, fetchAll } from '@/services/database';
import { Inventory, CSVParseResult, Item, ImportedInventoryItem, BatchOption } from '@/types/types';


export const insertInventory = async (fileUri: string, fileName: string) => {
  try {
    // Validação inicial do arquivo
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) throw new Error('Arquivo não encontrado');
    if (fileInfo.size > 6 * 1024 * 1024) throw new Error('Arquivo muito grande (máximo 6MB)');

    // Leitura e parse do CSV
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    const parseResult = await new Promise<CSVParseResult>((resolve, reject) => {
      Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        complete: resolve,
        error: reject
      });
    });

    // Processamento dos itens
    const items: ImportedInventoryItem[] = parseResult.data
      .filter(item => item['MATERIAL'] && item['MATERIAL'].trim() !== '' && item['MATERIAL'] !== "MATERIAL")
      .map(item => ({
        inventoryDocument: item["INVENTÁRIO"] || "",
        year: item["ANO"] || "",
        center: item["CENTRO"] || "",
        storage: item["DEPÓSITO"] || "",
        batch: item["LOTE"] || "",
        inventoryItem: item["ITEM"] || "",
        code: item['MATERIAL']!,
        description: item['DESCRIÇÃO']!,
        expectedQuantity: formatQuantity(item['ESTOQUE'] || 0),
        unit: item["UN"] || "",
        averagePrice: item["PREÇO MÉDIO"] || "",
        currency: item["MOEDA"] || "",
        expectedLocation: item['POSIÇÃO NO DEPÓSITO'] || '',
      }));

    await executeQuery('BEGIN TRANSACTION');

    if (items.length > 0) {
      const existingInventory = await fetchAll<Inventory>(
        `SELECT i.* FROM inventories i
         JOIN inventory_items ii ON i.id = ii.inventory_id
         WHERE ii.inventoryDocument = ? AND ii.year = ?
         LIMIT 1;`,
        [items[0].inventoryDocument, items[0].year]
      );

      if (existingInventory.length > 0) {
        throw new Error(`Inventário com o documento ${items[0].inventoryDocument} no ano ${items[0].year} já foi inserido`);
      }
    }

    const result = await executeQuery(
      `INSERT INTO inventories 
      (fileName, fileUri, importDate, totalItems, inventoryDocument) 
      VALUES (?, ?, ?, ?, ?);`,
      [fileName, fileUri, new Date().toLocaleDateString("pt-br"), items.length, items[0].inventoryDocument]
    );

    const inventoryId = result.lastInsertRowId!;

    await insertItemsInBatches(inventoryId, items);

    await executeQuery('COMMIT');
    return { success: true, inventoryId };

  } catch (error) {
    await executeQuery('ROLLBACK');
    throw error;
  }
};

export const fetchInventories = async () => {
  return await fetchAll<Inventory>(
    'SELECT * FROM inventories ORDER BY importDate DESC;'
  );
};

export const fetchOpenInventories = async () => {
  return await fetchAll<Inventory>(
    'SELECT * FROM inventories WHERE status IS NOT 2 ORDER BY importDate DESC;'
  );
};

const BATCH_SIZE = 50; // Processa 50 itens por vez

const insertItemsInBatches = async (inventoryId: number, items: ImportedInventoryItem[]) => {
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(item => insertInventoryItem(inventoryId, item)));
  }
};


export const updateItemCount = async (
  itemId: number,
  item: {
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
    [status, id]
  );
  return result;
};

export const updateInventoryCountedItems = async (
  inventoryID: number,
  counted: number
) => {
  const result = await executeQuery(
    `UPDATE inventories SET countedItems = ? WHERE id = ?`,
    [counted, inventoryID])
  return result
}

export const updateInventoryTotalItems = async (
  inventoryID: number,
  total: number
) => {
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
  item: ImportedInventoryItem
) => {
  const result = await executeQuery(
    `INSERT INTO inventory_items (
      inventory_id, inventoryDocument, year, center, storage, batch,
      inventoryItem, unit, averagePrice, code, description,
      expectedLocation, expectedQuantity, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);`, // Status 0 = "Não realizado"
    [
      inventoryId,
      item.inventoryDocument,
      item.year,
      item.center,
      item.storage,
      item.batch,
      item.inventoryItem,
      item.unit,
      item.averagePrice,
      item.code,
      item.description,
      item.expectedLocation,
      item.expectedQuantity
    ]
  );
  return result;
};

export const insertNewInventoryItem = async (
  inventoryId: number,
  data: {
    code: string;
    reportedQuantity: number;
    reportedLocation: string;
    observation: string;
    operator: string;
    status: number;
    countTime: string;
  }
) => {
  const result = await executeQuery(
    `INSERT INTO inventory_items (inventory_id, code, reportedQuantity, reportedLocation, observation, operator, status, countTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      inventoryId,
      data.code,
      data.reportedQuantity,
      data.reportedLocation,
      data.observation,
      data.operator,
      data.status,
      data.countTime,
    ]
  );
  return result;
};

export const fetchItemByCode = async (
  inventoryId: number,
  materialCode: string
): Promise<Item[]> => {
  return await fetchAll<Item>(
    `SELECT * FROM inventory_items WHERE inventory_id = ? AND code = ? LIMIT 1;`,
    [inventoryId, materialCode]
  );
};

export const fetchItemByCodeAndBatch = async (
  inventoryId: number,
  materialCode: string,
  batch: string
): Promise<Item[]> => {
  return await fetchAll<Item>(
    `SELECT * FROM inventory_items WHERE inventory_id = ? AND code = ? AND batch = ? LIMIT 1;`,
    [inventoryId, materialCode, batch]
  );
};

export const fetchItemsByInventoryId = async (inventoryId: number): Promise<Item[]> => {
  return await fetchAll<Item>(
    `SELECT * FROM inventory_items WHERE inventory_id = ? ORDER BY code ASC;`,
    [inventoryId]
  );
};

export const fetchItemById = async (inventoryId: number, itemId: number) => {
  return await fetchAll<Item>(
    `SELECT * FROM inventory_items WHERE inventory_id = ? AND id = ?`,
    [inventoryId, itemId])
}

export const fetchDescriptionByCode = async (inventoryId: number, code: string) => {
  const res = await fetchAll<Item>(
    `SELECT description, batch, unit FROM inventory_items WHERE inventory_id = ? AND code = ? LIMIT 1;`,
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

export const getBatchesForItem = async (
  inventoryId: number,
  materialCode: string
): Promise<BatchOption[]> => {
  try {
    const query = `
            SELECT batch
            FROM inventory_items 
            WHERE 
                inventory_id = ? AND 
                code = ?
            ORDER BY batch
        `;

    const result = await fetchAll<BatchOption>(query, [inventoryId, materialCode]);
    return result;
  } catch (error) {
    console.error("Error fetching batches:", error);
    return [];
  }
}