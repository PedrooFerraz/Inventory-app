import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import Card from "./card";

export default function DataPreview() {

    const data = [
        "Código do Material",
        "Localização",
        "Quantidade em Estoque",
        "Descrição do Item"
    ]

    return (
        <View style={styles.container}>
            <View style={styles.previewTitleArea}>
                <Ionicons name="information-circle-outline" size={25} color={"#5A9BEB"} />
                <Text style={styles.previewTitle}>Prévia dos Dados</Text>
            </View>

            <Card info="300" label="Total de Itens" color="#60A5FA"></Card>
            <Card info="60" label="Localizações" color="#FBBF24"></Card>
            <Card info="~45 min" label="Tempo Estimado" color="#34D399"></Card>

            <View style={styles.detectedStructure}>
                <Text style={styles.detectedStructureTitle}>Estrutura detectada:</Text>


                {
                    data.map((item, index) => {
                        return (
                            <View style={styles.listItem} key={index}>
                                <View>
                                    <Ionicons name="checkmark" size={20} color={"#8998AC"} />
                                </View>
                                <Text style={styles.columnsName}>
                                    {item}
                                </Text>
                            </View>
                        )
                    })
                }
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        borderColor: "#475569",
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