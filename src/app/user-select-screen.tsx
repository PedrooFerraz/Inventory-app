import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const operadores = [
    {
        id: 1,
        nome: 'João Silva',
        codigo: '001',
    },
    {
        id: 2,
        nome: 'Maria Costa',
        codigo: '002',
    },
    {
        id: 3,
        nome: 'Pedro Oliveira',
        codigo: '003',
    },
    {
        id: 4,
        nome: 'Ana Santos',
        codigo: '004',
    },
    {
        id: 5,
        nome: 'Carlos Ferreira',
        codigo: '005',
    },

];

export default function UserSelectScreen() {

    const selectOperator = () => {

        router.navigate("/inventory-select-screen");
    };

    type Operador = {
        id: number;
        nome: string;
        codigo: string;
    };

    const renderOperadorItem = ({ item }: { item: Operador}) => (
        <TouchableOpacity
            style={styles.operatorCard}
            onPress={() => selectOperator()}
            activeOpacity={0.7}
        >
            <View style={styles.cardContent}>
                <Ionicons name="person" size={20} color="#94A3B8"/>
                <Text style={styles.operatorName}>{item.nome}</Text>
            </View>
            <Text style={styles.operatorName}>{item.codigo}</Text>
        </TouchableOpacity>
    );


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1E293B" />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Selecionar Operador</Text>
                </View>
            </View>

            <View style={styles.content}>
                <FlatList
                    data={operadores}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderOperadorItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                />
            </View>

        </SafeAreaView>
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
    cardContent: {
        flex: 1,
        flexDirection: "row",
        gap: 12
    },
    operatorCard: {
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
        flexDirection: "row"
    },
    operatorName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    }
});
