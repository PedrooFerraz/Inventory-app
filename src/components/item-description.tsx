import { Item } from "@/types/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

export default function ItemDescription({ data, status }: { data: Partial<Item> | string, status: boolean }) {

    if (status && typeof (data) != "string") {
        return (
            <View style={styles.descriptionArea}>
                <View style={{ width: 30, height: 30, backgroundColor: "#1A3266", borderRadius: "50%", justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="cube-outline" size={18} color={"#60A5FA"} />
                </View>
                <View style={{ flexDirection: "column", width: "100%", gap: 4 }}>
                    <Text style={styles.descriptionTitle}>Informações do Material</Text>
                    <Text style={styles.data}>
                        Descrição: {data.description}
                    </Text>
                    <Text style={styles.data}>
                        Lote: {data.batch}
                    </Text>
                    <Text style={styles.data}>
                        Unidade: {data.unit}
                    </Text>
                </View>
            </View>
        )
    }
    else if (!status && typeof (data) == "string") {
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
                    <Text style={styles.data}>
                        {data}
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
    data: {
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