// useDatabase.ts
import { useEffect, useState } from 'react';
import { Operator, Inventory } from '@/types/types';
import { fetchInventories } from '@/models/inventory';
import { fetchOperator } from '@/models/operators';

export const useDatabase = () => {
    const [operators, setOperators] = useState<Operator[]>([]);
    const [inventories, setInventories] = useState<Inventory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const [operatorData, inventoriesData] = await Promise.all([
                fetchOperator(),
                fetchInventories(),
            ]);
            setOperators(operatorData);
            setInventories(inventoriesData);
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
        loading,
        error,
        refresh: loadData,
    };
};