// useDatabase.ts
import { useEffect, useState } from 'react';
import { Operator, Inventory } from '@/types/types';
import { fetchInventories, fetchOpenInventories } from '@/models/inventory';
import { fetchOperator } from '@/models/operators';

export const useDatabase = () => {
    const [operators, setOperators] = useState<Operator[]>([]);
    const [inventories, setInventories] = useState<Inventory[]>([]);
    const [openInventories, setOpenInventories] = useState<Inventory[]>([]);
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
            setOpenInventories(openInventoriesData)
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
    }, []);

    return {
        operators,
        inventories,
        openInventories,
        loading,
        error,
        refresh: loadData,
    };
};