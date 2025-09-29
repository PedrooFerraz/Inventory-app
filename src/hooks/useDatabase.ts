import { useEffect, useState } from 'react';
import { Operator, Inventory, InventoryLocation, InventoryItem } from '@/types/types';
import { fetchAllLocationsFromInventory, fetchInventories, fetchOpenInventories, fetchInventoryItemsForLocation } from '@/models/inventory';
import { fetchOperator } from '@/models/operators';

export const useDatabase = ({ inventoryId, location }: { inventoryId?: number; location?: string }) => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [openInventories, setOpenInventories] = useState<Inventory[]>([]);
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]); // Novo estado para itens
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);

      const [operatorData, inventoriesData, openInventoriesData] = await Promise.all([
        fetchOperator(),
        fetchInventories(),
        fetchOpenInventories(),
      ]);

      setOperators(operatorData);
      setInventories(inventoriesData);
      setOpenInventories(openInventoriesData);

      if (inventoryId !== undefined && inventoryId > 0) {
        const locationsData = await fetchAllLocationsFromInventory(inventoryId);
        setLocations(locationsData);
      } else {
        setLocations([]);
      }

      // Carrega itens se location for fornecido
      if (location != undefined && inventoryId !== undefined && inventoryId > 0) {
        
        let itemsData 
        if(location == ""){
            itemsData = await fetchInventoryItemsForLocation(inventoryId, "");
        }else{
          itemsData = await fetchInventoryItemsForLocation(inventoryId, location);
        }

        setItems(itemsData);
      } else {
        setItems([]);
      }

      setError(null);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [inventoryId, location]); // Dependência em location também

  return {
    operators,
    inventories,
    openInventories,
    locations,
    items,
    loading,
    error,
    refresh: loadData,
  };
};