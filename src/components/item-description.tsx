import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

export default function ItemDescription({ description, status }: { description: string, status: 0 | 1 }) {

    if (status == 0) {
        return (
            <View style={styles.descriptionArea}>
                <View style={{ width: 30, height: 30, backgroundColor: "#1A3266", borderRadius: "50%", justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="cube-outline" size={18} color={"#60A5FA"} />
                </View>
                <View style={{ flexDirection: "column", width: "100%" }}>
                    <Text style={styles.descriptionTitle}>Descrição</Text>
                    <Text style={styles.description}>
                        {description}
                    </Text>
                </View>
            </View>
        )
    }
    else if (status == 1) {
        return (
            <View style={{
                borderWidth: 1,
                borderColor: "#4d1d1d",
                borderRadius: 8,
                gap: 10,
                padding: 10,
                flexDirection: "row",
                backgroundColor: "#af1e1e33"
            }}>
                <View style={{ width: 30, height: 30, backgroundColor: "#661a1a", borderRadius: "50%", justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="cube-outline" size={18} color={"#fa6060"} />
                </View>
                <View style={{ flexDirection: "column", width: "100%" }}>
                    <Text style={{
                        fontWeight: "500",
                        fontSize: 14,
                        color: "#fa6060"
                    }}>Erro</Text>
                    <Text style={styles.description}>
                        {description}
                    </Text>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({

    descriptionTitle: {
        fontWeight: "500",
        fontSize: 14,
        color: "#60a5fa"
    },
    description: {
        color: "white",
        fontSize: 14,
        flexWrap: "wrap",
        width: "85%"
    },
    descriptionArea: {
        borderWidth: 1,
        borderColor: "#1D2C4D",
        borderRadius: 8,
        gap: 10,
        padding: 10,
        flexDirection: "row",
        backgroundColor: "#1e40af33"
    },
})