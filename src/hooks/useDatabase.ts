// useDatabase.ts
import { useEffect, useState } from 'react';
import { Operator, Inventory, InventoryLocation } from '@/types/types';
import { fetchAllLocationsFromInventory, fetchInventories, fetchOpenInventories } from '@/models/inventory';
import { fetchOperator } from '@/models/operators';

export const useDatabase = ({ inventoryId }: { inventoryId?: number }) => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [openInventories, setOpenInventories] = useState<Inventory[]>([]);
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carrega apenas os dados que não dependem de inventoryId
      const [operatorData, inventoriesData, openInventoriesData] = await Promise.all([
        fetchOperator(),
        fetchInventories(),
        fetchOpenInventories(),
      ]);

      setOperators(operatorData);
      setInventories(inventoriesData);
      setOpenInventories(openInventoriesData);

      // Carrega localizações apenas se inventoryId for fornecido e válido
      if (inventoryId !== undefined && inventoryId > 0) {
        const locationsData = await fetchAllLocationsFromInventory(inventoryId);
        setLocations(locationsData);
      } else {
        setLocations([]); // Limpa as localizações se inventoryId não for fornecido
      }

      setError(null);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Executa loadData quando o hook é montado ou quando inventoryId muda
  useEffect(() => {
    loadData();
  }, [inventoryId]); // Adiciona inventoryId como dependência

  return {
    operators,
    inventories,
    openInventories,
    locations, // Inclui locations no retorno
    loading,
    error,
    refresh: loadData,
  };
};