import UserCard from "@/components/user/user-card";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const operadores = [
    {
        id: "1",
        nome: 'João Silva',
        codigo: '001',
    },
    {
        id: "2",
        nome: 'Maria Costa',
        codigo: '002',
    },
    {
        id: "3",
        nome: 'Pedro Oliveira',
        codigo: '003',
    },
    {
        id: "4",
        nome: 'Ana Santos',
        codigo: '004',
    },
    {
        id: "5",
        nome: 'Carlos Ferreira',
        codigo: '005',
    },

];

export default function UserSelectScreen() {

    const selectOperator = () => {

        router.navigate("/inventory-select-screen");
    };

    type Operador = {
        id: string;
        nome: string;
        codigo: string;
    };

    const renderOperadorItem = ({ item }: { item: Operador}) => (
        <UserCard username={item.nome} id={item.codigo} onPress={selectOperator} ></UserCard>
    );


    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={22} color="#FFF" />
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
