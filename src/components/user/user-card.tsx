import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserCard({ username, id, onPress }: { username: string, id: string, onPress: any}) {

    return (
        <TouchableOpacity style={styles.button} activeOpacity={0.5} onPress={onPress}>
            <View style={{flexDirection: "row", gap: 8}}>
                <Ionicons name="people-outline" size={20} color={"white"} />
                <Text style={styles.name}>{username}</Text>
            </View>
            <Text style={styles.name}>{id}</Text>

        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    button: {
        backgroundColor: "#1c263d",
        borderWidth: 1,
        borderColor: 'rgba(51, 65, 85, 0.5)',
        borderRadius: 10,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        padding: 18,
        flexDirection: "row",
        justifyContent: "space-between"

    },
    name: {
        fontSize: 16,
        fontWeight: "500",
        color: "white",
    }
})