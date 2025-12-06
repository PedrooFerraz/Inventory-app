import { File } from 'expo-file-system';
import * as Papa from 'papaparse';
import { executeQuery, fetchAll, getDatabase } from '@/services/database';
import { Inventory, CSVParseResult, Item, ImportedInventoryItem, BatchOption, InventoryLocation, InventoryItem } from '@/types/types';
import { SQLiteDatabase } from 'expo-sqlite';

export const insertInventory = async (fileUri: string, fileName: string, countType: 1 | 2): Promise<{
  success: boolean;
  inventories: Array<{
    inventoryId: number;
    document: string;
    year: string;
    itemCount: number;
  }>;
  message: string;
}> => {
  try {
    // Valida se o arquivo existe e seu tamanho
    const file = new File(fileUri);
    let fileInfo;
    try {
      fileInfo = await file.info();
    } catch (error) {
      throw new Error(`Erro ao obter informações do arquivo: ${error}`);
    }

    if (!fileInfo.exists) throw new Error('Arquivo não encontrado');
    if (fileInfo.size && fileInfo.size > 6 * 1024 * 1024)
      throw new Error('Arquivo muito grande (máximo 6MB)');

    // Lendo arquivo CSV
    let fileContent: string;
    try {
      fileContent = await file.text();
    } catch (error) {
      throw new Error(`Erro ao ler o arquivo CSV: ${error}`);
    }

    await executeQuery('BEGIN TRANSACTION');

    if (fileContent.includes('�'))
      throw new Error('O arquivo parece estar com codificação inválida. Por favor, salve como CSV UTF-8.');

    const parseResult = await new Promise<CSVParseResult>((resolve, reject) => {
      Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        complete: resolve,
        error: reject,
      });
    });

    // Processando items
    const items: ImportedInventoryItem[] = parseResult.data
      .filter(item => item['MATERIAL'] && item['MATERIAL'].trim() !== '' && item['MATERIAL'] !== 'MATERIAL')
      .map(item => ({
        inventoryDocument: item['INVENTÁRIO'] || '',
        year: item['ANO'] || '',
        center: item['CENTRO'] || '',
        storage: item['DEPÓSITO'] || '',
        batch: item['LOTE'] || '',
        inventoryItem: item['ITEM'] || '',
        code: item['MATERIAL']!.toUpperCase(),
        description: item['DESCRIÇÃO']!,
        expectedQuantity: formatQuantity(item['ESTOQUE'] || 0),
        unit: item['UN'] || '',
        averagePrice: item['PREÇO MÉDIO'] || '',
        currency: item['MOEDA'] || '',
        expectedLocation: (item['POSIÇÃO NO DEPÓSITO'] || '').toUpperCase(),
      }));

    if (items.length === 0) {
      throw new Error('Nenhum item válido encontrado no arquivo');
    }

    // Agrupa itens por inventário
    const itemsByInventory = items.reduce((acc, item) => {
      if (!acc[item.inventoryDocument]) {
        acc[item.inventoryDocument] = [];
      }
      acc[item.inventoryDocument].push(item);
      return acc;
    }, {} as Record<string, ImportedInventoryItem[]>);

    const inventoryResults: Array<{
      inventoryId: number;
      document: string;
      year: string;
      itemCount: number;
    }> = [];

    // Processa cada inventário separadamente
    for (const [inventoryDocument, documentItems] of Object.entries(itemsByInventory)) {
      // Checa se o inventário já existe com base no mesmo número e ano
      const year = documentItems[0].year;
      const existingInventory = await fetchAll<Inventory>(
        `SELECT i.* FROM inventories i
         JOIN inventory_items ii ON i.id = ii.inventory_id
         WHERE ii.inventoryDocument = ? AND ii.year = ?
         LIMIT 1;`,
        [inventoryDocument, year]
      );

      if (existingInventory.length > 0) {
        throw new Error(`Inventário com o documento ${inventoryDocument} no ano ${year} já foi inserido`);
      }

      // Cria um novo inventário
      const result = await executeQuery(
        `INSERT INTO inventories 
        (fileName, fileUri, importDate, inventoryYear, totalItems, inventoryDocument, countType) 
        VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [fileName, fileUri, new Date().toLocaleDateString('pt-BR'), year, documentItems.length, inventoryDocument, countType]
      );

      const inventoryId = result.lastInsertRowId!;

      // Insere itens no inventário em lotes para melhor performance
      await insertItemsInBatches(inventoryId, documentItems);

      inventoryResults.push({
        inventoryId,
        document: inventoryDocument,
        year,
        itemCount: documentItems.length,
      });
    }

    await executeQuery('COMMIT');

    return {
      success: true,
      inventories: inventoryResults,
      message: inventoryResults.length > 1
        ? `Foram criados ${inventoryResults.length} inventários distintos`
        : 'Inventário criado com sucesso',
    };
  } catch (error) {
    await executeQuery('ROLLBACK');
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes('Inventário com o documento')) {
      throw new Error(errorMessage);
    }

    throw new Error('Ocorreu um erro, verifique se o arquivo CSV está seguindo a planilha de modelo e se está em formato UTF-8');
  }
};

export const fetchInventories = async (): Promise<Inventory[]> => {
  return await fetchAll<Inventory>('SELECT * FROM inventories ORDER BY importDate DESC;');
};

export const fetchOpenInventories = async (): Promise<Inventory[]> => {
  return await fetchAll<Inventory>('SELECT * FROM inventories WHERE status IS NOT 2 ORDER BY importDate DESC;');
};

export const fetchAllLocationsFromInventory = async (inventoryId: number): Promise<InventoryLocation[]> => {
  try {
    const database: SQLiteDatabase = await getDatabase();

    // Consulta SQL para agrupar por localização
    const sql = `
      SELECT 
        MIN(id) AS id, -- Usa MIN(id) para garantir um id único por localização
        inventory_id,
        COALESCE(reportedLocation, expectedLocation) AS location,
        COUNT(*) AS totalItems,
        SUM(CASE WHEN reportedQuantity IS NOT NULL THEN 1 ELSE 0 END) AS countedItems,
        CASE 
          -- Status 0: Não iniciada (nenhum item contado)
          WHEN SUM(CASE WHEN reportedQuantity IS NOT NULL THEN 1 ELSE 0 END) = 0 THEN 0
          -- Status 2: Finalizada (todos os itens contados)
          WHEN SUM(CASE WHEN reportedQuantity IS NOT NULL THEN 1 ELSE 0 END) = COUNT(*) THEN 2
          -- Status 1: Em andamento (alguns itens contados, mas nem todos)
          ELSE 1
        END AS status
      FROM inventory_items
      WHERE inventory_id = ?
      GROUP BY COALESCE(reportedLocation, expectedLocation)
    `;

    // Executa a consulta com o inventoryId como parâmetro
    const result = await database.getAllAsync(sql, [inventoryId]);

    // Mapeia o resultado para o tipo InventoryLocation
    const locations: InventoryLocation[] = result.map((row: any) => ({
      id: row.id,
      inventory_id: row.inventory_id,
      location: row.location,
      status: row.status,
      totalItems: row.totalItems,
      countedItems: row.countedItems,
    }));

    return locations;
  } catch (error) {
    console.error('Erro ao buscar localizações do inventário:', error);
    throw error;
  }
};

export const fetchInventoryItemsForLocation = async (inventoryId: number, location: string): Promise<InventoryItem[]> => {
  try {
    const database: SQLiteDatabase = await getDatabase();
    const sql = `
      SELECT * FROM inventory_items
      WHERE inventory_id = ? AND COALESCE(reportedLocation, expectedLocation) = ?
    `;
    const result = await database.getAllAsync(sql, [inventoryId, location]);
    return result as InventoryItem[];
  } catch (error) {
    console.error('Erro ao buscar itens da localização:', error);
    throw error;
  }
};

export const checkItemExistsInOtherLocation = async (inventoryId: number, code: string, location: string): Promise<{ exist: boolean, expectedLocation: string }> => {
  const sql = `
    SELECT COUNT(*) as count, COALESCE(reportedLocation, expectedLocation) as location FROM inventory_items
    WHERE inventory_id = ? AND code = ? AND COALESCE(reportedLocation, expectedLocation) != ?
  `;
  const results = await fetchAll<{ count: number, location: string }>(sql, [inventoryId, code, location]);
  if (results[0].location == "") return { exist: false, expectedLocation: '' };
  return { exist: results[0].count > 0, expectedLocation: results[0].location };
};

export const checkItemAlreadyCountedInOtherLocation = async (inventoryId: number, code: string, location: string ): Promise<{ alreadyCounted: boolean, previousData?: { local: string, id: string, reportedQuantity: number } }> => {
  const sql = `
    SELECT COALESCE(reportedLocation, expectedLocation) as location, id, reportedQuantity FROM inventory_items
    WHERE inventory_id = ? AND code = ? AND reportedQuantity IS NOT NULL AND COALESCE(reportedLocation, expectedLocation) != ?
    LIMIT 1
  `;
  const results = await fetchAll<{ location: string, id: string, reportedQuantity: number }>(sql, [inventoryId, code, location]);
  return { alreadyCounted: results.length > 0, previousData: { local: results[0]?.location, id: results[0]?.id, reportedQuantity: results[0]?.reportedQuantity } };
};

export const sumPreviousCount = async (
  inventoryId: number,
  code: string,
  previousLocation: { local: string , id: string, reportedQuantity: number },
  additionalQuantity: number
): Promise<{ rowsAffected: number }> => {
  console.log(inventoryId, code, previousLocation, additionalQuantity)
  const sql = `
    UPDATE inventory_items SET
      reportedQuantity = COALESCE(reportedQuantity, 0) + ?
    WHERE inventory_id = ? AND code = ? AND COALESCE(reportedLocation, expectedLocation) = ?
  `;
  const result = await executeQuery(sql, [additionalQuantity, inventoryId, code, previousLocation.local]);
  console.log(result)
  return { rowsAffected: result.changes || 0 };
};

const BATCH_SIZE = 50; // Processa 50 itens por vez

const insertItemsInBatches = async (inventoryId: number, items: ImportedInventoryItem[]): Promise<void> => {
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(item => insertInventoryItem(inventoryId, item)));
  }
};

export const updateItemCount = async (
  itemId: number,
  item: {
    reportedQuantity: number;
    reportedLocation: string;
    batch?: string;
    observation: string;
    operator: string;
    status: number;
    countTime: string;
  }
): Promise<void> => {
  await executeQuery(
    `UPDATE inventory_items SET reportedQuantity = ?, reportedLocation = ?, batch = ?, observation = ?, operator = ?, status = ?, countTime = ? WHERE id = ?;`,
    [item.reportedQuantity, item.reportedLocation, item.batch, item.observation, item.operator, item.status, item.countTime, itemId]
  );
};

export const updateInventoryStatus = async (id: number, status: number, operation: "Add" | "Update" | "Finalize"): Promise<void> => {
  if(operation == "Add"){
    await executeQuery('UPDATE inventories SET status = ?, hasSurplusMaterial = ? WHERE id = ?;', [status, true, id]);
    return;
  }

  await executeQuery('UPDATE inventories SET status = ? WHERE id = ?;', [status, id]);
};

export const updateInventoryCountedItems = async (inventoryID: number, counted: number): Promise<void> => {
  await executeQuery(`UPDATE inventories SET countedItems = ? WHERE id = ?`, [counted, inventoryID]);
};

export const updateInventoryTotalItems = async (inventoryID: number, total: number): Promise<void> => {
  await executeQuery(`UPDATE inventories SET totalItems = ? WHERE id = ?`, [total, inventoryID]);
};

export const fetchInventoryById = async (id: number): Promise<Inventory | null> => {
  const result = await fetchAll<Inventory>('SELECT * FROM inventories WHERE id = ?;', [id]);
  return result[0] || null;
};

export const insertInventoryItem = async (inventoryId: number, item: ImportedInventoryItem): Promise<void> => {
  await executeQuery(
    `INSERT INTO inventory_items (
      inventory_id, inventoryDocument, year, center, storage, batch,
      inventoryItem, unit, averagePrice, code, description,
      expectedLocation, expectedQuantity, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);`,
    [
      String(inventoryId),
      String(item.inventoryDocument || ''),
      String(item.year || ''),
      String(item.center || ''),
      String(item.storage || ''),
      String(item.batch || ''),
      String(item.inventoryItem || ''),
      String(item.unit || ''),
      String(item.averagePrice || ''),
      String(item.code || ''),
      String(item.description || ''),
      String(item.expectedLocation || ''),
      String(item.expectedQuantity || ''),
    ]
  );
};

export const insertNewInventoryItem = async (
  inventoryId: number,
  data: {
    code: string;
    reportedQuantity: number;
    reportedLocation: string;
    batch?: string | "";
    observation: string;
    operator: string;
    status: number;
    countTime: string;
  }
): Promise<void> => {
  const inventoryItems = await fetchItemsByInventoryId(inventoryId);
  const lastItem = Math.max(...inventoryItems.map((i: any) => Number(i.inventoryItem)));

  await executeQuery(
    `INSERT INTO inventory_items (inventory_id, inventoryItem, code, reportedQuantity, reportedLocation, batch, observation, operator, status, countTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      inventoryId,
      Number(lastItem) + 1,
      data.code,
      data.reportedQuantity,
      data.reportedLocation,
      data.batch,
      data.observation,
      data.operator,
      data.status,
      data.countTime
    ]
  );
};

export const fetchItemByCode = async (inventoryId: number, materialCode: string): Promise<Item[]> => {
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

export const fetchItemById = async (inventoryId: number, itemId: number): Promise<Item[]> => {
  return await fetchAll<Item>(
    `SELECT * FROM inventory_items WHERE inventory_id = ? AND id = ?`,
    [inventoryId, itemId]
  );
};

export const fetchDescriptionByCode = async (inventoryId: number, code: string): Promise<Item[]> => {
  return await fetchAll<Item>(
    `SELECT description, batch, unit FROM inventory_items WHERE inventory_id = ? AND code = ? LIMIT 1;`,
    [inventoryId, code]
  );
};

export const deleteInventory = async (inventoryId: number): Promise<void> => {
  await executeQuery(
    `
    DELETE FROM inventories WHERE id = ?;
    DELETE FROM inventory_items WHERE inventory_id = ?
    `,
    [inventoryId, inventoryId]
  );
};

const formatQuantity = (value: string | number): number => {
  if (typeof value === 'number') return Math.floor(value);

  // Substitui pontos por nada e vírgulas por pontos
  const numericString = value
    .replace(/\./g, '')
    .replace(/,/g, '.');

  return Math.floor(parseFloat(numericString));
};

export const getBatchesForItem = async (inventoryId: number, materialCode: string): Promise<BatchOption[]> => {
  try {
    const query = `
      SELECT batch
      FROM inventory_items 
      WHERE 
        inventory_id = ? AND 
        code = ? AND
        status != 5
      ORDER BY batch
    `;
    return await fetchAll<BatchOption>(query, [inventoryId, materialCode]);
  } catch (error) {
    console.error('Error fetching batches:', error);
    return [];
  }
};