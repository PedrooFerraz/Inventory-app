import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserCard({ username, id, onPress }: { username: string, id: string, onPress: any }) {

    return (
        <TouchableOpacity
            style={styles.operatorCard}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.cardContent}>
                <Ionicons name="person" size={20} color="#94A3B8" />
                <Text style={styles.operatorName}>{username}</Text>
            </View>
            <Text style={styles.operatorName}>{id}</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    cardContent: {
        flex: 1,
        flexDirection: "row",
        gap: 12
    },
    operatorCard: {
        borderRadius: 12,
        padding: 18,
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
        flexDirection: "row",
        justifyContent: "space-between",
    },
    operatorName: {
        display: 'flex',
        flexShrink:1,
        flexWrap: 'wrap',
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    }
})