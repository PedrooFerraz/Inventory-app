import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProgressBar from "../progress-bar";
import { InventoryItem } from "@/types/types";

export default function SelectItemCard({ item, onPress }: { item: InventoryItem, onPress: (id: number, locationId: number) => any }) {

    const getStatus = (countedItens?: number | null) => {

        if (!countedItens) {
            return "Pendente"
        }

        if (countedItens !== null) {
            return "Contabilizado"
        }
        return "Pendente"

    }
    const getStatusColor = (countedItens?: number | null) => {

        if (!countedItens) {
            return "#EF5350"
        }

        if (countedItens !== null) {
            return "#4CAF50"
        }
        return "#EF5350"
    }

    return (
        <TouchableOpacity
            style={styles.positionCard}
            activeOpacity={0.7}
            onPress={() => onPress(item.inventory_id, item.id)}
        >

            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <LinearGradient
                        colors={['#4f6a92', '#6b8ab5']}
                        style={styles.iconContainer}
                    >
                        <Ionicons name="grid-outline" size={28} color="#FFFFFF" />
                    </LinearGradient>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.posicaoNome}>Código: {item.code}</Text>
                </View>

            </View>

            <View style={styles.cardDetails}>
                <View style={styles.statusContainer}>
                    {
                        item.description == undefined || item.status == 5 ?
                            <Text style={styles.detailText}>Item inserido pelo usuário</Text>
                            :
                            <Text style={styles.detailText}>Descrição: {item.description}</Text>
                    }
                </View>
                <View style={styles.statusContainer}>
                    {
                        item.unit !== null &&
                        <Text style={styles.detailText}>Unidade: {item.unit}</Text>
                    }
                </View>
                {
                    item.batch &&
                    <View style={styles.statusContainer}>
                        <Text style={styles.detailText}>Lote: {item.batch}</Text>
                    </View>

                }
                <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.reportedQuantity) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{getStatus(item.reportedQuantity)}</Text>
                </View>
            </View>

        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({

    positionCard: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FFF',
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
    posicaoNome: {
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
        color: 'rgba(255, 255, 255, 0.75)',
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
        color: 'rgba(255, 255, 255, 0.85)',
        fontWeight: '500',
    },
    progressPercentage: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    progressText: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.6)',
    },
});