import { useDatabase } from '@/hooks/useDatabase';
import { Inventory } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import SelectInventoryCard from '@/components/inventory/select-inventory-card';
import { CustomModal } from '@/components/master/custom-modal';
import ButtonWithIcon from '@/components/button-with-icon';
import { deleteInventory, fetchItemsByInventoryId } from '@/models/inventory';
import { exportInventoryToExcel, exportSurplusMaterialToExcel } from '@/services/xlsxService';
import { COLORS, FONTS, SPACING, buttonStyles } from '@/assets/style/theme';

// Inteface para o hook de banco de dados
interface DatabaseHook {
  inventories: Inventory[];
  refresh: () => void;
}

const InventorySelectionScreen = () => {
  const { inventories, refresh }: DatabaseHook = useDatabase({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedInventory, setSelectedInventory] = useState<number | undefined>(undefined);
  const [filter, setFilter] = useState<0 | 1 | 2 | 3>(3); // 0-Aberto, 1-Em Andamento, 2-Finalizado, 3-Todos
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filteredInventories = useMemo(() => {
    return inventories.filter((inventory) => {
      if (filter === 3) return true;
      return inventory.status === filter;
    });
  }, [inventories, filter]);

  const handleClick = async (id: number) => {
    setSelectedInventory(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedInventory(undefined); // Clear selection for safety
  };

  const handleExport = async () => {
    if (!selectedInventory) {
      Alert.alert('Erro', 'Nenhum inventário selecionado.');
      return;
    }
    setIsLoading(true);
    try {
      const items = await fetchItemsByInventoryId(selectedInventory);
      await exportInventoryToExcel(items);
      Alert.alert('Sucesso', 'Inventário exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar inventário:', error);
      Alert.alert('Erro', 'Falha ao exportar inventário. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportSurplusMaterial = async () => {
    if (!selectedInventory) {
      Alert.alert('Erro', 'Nenhum inventário selecionado.');
      return;
    }
    setIsLoading(true);
    try {
      const items = await fetchItemsByInventoryId(selectedInventory);
      await exportSurplusMaterialToExcel(items);
      Alert.alert('Sucesso', 'Materiais excedentes exportados com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar materiais excedentes:', error);
      Alert.alert('Erro', 'Falha ao exportar materiais excedentes. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (!selectedInventory) {
      Alert.alert('Erro', 'Nenhum inventário selecionado.');
      return;
    }
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este inventário?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteInventory(selectedInventory);
              refresh();
              setShowModal(false);
              setSelectedInventory(undefined);
              Alert.alert('Sucesso', 'Inventário excluído com sucesso!');
            } catch (error) {
              console.error('Erro ao excluir inventário:', error);
              Alert.alert('Erro', 'Falha ao excluir inventário. Tente novamente.');
            } finally {
              setIsLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const FilterButton = ({ status, label }: { status: 0 | 1 | 2 | 3; label: string }) => (
    <TouchableOpacity
      style={[buttonStyles.filterButton, filter === status && buttonStyles.activeFilter]}
      onPress={() => setFilter(status)}
      accessibilityLabel={`Filtrar por ${label}`}
    >
      <Text style={[FONTS.filterButtonText, filter === status && FONTS.activeFilterText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderInventarioItem = ({ item }: { item: Inventory }) => (
    <SelectInventoryCard item={item} onPress={handleClick} />
  );

  return (
    <View style={[styles.container, { backgroundColor: COLORS.primaryDark }]}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.white} />
        </View>
      )}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View>
          <Text style={FONTS.headerTitle}>Histórico de Inventários</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <FilterButton status={3} label="Todos" />
        <FilterButton status={0} label="Abertos" />
        <FilterButton status={1} label="Em Andamento" />
        <FilterButton status={2} label="Finalizados" />
      </View>

      <View style={styles.content}>
        {filteredInventories.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum inventário encontrado.</Text>
        ) : (
          <FlatList
            data={filteredInventories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderInventarioItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>

      <CustomModal
        onClose={handleCloseModal}
        visible={showModal}
        showCloseButton
        title="Gerenciar Inventário"
      >
        <View style={{ gap: 20 }}>
          <ButtonWithIcon
            color={COLORS.primary}
            icon="download-outline"
            onPress={handleExport}
            label="Exportar Inventário"
          />
          <ButtonWithIcon
            color={COLORS.primary}
            icon="download-outline"
            onPress={handleExportSurplusMaterial}
            label="Exportar Materiais Excedentes"
          />
          <ButtonWithIcon
            color={COLORS.accent}
            icon="trash-outline"
            onPress={handleDelete}
            label="Excluir Inventário"
          />
        </View>
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.paddingHorizontal,
    paddingVertical: SPACING.paddingVerticalHeader,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.small,
    marginRight: SPACING.medium,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.paddingVerticalFilter,
    backgroundColor: COLORS.primaryDark,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.paddingHorizontal,
  },
  listContainer: {
    paddingVertical: SPACING.large,
  },
  emptyText: {
    color: COLORS.filterText,
    textAlign: 'center',
    marginTop: SPACING.large,
    fontSize: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InventorySelectionScreen;