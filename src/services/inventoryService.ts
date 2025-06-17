import { fetchDescriptionByCode, fetchInventoryById, fetchItemByCode, fetchItemById, insertNewInventoryItem, updateInventoryCountedItems, updateInventoryStatus, updateInventoryTotalItems, updateItemCount } from "@/models/inventory";
import { Item, Inventory } from "@/types/types";

export const InventoryService = {
    async getItemDescriptionByCode(inventoryId: number, code: string): Promise<string> {

        const res = await fetchDescriptionByCode(inventoryId, code)

        if (!res)
            throw new Error("Cant find any desciption for this code, try again later")

        return res[0].description

    },

    async getInventory(inventoryId: number): Promise<Inventory> {
        const res = await fetchInventoryById(inventoryId);

        if (!res)
            throw new Error("Cant find any inventory with this ID, try again later")

        return res
    },

    async getItemByCode(inventoryId: number, code: string): Promise<Item> {

        const res = await fetchItemByCode(inventoryId, code)

        if (!res)
            throw new Error("Cant find any Item with this code, try again later")

        return res[0];
    },

    async updateItem(
        itemId: number,
        inventoryId: number,
        data: {
            reportedQuantity: number,
            reportedLocation: string,
            observation: string,
            operator: string,
            status: number,
        }

    ): Promise<string> {

        const item = await fetchItemById(inventoryId, itemId)

        if (!item || item.length === 0) {
            return "Item not found";
        }

        if (item[0].status !== 0) {
            return "Item has already been accounted for"
        }
        const inventory = await fetchInventoryById(inventoryId)
        if (!inventory) {
            return "Inventory not found"
        }
        if (inventory.status == 2) {
            return "Inventory has already been completed"
        }

        const updatedCount = inventory.countedItems + 1


        const now = new Date()
        const updateValues = {
            reportedQuantity: data.reportedQuantity,
            reportedLocation: data.reportedLocation,
            observation: data.observation,
            operator: data.operator,
            status: data.status,
            countTime: now.toLocaleDateString("pt-br")
        }
        try {
            await updateInventoryCountedItems(inventoryId, updatedCount);
            await updateItemCount(itemId, updateValues);
            await updateInventoryStatus(inventoryId, 1);

            return "Item accounted for successfully";
        } catch (error) {
            console.error("Error updating item:", error);
            return "An error occurred while updating the item";
        }
    },

    async addNewItem(inventoryId: number,
        data: {
            code: string
            reportedQuantity: number,
            reportedLocation: string,
            observation: string,
            operator: string
        }) {

        const inventory = await fetchInventoryById(inventoryId)
        if (!inventory) {
            return { success: false, message: "Inventory not found" }
        }
        if (inventory.status == 2) {
            return { success: false, message: "Inventory has already been completed" }
        }
        const updatedCount = inventory.countedItems + 1
        const updateTotal = inventory.totalItems + 1


        const now = new Date()
        const newValue = {
            code: data.code,
            reportedQuantity: data.reportedQuantity,
            reportedLocation: data.reportedLocation,
            observation: data.observation,
            operator: data.operator,
            status: 5,
            countTime: now.toLocaleDateString("pt-br")
        }


        try {
            await insertNewInventoryItem(inventoryId, newValue);
            await updateInventoryTotalItems(inventoryId, updateTotal)
            await updateInventoryCountedItems(inventoryId, updatedCount);

            return { success: true, message: "Item accounted for successfully" }
        } catch (error) {
            return { success: false, message: "An error occurred while updating the item" }
        }
    }

}