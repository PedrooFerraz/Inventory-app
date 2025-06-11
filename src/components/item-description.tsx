import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

export default function ItemDescription({description} : {description : string}) {
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