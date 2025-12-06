// __tests__/gmi.test.ts
import { jest } from '@jest/globals';

/**
 * Arquivo de testes unificado (dividido em partes no chat).
 * Parte 1 — mocks, imports e blocos iniciais (database, password, operators, xlsx)
 *
 * Paths assumidos (conforme seu projeto):
 *  - src/services/*
 *  - src/models/*
 *  - src/types/types
 */

// ---------------------------
// MOCKS GLOBAIS (expo / natives / libs)
// ---------------------------
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(() => ({
    execAsync: jest.fn(async () => {}),
    runAsync: jest.fn(async () => ({ changes: 1, lastInsertRowId: 1 })),
    getAllAsync: jest.fn(async () => []),
    getFirstAsync: jest.fn(async () => ({ version: 1 })),
  })),
}));

jest.mock('expo-file-system', () => {
  class MockFile {
    exists = true;
    uri = '/mock/file.xlsx';
    size = 100;
    async info() { return { exists: true, size: 100 }; }
    async text() { return 'INVENTÁRIO,ANO,CENTRO,DEPÓSITO,LOTE,ITEM,MATERIAL,DESCRIÇÃO,ESTOQUE,UN,PREÇO MÉDIO,POSIÇÃO NO DEPÓSITO\n'; }
    async delete() { return true; }
    async create(opts?: any) { return true; }
    async write(_data: any) { return true; }
  }
  return {
    File: MockFile,
    Paths: { document: '/mock' },
  };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(async () => null),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(async () => []),
}));

jest.mock('papaparse', () => ({
  parse: jest.fn((_content: any, opts: any) => {
    const cb = opts?.complete;
    if (typeof cb === 'function') cb({ data: [], errors: [], meta: {} });
  }),
}));

jest.mock('xlsx', () => ({
  utils: {
    json_to_sheet: jest.fn(() => ({})),
    book_new: jest.fn(() => ({})),
    book_append_sheet: jest.fn(),
    sheet_to_json: jest.fn(() => [{ code: 'X', qty: 1 }])
  },
  write: jest.fn(() => new Uint8Array([1, 2, 3])),
}));

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn(async () => true),
}));

// ---------------------------
// IMPORTS REAIS
// ---------------------------
import * as db from '../src/services/database';
import * as fileService from '../src/services/fileService';
import * as passwordService from '../src/services/passwordService';
import * as xlsxService from '../src/services/xlsxService';
import { InventoryService } from '../src/services/inventoryService';
import * as inventoryModel from '../src/models/inventory';
import * as operatorsModel from '../src/models/operators';

import type { Item, Inventory, ImportedInventoryItem, Operator } from '../src/types/types';

// ---------------------------
// UTIL / HELPERS
// ---------------------------
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

const baseItem = (overrides: Partial<Item> = {}): Item => ({
  id: 10,
  inventory_id: 1,
  inventoryDocument: 'DOC-1',
  year: '2025',
  center: 'C1',
  storage: 'S1',
  batch: '',
  inventoryItem: '1',
  unit: 'UN',
  lock: '',
  completeDescription: 'Desc',
  code: 'ABC',
  description: 'Produto ABC',
  expectedLocation: 'A1',
  reportedLocation: '',
  expectedQuantity: 10,
  reportedQuantity: 0,
  status: 0,
  observation: '',
  operator: '',
  countTime: '',
  ...overrides
});

const baseInventory = (overrides: Partial<Inventory> = {}): Inventory => ({
  id: 1,
  fileName: 'file.csv',
  fileUri: '/mock/file.csv',
  importDate: new Date().toLocaleDateString(),
  inventoryYear: '2025',
  status: 0,
  totalItems: 1,
  countedItems: 0,
  inventoryDocument: 'DOC-1',
  countType: 1,
  hasSurplusMaterial: false,
  ...overrides
});

// ---------------------------
// TESTS: DATABASE (sanity)
// ---------------------------
describe('database sanity', () => {
  test('getDatabase/executeQuery/fetchAll devem funcionar com mocks', async () => {
    const dbInst = await db.getDatabase();
    expect(dbInst).toBeTruthy();

    const res = await db.executeQuery('SELECT 1');
    expect(res).toBeDefined();

    const rows = await db.fetchAll('SELECT * FROM inventory_items');
    expect(Array.isArray(rows)).toBe(true);
  });
});

// ---------------------------
// TESTS: passwordService
// ---------------------------
describe('passwordService', () => {
  test('hasMasterPassword false quando tabela vazia', async () => {
    jest.spyOn(db, 'fetchAll').mockResolvedValue([]);
    const has = await passwordService.hasMasterPassword();
    expect(has).toBe(false);
  });

  test('setMasterPassword e verifyMasterPassword', async () => {
    const spyExec = jest.spyOn(db, 'executeQuery').mockResolvedValue({ changes: 1 } as any);
    await passwordService.setMasterPassword('senha123');
    expect(spyExec).toHaveBeenCalled();

    jest.spyOn(db, 'fetchAll').mockResolvedValue([{ master_password: 'senha123' }]);
    const ok = await passwordService.verifyMasterPassword('senha123');
    expect(ok).toBe(true);
  });
});

// ---------------------------
// TESTS: operators (CRUD)
// ---------------------------
describe('operators model', () => {
  test('insertOperator chama executeQuery', async () => {
    const spy = jest.spyOn(db, 'executeQuery').mockResolvedValue({ lastInsertRowId: 5 } as any);
    const r = await operatorsModel.insertOperator('Nome', '001');
    expect(spy).toHaveBeenCalled();
    expect(r).toBeDefined();
  });

  test('fetchOperator retorna array', async () => {
    jest.spyOn(db, 'fetchAll').mockResolvedValue([{ id: 1, name: 'Op', code: '01' }]);
    const list = await operatorsModel.fetchOperator();
    expect(Array.isArray(list)).toBe(true);
    expect(list[0].name).toBe('Op');
  });

  test('updateOperator e deleteOperator', async () => {
    const spyExec = jest.spyOn(db, 'executeQuery').mockResolvedValue({ changes: 1 } as any);
    await operatorsModel.updateOperator(1, 'Novo', '002');
    await operatorsModel.deleteOperator(1);
    expect(spyExec).toHaveBeenCalled();
  });

  test('fetchOperatorById retorna null quando vazio', async () => {
    jest.spyOn(db, 'fetchAll').mockResolvedValue([]);
    const r = await operatorsModel.fetchOperatorById(999);
    expect(r).toBeNull();
  });
});

// ---------------------------
// TESTS: xlsxService helpers + exports (mocked)
// ---------------------------
describe('xlsxService', () => {
  test('getOperatorName / getOperatorCode', () => {
    const ops: Operator[] = [
      { id: 1, name: 'João', code: 'A1' },
      { id: 2, name: 'Maria', code: 'B2' },
    ];
    expect(xlsxService.getOperatorName(ops, '1')).toBe('João');
    expect(xlsxService.getOperatorCode(ops, '2')).toBe('B2');
  });

  test('exportModelSheet e exportInventoryToExcel retornam true mockados', async () => {
    jest.spyOn(operatorsModel, 'fetchOperator').mockResolvedValue([{ id: 1, name: 'João', code: 'A1' }]);
    const resModel = await xlsxService.exportModelSheet();
    const resInv = await xlsxService.exportInventoryToExcel([{ ...baseItem(), reportedQuantity: 5 } as any]);
    expect(resModel).toBe(true);
    expect(resInv).toBe(true);
  });

  test('exportSurplusMaterialToExcel retorna true com dados excedentes', async () => {
    jest.spyOn(operatorsModel, 'fetchOperator').mockResolvedValue([{ id: 1, name: 'João', code: 'A1' }]);
    const res = await xlsxService.exportSurplusMaterialToExcel([{ ...baseItem(), status: 5 } as any], 'DOC-1');
    expect(res).toBe(true);
  });
});


// ---------------------------
// TESTS: fileService (preview / storage / format)
// ---------------------------
describe('fileService', () => {
  test('formatSizeUnits formata corretamente', () => {
    expect(fileService.formatSizeUnits(1073741824)).toContain('GB');
    expect(fileService.formatSizeUnits(1048576)).toContain('MB');
    expect(fileService.formatSizeUnits(2048)).toContain('KB');
    expect(fileService.formatSizeUnits(1)).toContain('byte');
    expect(fileService.formatSizeUnits(0)).toBe('0 bytes');
  });

  test('save/get/clear SelectedFileInfo via AsyncStorage', async () => {
    const spySet = jest.spyOn(require('@react-native-async-storage/async-storage'), 'setItem').mockResolvedValue(undefined as any);
    const spyGet = jest.spyOn(require('@react-native-async-storage/async-storage'), 'getItem').mockResolvedValue(
      JSON.stringify({ fileUri: '/u', fileName: 'f' })
    );

    await fileService.saveSelectedFileInfo('/u', 'f');
    const info = await fileService.getSelectedFileInfo();
    expect(info?.fileName).toBe('f');

    spySet.mockRestore();
    spyGet.mockRestore();
  });

  test('generateCSVPreview lança quando URI faltando ou extensão inválida', async () => {
    const badDoc: any = { uri: '', name: 'not.csv' };
    await expect(fileService.generateCSVPreview(badDoc)).rejects.toThrow();
  });

  test('loadCSVPreview agrega resultados (Papa.parse mock)', async () => {
    const doc1: any = { uri: '/mock/1.csv', name: 'a.csv' };
    const doc2: any = { uri: '/mock/2.csv', name: 'b.csv' };
    const res = await fileService.loadCSVPreview([doc1, doc2]);
    expect(res.fileQuantity).toBe(2);
  });
});

// ---------------------------
// InventoryService — FLUXOS COMPLETOS
// ---------------------------
describe('InventoryService - cenários completos', () => {
  const mkItem = (o: Partial<Item> = {}) => baseItem(o);
  const mkInv = (o: Partial<Inventory> = {}) => baseInventory(o);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // ---------- 1. Código não preenchido / localização não preenchida / quantidade 0 ----------
  test('updateItem – quantidade zero → quantity_mismatch', async () => {
    jest.spyOn(inventoryModel, 'fetchItemById').mockResolvedValue([
      mkItem({ expectedQuantity: 10 })
    ]);
    jest.spyOn(inventoryModel, 'fetchInventoryById').mockResolvedValue(mkInv());

    const r = await InventoryService.updateItem(
      10,
      1,
      { reportedQuantity: 0, reportedLocation: 'A1', observation: '', operator: '' },
    );

    expect(r.success).toBe(false);
    expect(r.errors).toContain('quantity_mismatch');
  });

  test('updateItem – localização vazia → location_mismatch', async () => {
    jest.spyOn(inventoryModel, 'fetchItemById').mockResolvedValue([
      mkItem({ expectedLocation: 'A1' })
    ]);
    jest.spyOn(inventoryModel, 'fetchInventoryById').mockResolvedValue(mkInv());

    const r = await InventoryService.updateItem(
      10,
      1,
      { reportedQuantity: 10, reportedLocation: '', observation: '', operator: '' },
    );

    expect(r.success).toBe(false);
    expect(r.errors).toContain('location_mismatch');
  });

  test('updateItem – item inexistente → item_not_found', async () => {
    jest.spyOn(inventoryModel, 'fetchItemById').mockResolvedValue([]);
    const r = await InventoryService.updateItem(99, 1, { reportedQuantity: 1, reportedLocation: 'A1', observation: '', operator: '' });
    expect(r.success).toBe(false);
    expect(r.error).toBe('item_not_found');
  });

  // ---------- 2. Código com posição errada / quantidade errada / ambos ----------
  test('updateItem – divergências duplas', async () => {
    jest.spyOn(inventoryModel, 'fetchItemById').mockResolvedValue([
      mkItem({ expectedQuantity: 10, expectedLocation: 'A1' })
    ]);
    jest.spyOn(inventoryModel, 'fetchInventoryById').mockResolvedValue(mkInv());

    const r = await InventoryService.updateItem(
      10,
      1,
      { reportedQuantity: 5, reportedLocation: 'B2', observation: '', operator: '' },
    );

    expect(r.success).toBe(false);
    expect(r.errors).toContain('quantity_mismatch');
    expect(r.errors).toContain('location_mismatch');
  });

  // ---------- 3. Item já contabilizado ----------
  test('updateItem – already_counted', async () => {
    jest.spyOn(inventoryModel, 'fetchItemById').mockResolvedValue([
      mkItem({ reportedQuantity: 4, reportedLocation: 'A1' })
    ]);
    jest.spyOn(inventoryModel, 'fetchInventoryById').mockResolvedValue(mkInv());

    const r = await InventoryService.updateItem(
      10,
      1,
      { reportedQuantity: 3, reportedLocation: 'A1', observation: '', operator: '' },
    );

    expect(r.success).toBe(false);
    expect(r.error).toBe('already_counted');
  });

  // ---------- 4. Código com lote ----------
  test('getItemByCodeAndBatch lança erro se não encontra', async () => {
    jest.spyOn(inventoryModel, 'fetchItemByCodeAndBatch').mockResolvedValue([]);
    await expect(
      InventoryService.getItemByCodeAndBatch(1, 'ABC', 'L1')
    ).rejects.toThrow();
  });

  // ---------- 5. ADDNEWITEM — código existe em outra posição ----------
  test('addNewItem – exists_in_other_location (countType=2)', async () => {
    jest.spyOn(inventoryModel, 'fetchInventoryById').mockResolvedValue(mkInv({ countType: 2 }));
    jest.spyOn(inventoryModel, 'checkItemExistsInOtherLocation').mockResolvedValue({
      exist: true,
      expectedLocation: 'Z9',
    });

    const r = await InventoryService.addNewItem(1, {
      code: 'ABC',
      reportedQuantity: 1,
      reportedLocation: 'A1',
      unit: 'UN',
      observation: '',
      operator: '',
    } as any);

    expect(r.success).toBe(false);
    expect(r.error).toBe('exists_in_other_location');
  });

  // ---------- 6. ADDNEWITEM — já contabilizado em outra posição ----------
  test('addNewItem – already_counted_in_other', async () => {
    jest.spyOn(inventoryModel, 'fetchInventoryById').mockResolvedValue(mkInv({ countType: 2 }));
    jest.spyOn(inventoryModel, 'checkItemAlreadyCountedInOtherLocation').mockResolvedValue({
      alreadyCounted: true,
      previousData: { local: 'B9', id: '10', reportedQuantity: 2 },
    });

    const r = await InventoryService.addNewItem(1, {
      code: 'ABC',
      reportedQuantity: 5,
      reportedLocation: 'A1',
      unit: 'UN',
      observation: '',
      operator: '',
    } as any);

    expect(r.success).toBe(false);
    expect(r.error).toBe('already_counted_in_other');
  });

  // ---------- 7. ADDNEWITEM — sucesso ----------
  test('addNewItem – caminho feliz', async () => {
    jest.spyOn(inventoryModel, 'fetchInventoryById').mockResolvedValue(mkInv());
    jest.spyOn(inventoryModel, 'fetchItemsByInventoryId').mockResolvedValue([{ inventoryItem: '1' }] as any);

    jest.spyOn(inventoryModel, 'insertNewInventoryItem').mockResolvedValue(undefined);
    jest.spyOn(inventoryModel, 'updateInventoryTotalItems').mockResolvedValue(undefined);
    jest.spyOn(inventoryModel, 'updateInventoryCountedItems').mockResolvedValue(undefined);
    jest.spyOn(inventoryModel, 'updateInventoryStatus').mockResolvedValue(undefined);

    const r = await InventoryService.addNewItem(1, {
      code: 'XYZ',
      reportedQuantity: 2,
      reportedLocation: 'A1',
      unit: 'UN',
      observation: '',
      operator: '',
    } as any);

    expect(r.success).toBe(true);
  });

  // ---------- 8. replaceItem ----------
  test('replaceItem – inventory_not_found', async () => {
    jest.spyOn(inventoryModel, 'fetchInventoryById').mockResolvedValue(null);
    const r = await InventoryService.replaceItem(1, 10, {
      reportedQuantity: 1, reportedLocation: 'A1', observation: '', operator: ''
    } as any);

    expect(r.success).toBe(false);
    expect(r.error).toBe('inventory_not_found');
  });

  test('replaceItem – sucesso', async () => {
    jest.spyOn(inventoryModel, 'fetchInventoryById').mockResolvedValue(mkInv());
    const spy = jest.spyOn(inventoryModel, 'updateItemCount').mockResolvedValue(undefined);

    const r = await InventoryService.replaceItem(1, 10, {
      reportedQuantity: 1, reportedLocation: 'A1', observation: '', operator: ''
    } as any);

    expect(r.success).toBe(true);
    expect(spy).toHaveBeenCalled();
  });

  // ---------- 9. sumToPreviousCount ----------
  test('sumToPreviousCount – sucesso', async () => {
    jest.spyOn(inventoryModel, 'sumPreviousCount').mockResolvedValue({ rowsAffected: 1 });
    const r = await InventoryService.sumToPreviousCount(1, 'X', { local: 'A1', id: '10', reportedQuantity: 2 }, 3);
    expect(r.success).toBe(true);
  });

  test('sumToPreviousCount – falha (rowsAffected 0)', async () => {
    jest.spyOn(inventoryModel, 'sumPreviousCount').mockResolvedValue({ rowsAffected: 0 });
    const r = await InventoryService.sumToPreviousCount(1, 'X', { local: 'A1', id: '10', reportedQuantity: 2 }, 3);
    expect(r.success).toBe(false);
  });

  // ---------- 10. finalizeInventory ----------
  test('finalizeInventory – not found', async () => {
    jest.spyOn(inventoryModel, 'fetchInventoryById').mockResolvedValue(null);
    const r = await InventoryService.finalizeInventory(1);
    expect(r.success).toBe(false);
    expect(r.error).toBe('inventory_not_found');
  });

  test('finalizeInventory – already completed', async () => {
    jest.spyOn(inventoryModel, 'fetchInventoryById').mockResolvedValue(mkInv({ status: 2 }));
    const r = await InventoryService.finalizeInventory(1);
    expect(r.success).toBe(false);
    expect(r.error).toBe('inventory_already_completed');
  });

  test('finalizeInventory – sucesso', async () => {
    jest.spyOn(inventoryModel, 'fetchInventoryById').mockResolvedValue(mkInv({ status: 1 }));
    jest.spyOn(inventoryModel, 'updateInventoryStatus').mockResolvedValue(undefined);
    const r = await InventoryService.finalizeInventory(1);
    expect(r.success).toBe(true);
  });
});

// ---------------------------
// barcode / posição / filtros
// ---------------------------
describe('Barcode & Position & Filters', () => {
  const mkItem = (o: Partial<Item> = {}) => baseItem(o);

  test('getItemByCode retorna undefined se não achar', async () => {
    jest.spyOn(inventoryModel, 'fetchItemByCode').mockResolvedValue([]);
    const r = await InventoryService.getItemByCode(1, 'XXX');
    expect(r).toBeUndefined();
  });

  test('fetchInventories delega', async () => {
    jest.spyOn(db, 'fetchAll').mockResolvedValue([{ id: 1 }]);
    const res = await inventoryModel.fetchInventories();
    expect(Array.isArray(res)).toBe(true);
  });

  test('fetchOpenInventories delega', async () => {
    jest.spyOn(db, 'fetchAll').mockResolvedValue([{ id: 1 }]);
    const res = await inventoryModel.fetchOpenInventories();
    expect(Array.isArray(res)).toBe(true);
  });
});


// ---------------------------
// insertInventory — CASOS COMPLETOS (FULL)
// ---------------------------
describe("insertInventory – cenários completos", () => {
  const MockFile = require("expo-file-system").File;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  // ---------- arquivo inexistente ----------
  test("arquivo não encontrado → Erro ao obter informações", async () => {
    jest.spyOn(MockFile.prototype, "info").mockRejectedValueOnce(new Error("fail"));
    await expect(
      inventoryModel.insertInventory("/fake.csv", "fake.csv", 1)
    ).rejects.toThrow(/Erro ao obter informações/);
  });

  // ---------- arquivo > 6MB ----------
  test("arquivo maior que 6MB → erro", async () => {
    jest.spyOn(MockFile.prototype, "info").mockResolvedValue({ exists: true, size: 7 * 1024 * 1024 });

    await expect(
      inventoryModel.insertInventory("/big.csv", "big.csv", 1)
    ).rejects.toThrow(/muito grande/i);
  });

  // ---------- caractere inválido (UTF-8) ----------
  test("arquivo com caractere inválido → erro UTF-8", async () => {
    jest.spyOn(MockFile.prototype, "info").mockResolvedValue({ exists: true, size: 10 });
    jest.spyOn(MockFile.prototype, "text").mockResolvedValue("ABC � XYZ");

    await expect(
      inventoryModel.insertInventory("/invalid.csv", "invalid.csv", 1)
    ).rejects.toThrow(/UTF-8/i);
  });

  // ---------- CSV vazio ----------
  test("CSV sem itens válidos → Nenhum item válido encontrado", async () => {
    jest.spyOn(MockFile.prototype, "info").mockResolvedValue({ exists: true, size: 10 });
    jest.spyOn(MockFile.prototype, "text").mockResolvedValue(
      "INVENTÁRIO,ANO,CENTRO,DEPÓSITO,LOTE,ITEM,MATERIAL,DESCRIÇÃO\n"
    );

    const papa = require("papaparse");
    papa.parse.mockImplementationOnce((_c: any, opts: any) => {
      opts.complete({ data: [] });
    });

    await expect(
      inventoryModel.insertInventory("/empty.csv", "empty.csv", 1)
    ).rejects.toThrow(/Nenhum item válido/);
  });

  // ---------- Inventário duplicado ----------
  test("inventário duplicado → erro Claro", async () => {
    jest.spyOn(MockFile.prototype, "info").mockResolvedValue({ exists: true, size: 10 });
    jest.spyOn(MockFile.prototype, "text").mockResolvedValue(
      "INVENTÁRIO,ANO,CENTRO,DEPÓSITO,LOTE,ITEM,MATERIAL,DESCRIÇÃO,ESTOQUE,UN,PREÇO MÉDIO,POSIÇÃO NO DEPÓSITO\n" +
      "INV1,2024,C1,S1,,1,AA,desc,1,UN,0,A1"
    );

    const papa = require("papaparse");
    papa.parse.mockImplementationOnce((_content: any, opts: any) => {
      opts.complete({
        data: [{
          "INVENTÁRIO": "INV1",
          "ANO": "2024",
          "CENTRO": "C1",
          "DEPÓSITO": "S1",
          "ITEM": "1",
          "MATERIAL": "AA",
          "DESCRIÇÃO": "desc",
          "ESTOQUE": "1",
          "UN": "UN",
          "PREÇO MÉDIO": "0",
          "POSIÇÃO NO DEPÓSITO": "A1"
        }]
      });
    });

    jest.spyOn(db, "fetchAll").mockResolvedValue([{ id: 10 }] as any);

    await expect(
      inventoryModel.insertInventory("/i.csv", "i.csv", 1)
    ).rejects.toThrow(/já foi inserido/i);
  });

  // ---------- CSV válido (1 inventário) ----------
  test("insertInventory cria inventário único quando válido", async () => {
    jest.spyOn(MockFile.prototype, "info").mockResolvedValue({ exists: true, size: 100 });
    jest.spyOn(MockFile.prototype, "text").mockResolvedValue(
      "INVENTÁRIO,ANO,CENTRO,DEPÓSITO,LOTE,ITEM,MATERIAL,DESCRIÇÃO,ESTOQUE,UN,PREÇO MÉDIO,POSIÇÃO NO DEPÓSITO\n" +
      "INV1,2024,C1,S1,,1,AA,desc,10,UN,0,A1"
    );

    const papa = require("papaparse");
    papa.parse.mockImplementationOnce((_content: any, opts: any) => {
      opts.complete({
        data: [{
          "INVENTÁRIO": "INV1",
          "ANO": "2024",
          "CENTRO": "C1",
          "DEPÓSITO": "S1",
          "ITEM": "1",
          "MATERIAL": "AA",
          "DESCRIÇÃO": "desc",
          "ESTOQUE": "10",
          "UN": "UN",
          "PREÇO MÉDIO": "0",
          "POSIÇÃO NO DEPÓSITO": "A1"
        }]
      });
    });

    jest.spyOn(db, "fetchAll").mockResolvedValue([]); // inventário não existe

    jest.spyOn(db, "executeQuery").mockImplementation(async (sql: string) => {
      if (sql.includes("INSERT INTO inventories")) {
        return { lastInsertRowId: 100, changes: 1 };
      }
      return { changes: 1 };
    });

    jest.spyOn(inventoryModel as any, "insertItemsInBatches").mockResolvedValue(undefined);

    const r = await inventoryModel.insertInventory("/ok.csv", "ok.csv", 1);
    expect(r.success).toBe(true);
    expect(r.inventories.length).toBe(1);
    expect(r.inventories[0].inventoryId).toBe(100);
  });

  // ---------- CSV com 2 inventários distintos ----------
  test("CSV com 2 inventários → cria ambos", async () => {
    jest.spyOn(MockFile.prototype, "info").mockResolvedValue({ exists: true, size: 100 });
    jest.spyOn(MockFile.prototype, "text").mockResolvedValue(
      "INVENTÁRIO,ANO,CENTRO,DEPÓSITO,LOTE,ITEM,MATERIAL,DESCRIÇÃO,ESTOQUE,UN,PREÇO MÉDIO,POSIÇÃO NO DEPÓSITO\n" +
      "INV1,2024,C1,S1,,1,AA,desc,10,UN,0,A1\n" +
      "INV2,2024,C1,S1,,1,BB,desc,5,UN,0,A2\n"
    );

    const papa = require("papaparse");
    papa.parse.mockImplementationOnce((_c: any, opts: any) => {
      opts.complete({
        data: [
          {
            "INVENTÁRIO": "INV1",
            "ANO": "2024",
            "CENTRO": "C1",
            "DEPÓSITO": "S1",
            "ITEM": "1",
            "MATERIAL": "AA",
            "DESCRIÇÃO": "desc",
            "ESTOQUE": "10",
            "UN": "UN",
            "PREÇO MÉDIO": "0",
            "POSIÇÃO NO DEPÓSITO": "A1"
          },
          {
            "INVENTÁRIO": "INV2",
            "ANO": "2024",
            "CENTRO": "C1",
            "DEPÓSITO": "S1",
            "ITEM": "1",
            "MATERIAL": "BB",
            "DESCRIÇÃO": "desc",
            "ESTOQUE": "5",
            "UN": "UN",
            "PREÇO MÉDIO": "0",
            "POSIÇÃO NO DEPÓSITO": "A2"
          }
        ]
      });
    });

    jest.spyOn(db, "fetchAll").mockResolvedValue([]); // nenhum duplicado

    jest.spyOn(db, "executeQuery").mockImplementation(async (sql: string) => {
      if (sql.includes("INSERT INTO inventories")) {
        return { lastInsertRowId: Math.floor(Math.random() * 900) + 10, changes: 1 };
      }
      return { changes: 1 };
    });

    jest.spyOn(inventoryModel as any, "insertItemsInBatches").mockResolvedValue(undefined);

    const r = await inventoryModel.insertInventory("/ok.csv", "ok.csv", 1);

    expect(r.success).toBe(true);
    expect(r.inventories.length).toBe(2);
  });

  // ---------- Erro genérico → rollback ----------
  test("erro genérico dispara rollback", async () => {
    jest.spyOn(MockFile.prototype, "info").mockResolvedValue({ exists: true, size: 10 });
    jest.spyOn(MockFile.prototype, "text").mockResolvedValue("AAA");

    const papa = require("papaparse");
    papa.parse.mockImplementationOnce((_c: any, opts: any) => {
      throw new Error("falha parse");
    });

    const spyExec = jest.spyOn(db, "executeQuery");

    await expect(
      inventoryModel.insertInventory("/err.csv", "err.csv", 1)
    ).rejects.toThrow();

    // Deve ter sido chamado BEGIN e ROLLBACK
    expect(spyExec).toHaveBeenCalledWith("BEGIN TRANSACTION");
    expect(spyExec).toHaveBeenCalledWith("ROLLBACK");
  });
});

// ---------------------------
// FINALIZAÇÃO DO ARQUIVO
// ---------------------------
afterAll(() => {
  jest.restoreAllMocks();
});
