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
  TextInput,
} from 'react-native';

export default function InventoryPositionScreen() {
  const params = useLocalSearchParams();
  const { locations } = useDatabase(params.id ? { inventoryId: Number(params.id) } : {});
  const [filter, setFilter] = useState<0 | 1 | 2 | 3>(3); // 0-Aberto, 1-Em Andamento, 2-Finalizado, 3-Todos
  const [searchQuery, setSearchQuery] = useState<string>(''); // Estado para o texto de pesquisa

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

  const renderInventarioItem = ({ item }: { item: InventoryLocation }) => (
    <SelectPositionCard
      item={item}
      onPress={() => handleSelect(item.inventory_id, item.location)}
      key={item.id}
    ></SelectPositionCard>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Selecionar posição</Text>
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