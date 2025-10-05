// InventoryService.ts (Service Layer: Business Logic and Validations)
import { fetchDescriptionByCode, fetchInventoryById, fetchItemByCode, fetchItemByCodeAndBatch, fetchItemById, fetchItemsByInventoryId, getBatchesForItem, insertNewInventoryItem, updateInventoryCountedItems, updateInventoryStatus, updateInventoryTotalItems, updateItemCount, checkItemExistsInOtherLocation, checkItemAlreadyCountedInOtherLocation, sumPreviousCount } from "@/models/inventory";
import { Item, Inventory, BatchOption } from "@/types/types";

export const InventoryService = {
  async getItemDescriptionByCode(inventoryId: number, code: string): Promise<Item> {
    const res = await fetchDescriptionByCode(inventoryId, code);
    if (!res || res.length === 0) throw new Error("Can't find any description for this code, try again later");
    return res[0];
  },

  async getInventory(inventoryId: number): Promise<Inventory> {
    const res = await fetchInventoryById(inventoryId);
    if (!res) throw new Error("Can't find any inventory with this ID, try again later");
    return res;
  },

  async getInventoryNumber(id: number): Promise<{ success: boolean, inventoryNumber: string }> {
    try {
      const res = await fetchItemsByInventoryId(id);
      return { success: true, inventoryNumber: res[0].inventoryDocument };
    } catch {
      return { success: false, inventoryNumber: "Undefined" };
    }
  },

  async getItemByCode(inventoryId: number, code: string): Promise<Item> {
    let res = await fetchItemByCode(inventoryId, code);
    if (!res || res.length === 0) res = [];
    return res[0];
  },

  async getItemByCodeAndBatch(inventoryId: number, code: string, batch: string): Promise<Item> {
    const res = await fetchItemByCodeAndBatch(inventoryId, code, batch);
    if (!res || res.length === 0) throw new Error("Can't find any Item with this code and batch");
    return res[0];
  },

  async getBatchesForItem(inventoryId: number, materialCode: string): Promise<BatchOption[]> {
    const batches = await getBatchesForItem(inventoryId, materialCode);
    return batches;
  },

  async updateItem(
    itemId: number,
    inventoryId: number,
    data: {
      reportedQuantity: number,
      reportedLocation: string,
      observation: string,
      operator: string,
      status?: number,
    },
    ignoreQuantity: boolean = false,
    ignoreLocation: boolean = false
  ): Promise<{ success: boolean, error?: string, errors?: string[], data?: any }> {
    try {
      const item = await fetchItemById(inventoryId, itemId);
      if (!item || item.length === 0) return { success: false, error: 'item_not_found' };

      const inventory = await fetchInventoryById(inventoryId);
      if (!inventory) return { success: false, error: 'inventory_not_found' };
      if (inventory.status === 2) return { success: false, error: 'inventory_completed' };

      if (item[0].reportedQuantity !== null) return { success: false, error: 'already_counted', data: { lastLoc: item[0].reportedLocation, lastCount: item[0].reportedQuantity } };

      // Validações de divergência
      const quantityDivergent = data.reportedQuantity !== item[0].expectedQuantity;
      const locationDivergent = data.reportedLocation !== item[0].expectedLocation;

      // Coleta todos os erros de divergência
      const errors: string[] = [];
      if (quantityDivergent && !ignoreQuantity) {
        errors.push('quantity_mismatch');
      }
      if (locationDivergent && !ignoreLocation) {
        errors.push('location_mismatch');
      }

      // Se houver erros, retorna todos de uma vez
      if (errors.length > 0) {
        return { success: false, errors };
      }

      // Calcula status baseado em divergências (mesmo se ignoradas)
      let status = 1; // Ok
      if (quantityDivergent && locationDivergent) status = 4; // Ambos divergentes
      else if (quantityDivergent) status = 2; // Quantidade divergente
      else if (locationDivergent) status = 3; // Localização divergente

      const now = new Date();
      const updateValues = {
        reportedQuantity: data.reportedQuantity,
        reportedLocation: data.reportedLocation,
        observation: data.observation,
        operator: data.operator,
        status,
        countTime: now.toLocaleDateString("pt-br")
      };

      await updateItemCount(itemId, updateValues);
      await updateInventoryCountedItems(inventoryId, inventory.countedItems + 1);
      await updateInventoryStatus(inventoryId, 1);

      return { success: true };
    } catch (error) {
      console.error("Error updating item:", error);
      return { success: false, error: 'update_failed' };
    }
  },

  async addNewItem(inventoryId: number,
    data: {
      code: string
      reportedQuantity: number,
      reportedLocation: string,
      observation: string,
      operator: string
    },
    ignoreExists: boolean = false,
    ignoreAlreadyCounted: boolean = false
  ): Promise<{ success: boolean, error?: string, data?: any }> {

    try {
      const inventory = await fetchInventoryById(inventoryId);
      if (!inventory) return { success: false, error: 'inventory_not_found' };
      if (inventory.status === 2) return { success: false, error: 'inventory_completed' };

      // Validações específicas para countType == 2 (posição)
      if (inventory.countType === 2) {
        const alreadyCounted = await checkItemAlreadyCountedInOtherLocation(inventoryId, data.code.toUpperCase(), data.reportedLocation);
        if (alreadyCounted.alreadyCounted && !ignoreAlreadyCounted) {
          return {
            success: false,
            error: 'already_counted_in_other',
            data: alreadyCounted.previousData
              ? { local: alreadyCounted.previousData.local, id: alreadyCounted.previousData.id, reportedQuantity: alreadyCounted.previousData.reportedQuantity }
              : undefined
          };
        }
        const existsInOther = await checkItemExistsInOtherLocation(inventoryId, data.code.toUpperCase(), data.reportedLocation);
        if (existsInOther.exist && !ignoreExists) return { success: false, error: 'exists_in_other_location', data: existsInOther.expectedLocation };

      }

      const now = new Date();
      const newValue = {
        code: data.code.toUpperCase(),
        reportedQuantity: data.reportedQuantity,
        reportedLocation: data.reportedLocation,
        observation: data.observation,
        operator: data.operator,
        status: 5,
        countTime: now.toLocaleDateString("pt-br")
      };

      await insertNewInventoryItem(inventoryId, newValue);
      await updateInventoryTotalItems(inventoryId, inventory.totalItems + 1);
      await updateInventoryCountedItems(inventoryId, inventory.countedItems + 1);
      await updateInventoryStatus(inventoryId, 1);

      return { success: true };
    } catch (error) {
      console.error("Error adding new item:", error);
      return { success: false, error: 'add_failed' };
    }
  },

  async replaceItem(
    inventoryId: number,
    itemId: number,
    data: {
      reportedQuantity: number,
      reportedLocation: string,
      observation: string,
      operator: string
    }
  ): Promise<{ success: boolean, error?: string }> {
    try {
      const inventory = await fetchInventoryById(inventoryId);
      if (!inventory) return { success: false, error: 'inventory_not_found' };
      if (inventory.status === 2) return { success: false, error: 'inventory_completed' };

      const now = new Date();
      const replaceValues = {
        reportedQuantity: data.reportedQuantity,
        reportedLocation: data.reportedLocation,
        observation: data.observation,
        operator: data.operator,
        status: 1,
        countTime: now.toLocaleDateString("pt-br")
      };

      await updateItemCount(itemId, replaceValues);
      return { success: true };
    } catch (error) {
      console.error("Error replacing item:", error);
      return { success: false, error: 'replace_failed' };
    }
  },

  async sumToPreviousCount(
    inventoryId: number,
    code: string,
    previousLocation: { local: string , id: string, reportedQuantity: number },
    additionalQuantity: number
  ): Promise<{ success: boolean, error?: string }> {
    try {
      const result = await sumPreviousCount(inventoryId, code.toUpperCase(), previousLocation, additionalQuantity);
      console.log(result)
      if (result.rowsAffected === 0) {
        return { success: false, error: 'item_not_found_or_not_updated' };
      }
      return { success: true };
    } catch (error) {
      console.error("Error summing to previous count:", error);
      return { success: false, error: 'sum_failed' };
    }
  },

  async finalizeInventory(inventoryId: number): Promise<{ success: boolean, error?: string }> {
    try {
      const inventory = await fetchInventoryById(inventoryId);
      if (!inventory) return { success: false, error: 'inventory_not_found' };
      if (inventory.status === 2) return { success: false, error: 'inventory_already_completed' };

      await updateInventoryStatus(inventoryId, 2);
      return { success: true };
    } catch (error) {
      console.error("Error finalizing inventory:", error);
      return { success: false, error: 'finalize_failed' };
    }
  }
};