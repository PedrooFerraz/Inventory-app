import ButtonWithIcon from '@/components/button-with-icon';
import DrawerMenu from '@/components/drawer-menu';
import SelectPositionCard from '@/components/inventory/select-inventory-position-card';
import { CustomModal } from '@/components/master/custom-modal';
import { useDatabase } from '@/hooks/useDatabase';
import { InventoryService } from '@/services/inventoryService';
import { Inventory, InventoryLocation } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  DrawerLayoutAndroid,
  Alert,
} from 'react-native';

export default function InventoryPositionScreen() {
  const navigationView = () => (
    <DrawerMenu drawer={drawer} finalizeInventoryFunction={handleFinalizeInventory}></DrawerMenu>
  );

  const drawer = useRef<DrawerLayoutAndroid>(null);
  const params = useLocalSearchParams();
  const { locations } = useDatabase(params.id ? { inventoryId: Number(params.id) } : {});
  const [filter, setFilter] = useState<0 | 1 | 2 | 3>(0); // 0-Aberto, 1-Em Andamento, 2-Finalizado, 3-Todos
  const [searchQuery, setSearchQuery] = useState<string>(''); // Estado para o texto de pesquisa
  const [currentInventory, setCurrentInventory] = useState<Inventory | null>(null);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [modalAction, setModalAction] = useState<() => void>(() => { });
  const [modalCancelAction, setModalCancelAction] = useState<() => void>(() => { });
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    try {
      const inventory = await InventoryService.getInventory(Number(params.id));
      setCurrentInventory(inventory);
    } catch (error) {
      console.error('Error loading inventory:', error);
    }
  };



  // Filtra localizações com base no status e na pesquisa por localização
  const filteredLocations = locations.filter((location) => {
    const matchesStatus = filter === 3 || location.status === filter;
    const matchesSearch = location.location
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const FilterButton = ({ status, label }: { status: 0 | 1 | 2 | 3; label: string }) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === status && styles.activeFilter]}
      onPress={() => setFilter(status)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === status && styles.activeFilterText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const handleSelect = (inventoryId: number, location: string) => {
    router.navigate(
      `/inventory-by-positions-screen?id=${inventoryId}&operator=${params.operator}&location=${location}`,
    );
  };

  const handleFinalizeInventory = () => {
    if (!currentInventory) return;

    const diff = currentInventory.totalItems - currentInventory.countedItems;

    let message = "";
    if (diff === 0) {
      message = "Realmente deseja finalizar o inventário? Após finalizar você não poderá mais adicionar novos registros";
    } else {
      message = `Ainda restam itens a serem contados, realmente deseja finalizar o inventário? Após finalizar você não poderá adicionar novas contagens. Os materiais não contados serão considerados sem estoque.`;
    }

    showErrorModal("Atenção", message, async () => {
      const res = await InventoryService.finalizeInventory(currentInventory.id);
      if (res.success) {
        Alert.alert("Sucesso", "Inventário finalizado com sucesso!");
        router.navigate("/");
      } else {
        Alert.alert("Erro", "Ocorreu algum erro ao finalizar o inventário, tente novamente");
      }
    }, () => {
      setErrorTitle("");
      setErrorMessage("");
      setModalAction(() => { });
      setModalCancelAction(() => { });
      setErrorModalVisible(false)
    });
  };

  const showErrorModal = (title: string, message: string, onConfirm: () => void, onCancel: () => void) => {
    setErrorTitle(title);
    setErrorMessage(message);
    setModalAction(() => onConfirm);
    setModalCancelAction(() => onCancel);
    setErrorModalVisible(true);
  };

  const renderInventarioItem = ({ item }: { item: InventoryLocation }) => (
    <SelectPositionCard
      item={item}
      onPress={() => handleSelect(item.inventory_id, item.location)}
      key={item.id}
    ></SelectPositionCard>
  );

  return (
    <DrawerLayoutAndroid style={styles.container}
      ref={drawer}
      drawerWidth={300}
      drawerPosition={"left"}
      renderNavigationView={navigationView}>

      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Selecionar posição</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => drawer.current?.openDrawer()}>
            <Ionicons name="menu" size={32} color={"#FFF"} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: '#3a5073',
            paddingVertical: 8,
            paddingHorizontal: 14,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            elevation: 4,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            zIndex: 999,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>
            Inventário: {currentInventory?.inventoryDocument}
          </Text>

          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              paddingVertical: 3,
              paddingHorizontal: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
              {currentInventory?.countedItems} / {currentInventory?.totalItems}
            </Text>
          </View>
        </View>


        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#CBD5E1"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar por localização..."
            placeholderTextColor="#CBD5E1"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
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
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Nenhuma localização encontrada.
              </Text>
            }
          />
        </View>
      </View>

      <CustomModal visible={errorModalVisible} title={errorTitle} onClose={() => setErrorModalVisible(false)}>
        <Text style={{ fontSize: 16, color: "white", marginBottom: 22 }}>
          {errorMessage}
        </Text>
        <View style={{ gap: 20 }}>
          <ButtonWithIcon
            color="#5A7BA1"
            icon="checkmark-outline"
            label="Confirmar"
            onPress={modalAction}
          />
          <ButtonWithIcon
            color="#7F95B9"
            icon="close-outline"
            label="Cancelar"
            onPress={modalCancelAction}
          />
        </View>
      </CustomModal>

    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3a5073',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#4f6a92',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFF',
    fontSize: 16,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingVertical: 20,
  },
  emptyText: {
    color: '#CBD5E1',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});