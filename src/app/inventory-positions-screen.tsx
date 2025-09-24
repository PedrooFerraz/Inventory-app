import SelectPositionCard from '@/components/inventory/select-inventory-position-card';
import { useDatabase } from '@/hooks/useDatabase';
import { InventoryLocation } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';

export default function InventorySelectionScreen() {

    const params = useLocalSearchParams();

    console.log(params)
    const { locations } = useDatabase(params.id ? { inventoryId: Number(params.id) } : {})
    const [filter, setFilter] = useState<0 | 1 | 2 | 3>(3); // 0-Aberto, 1-Em Andamento, 2-Finalizado, 3-Todos

    const filteredLocations = locations.filter(location => {
        if (filter === 3) return true;
        return location.status === filter;
    });

    const FilterButton = ({ status, label }: { status: 0 | 1 | 2 | 3, label: string }) => (
        <TouchableOpacity
            style={[
                styles.filterButton,
                filter === status && styles.activeFilter
            ]}
            onPress={() => setFilter(status)}
        >
            <Text style={[
                styles.filterButtonText,
                filter === status && styles.activeFilterText
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const handleSelect = (id: number, locationId: number) => {


        router.navigate(`/inventory-positions-screen?id=${id}&operator=${params.operator}&location=${locationId}`)
    }


    const renderInventarioItem = ({ item }: { item: InventoryLocation }) => (
        <SelectPositionCard item={item} onPress={handleSelect} key={item.id}></SelectPositionCard>
    );

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Selecionar posição</Text>
                </View>
            </View>

            <View style={styles.filterContainer}>
                <FilterButton status={3} label="Todos" />
                <FilterButton status={0} label="Abertos" />
                <FilterButton status={1} label="Em Andamento" />
                <FilterButton status={2} label="Finalizados" />
            </View>

            <View style={styles.content}>
                <FlatList
                    data={filteredLocations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderInventarioItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                />
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3a5073',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#4f6a92',
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    backButton: {
        padding: 8,
        marginRight: 12,
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    listContainer: {
        paddingVertical: 20,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#3A5073',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    filterButtonText: {
        color: '#CBD5E1',
        fontWeight: '500',
    },
    activeFilter: {
        backgroundColor: '#607EA8',
    },
    activeFilterText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#CBD5E1',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});
