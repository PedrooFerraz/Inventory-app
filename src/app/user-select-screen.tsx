import UserCard from "@/components/user/user-card";
import { useDatabase } from "@/hooks/useDatabase";
import { Operator } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function UserSelectScreen() {

    const { operators } = useDatabase({});
    const selectOperator = (id: number) => {


        router.navigate(`/inventory-select-screen?operator=${id}` );
    };

    const renderOperadorItem = ({ item }: { item: Operator }) => (
        <UserCard username={item.name} id={item.code} onPress={() => selectOperator(item.id)} ></UserCard>
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
                    <Text style={styles.headerTitle}>Selecionar Membro da Equipe</Text>
                </View>
            </View>

            <View style={styles.content}>
                <FlatList
                    data={operators}
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
    }

});
