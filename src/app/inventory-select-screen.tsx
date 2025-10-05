import SelectInventoryCard from '@/components/inventory/select-inventory-card';
import { useDatabase } from '@/hooks/useDatabase';
import { Inventory } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';

export default function InventorySelectionScreen() {

    const { inventories } = useDatabase({})
    const params = useLocalSearchParams();
    const [filter, setFilter] = useState<0 | 1 |2 | 3>(3); // 0-Aberto, 1-Em Andamento, 2-Finalizado, 3-Todos

    const filteredInventories = inventories.filter(inventories => {
        if (filter === 3) return true;
        return inventories.status === filter;
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

    const handleSelect = (id: number, countType: number) => {
        //Se caso o countType for 1 ir para a tela de contagem por barras e se caso for 2 ir para tela de seleção de posição a contar

        if(inventories.filter(item => item.id === id)[0].status === 2){
            Alert.alert("Atenção", "Inventários finalizados não podem ser editados.");
            return
        }

        if(countType === 1){
            router.navigate(`/inventory-by-code-screen?id=${id}&operator=${params.operator}`)
            return
        }
        else if(countType === 2){
            router.navigate(`/inventory-positions-screen?id=${id}&operator=${params.operator}`)
        }
        
    }


    const renderInventarioItem = ({ item }: { item: Inventory }) => (
        <SelectInventoryCard item={item} onPress={handleSelect}></SelectInventoryCard>
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
                    <Text style={styles.headerTitle}>Selecionar Inventário</Text>
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
                    data={filteredInventories}
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
