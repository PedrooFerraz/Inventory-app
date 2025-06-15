import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProgressBar from "../progress-bar";
import { Inventory } from "@/types/types";

export default function SelectInventoryCard({ item, onPress }: { item: Inventory, onPress: (id: number) => any}) {

    const getStatus = (status: number) => {
        switch (status) {
            case 0:
                return "Aberto"
            case 1:
                return "Em Andamento"
            case 2:
                return "Finalizado"
            default:
                break;
        }
    }
    const getStatusColor = (status: number) => {
        switch (status) {
            case 0:
                return "#079C6D"
            case 1:
                return "#FBBF24"
            case 2:
                return "#EF4444"
            default:
                break;
        }
    }

    return (
        <TouchableOpacity
            style={styles.inventarioCard}
            activeOpacity={0.7}
            onPress={()=> onPress(item.id)}
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
                    <Text style={styles.inventarioNome}>{item.fileName}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
            </View>

            <View style={styles.cardDetails}>


                <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{getStatus(item.status)}</Text>
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
                            {`${Math.floor((item.countedItems / item.totalItems) * 100)}%`}
                        </Text>
                    </View>
                    <ProgressBar color={"#334155"} percentage={`${(item.countedItems / item.totalItems) * 100}%`}></ProgressBar>
                    <Text style={styles.progressText}>
                        {item.countedItems} de {item.totalItems} itens
                    </Text>
                </View>

            </View>

        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({

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