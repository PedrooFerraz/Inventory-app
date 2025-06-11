import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FileInfoAfter() {

    const fileData = [
        { label: "Name", data: "Individual_XXX317_Transactions_20250417-202359.csv" },
        { label: "Tamanho", data: "2,4 MB" },
        { label: "Modificado", data: "06/06/2024 - 18:03" }
    ]

    return (
        <View style={styles.fileInfo}>
            <View style={styles.fileInfoTitleArea}>
                <Ionicons name="checkmark-circle-outline" size={25} color={"#34D399"} />
                <Text style={styles.fileInfoTitle}>Arquivo Selecionado</Text>
            </View>
            <View style={styles.fileData}>
                {
                    fileData.map((item, index) => {
                        return (
                            <View style={styles.dataSummary} key={index}>
                                <Text style={styles.dataLabel}>{item.label}:</Text>
                                <Text style={styles.data}>{item.data}</Text>
                            </View>
                        )
                    })
                }

            </View>
            <TouchableOpacity style={styles.otherDocumentButton}>
                <Text style={{ color: "#94A3B8" }}>Selecionar outro documento</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    fileInfo: {
        padding: 20,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#475569",
        backgroundColor: "#263245",
        width: "100%",
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center"
    },
    fileInfoTitleArea: {
        flexDirection: "row",
        gap: 10
    },
    fileInfoTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#34D399"
    },
    fileData: {
        flexDirection: "column",
        gap: 10
    },
    dataSummary: {

    },
    dataLabel: {
        color: "#C1CBD8"
    },
    data: {
        color: "white",
        fontWeight: "500"
    },
    otherDocumentButton: {
        marginTop: 8
    }

})