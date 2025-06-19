import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import Card from "@/components/card";
import { dataPreview } from "@/app/import-sheet-screen";

export default function DataPreview({data} : {data : dataPreview}) {

    return (
        <View style={styles.container}>
            <View style={styles.previewTitleArea}>
                <Ionicons name="information-circle-outline" size={25} color={"#5A9BEB"} />
                <Text style={styles.previewTitle}>Prévia dos Dados</Text>
            </View>

            <Card info={data.qty} label="Total de Itens" color="#2793EC"></Card>
            <Card info={data.localizations} label="Localizações" color="#F3BB13"></Card>


        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        borderColor: "#FFF",
        borderWidth: 1,
        borderRadius: 15,
        borderStyle: "solid",
        gap: 20,
        padding: 30
    },

    previewTitleArea: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center"
    },
    previewTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "white"
    },
    detectedStructure: {
        borderColor: "#475569",
        borderWidth: 1,
        borderRadius: 15,
        borderStyle: "solid",
        backgroundColor: "#151F31",
        gap: 8,
        padding: 20,
        marginTop: 10
    },
    detectedStructureTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: "#A2ACBA"
    },
    listItem: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
    },
    columnsName: {
        color: "#94A3B8",
    }
})