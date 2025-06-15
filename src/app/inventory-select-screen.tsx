import SelectInventoryCard from '@/components/inventory/select-inventory-card';
import { useDatabase } from '@/hooks/useDatabase';
import { Inventory } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';

export default function InventorySelectionScreen(){
    
    const { inventories } = useDatabase()
    const params = useLocalSearchParams();

    const handleSelect = (id: number) =>{
        router.navigate(`/inventory-screen?id=${id}&operator=${params.operator}`)
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

            <View style={styles.content}>
                <FlatList
                    data={inventories}
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
        backgroundColor: '#121A2D',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#182234',
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
    inventarioCard: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#263346',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardContent: {
        flex: 1,
    },
    inventarioNome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    inventarioDescricao: {
        fontSize: 14,
        color: '#94A3B8',
    },
    cardDetails: {
        gap: 12,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontSize: 12,
        color: '#94A3B8',
        marginLeft: 4,
    },
    progressContainer: {
        gap: 6,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressLabel: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '500',
    },
    progressPercentage: {
        fontSize: 12,
        color: '#079C6D',
        fontWeight: 'bold',
    },
    progressText: {
        fontSize: 11,
        color: '#64748B',
    },
});
