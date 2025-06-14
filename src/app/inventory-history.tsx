import ProgressBar from '@/components/progress-bar';
import { useDatabase } from '@/hooks/useDatabase';
import { Inventory } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity
} from 'react-native';

const InventorySelectionScreen = () => {

    const { inventories, refresh } = useDatabase();

    const inventarios = [
        {
            id: 1,
            nome: 'Inventário Almoxarifado Central',
            descricao: 'Contagem geral do estoque principal',
            startDate: '12/06/2025',
            status: 'Em andamento',
            totalItems: 1250,
            countedItems: 320,
        },
        {
            id: 2,
            nome: 'Inventário Depósito Norte',
            descricao: 'Contagem do depósito filial norte',
            startDate: '10/06/2025',
            status: 'Pendente',
            totalItems: 875,
            countedItems: 0,
        },
        {
            id: 3,
            nome: 'Inventário Produtos Acabados',
            descricao: 'Contagem linha de produção',
            startDate: '08/06/2025',
            status: 'Concluído',
            totalItems: 450,
            countedItems: 450,
        },
        {
            id: 4,
            nome: 'Inventário Matéria Prima',
            descricao: 'Contagem de insumos e materiais',
            startDate: '11/06/2025',
            status: 'Em andamento',
            totalItems: 680,
            countedItems: 156,
        },
        {
            id: 5,
            nome: 'Inventário Ferramentas',
            descricao: 'Contagem de equipamentos e ferramentas',
            startDate: '09/06/2025',
            status: 'Pendente',
            totalItems: 290,
            countedItems: 0,
        },
    ];

    const handleClick = (id : number)=>{
        //Alguma logica para começar o dowload do csv
    }

    const renderInventarioItem = ({ item }: { item: Inventory }) => (
        <TouchableOpacity
            style={styles.inventarioCard}
            activeOpacity={0.7}
            onPress={() => handleClick(item.id)}
        >

            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <LinearGradient
                        colors={["#1A3266", "#1A3266"]}
                        style={styles.iconContainer}
                    >
                        <Ionicons name="cube-outline" size={28} color="#FFFFFF" />
                    </LinearGradient>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.inventarioNome}>{item.archiveName}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
            </View>

            <View style={styles.cardDetails}>


                <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: "#079C6D" }]} />
                    <Text style={[styles.statusText, { color: "#079C6D" }]}>{item.status}</Text>
                </View>

                <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                        <Ionicons name="calendar" color="#888" size={12} />
                        <Text style={styles.detailText}>Data da Importação: {item.importDate}</Text>
                    </View>
                </View>

                <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Progresso</Text>
                        <Text style={styles.progressPercentage}>
                            {`${Math.floor((item.qtyCountedItems / item.qtyItems) * 100)}%`}
                        </Text>
                    </View>
                    <ProgressBar color={"#334155"} percentage={`${(item.qtyCountedItems / item.qtyItems) * 100}%`}></ProgressBar>
                    <Text style={styles.progressText}>
                        {item.qtyCountedItems} de {item.qtyItems} itens
                    </Text>
                </View>

            </View>

        </TouchableOpacity>
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

export default InventorySelectionScreen;