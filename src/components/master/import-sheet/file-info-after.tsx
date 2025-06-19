import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FileInfoAfter({name, size, date, otherDocument} : {name: string, size: string, date: string, otherDocument:any}) {

    const fileData = [
        { label: "Nome", data: name },
        { label: "Tamanho", data: size },
        { label: "Modificado", data: date }
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
            <TouchableOpacity style={styles.otherDocumentButton} onPress={otherDocument}>
                <Text style={{ color: "rgba(255, 255, 255, 0.6)" }}>Selecionar outro documento</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    fileInfo: {
        padding: 20,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#FFF",
        backgroundColor: "#647998",
        width: "100%",
        gap: 10,
        justifyContent: "space-between",
        
    },
    fileInfoTitleArea: {
        flexDirection: "row",
        gap: 10,
        justifyContent: "center"
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
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 8
    }

})