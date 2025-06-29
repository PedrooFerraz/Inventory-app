import { useDatabase } from '@/hooks/useDatabase';
import { Inventory } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert
} from 'react-native';
import SelectInventoryCard from '@/components/inventory/select-inventory-card';
import { CustomModal } from '@/components/master/custom-modal';
import ButtonWithIcon from '@/components/button-with-icon';
import { deleteInventory, fetchItemsByInventoryId } from '@/models/inventory';
import { exportInventoryToExcel } from '@/services/xlsxService';

const InventorySelectionScreen = () => {

    const { inventories, refresh } = useDatabase();
    const [showModal, setShowModal] = useState(false)
    const [selectedInventory, setSelectedInventory] = useState<number>()

    const handleClick = async (id: number) => {
        setSelectedInventory(id)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }
    const handleExport = async () => {

        if (selectedInventory)
            await fetchItemsByInventoryId(selectedInventory)
                .then(res => {
                    exportInventoryToExcel(res)
                })

    }
    const handleDelete = () => {
        Alert.alert(
            'Confirmar Exclusão',
            'Tem certeza que deseja excluir este inventário?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Excluir',
                    onPress: () => {
                        if (!selectedInventory) {
                            Alert.alert('Error', 'Aconteceu algum erro, tente novamente!');
                            return
                        }
                        deleteInventory(selectedInventory)
                        setShowModal(false)
                        refresh()
                        Alert.alert('Sucesso', 'Inventário excluído com sucesso!');
                    },
                    style: 'destructive'
                }
            ]
        );
    }



    const renderInventarioItem = ({ item }: { item: Inventory }) => (
        <SelectInventoryCard item={item} onPress={handleClick}></SelectInventoryCard>
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
                    <Text style={styles.headerTitle}>Histórico de Inventários</Text>
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

            <CustomModal onClose={handleCloseModal} visible={showModal} showCloseButton title='Gerenciar Inventario'>
                <View style={{ gap: 20 }}>
                    <ButtonWithIcon color={"#5A7BA1"} icon={"download-outline"} onPress={handleExport} label='Exportar Inventario'></ButtonWithIcon>
                    <ButtonWithIcon color={"#7F95B9"} icon={"trash-outline"} onPress={handleDelete} label='Exluir Inventario'></ButtonWithIcon>
                </View>
            </CustomModal>

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
        borderBottomColor: 'rgba(51, 65, 85, 0.42)',
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

});

export default InventorySelectionScreen;