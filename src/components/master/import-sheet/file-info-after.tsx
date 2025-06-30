import { fileInfo } from "@/types/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FileInfoAfter({ data, otherDocument }: { data: fileInfo[], otherDocument: any }) {

    if (data.length === 1) {
        return (
            <View style={styles.fileInfo}>
                <View style={styles.fileInfoTitleArea}>
                    <Ionicons name="checkmark-circle-outline" size={25} color={"#34D399"} />
                    <Text style={styles.fileInfoTitle}>Arquivo Selecionado</Text>
                </View>
                <View style={styles.fileData}>
                    {
                        data.map((item, index) => {
                            return (
                                <View style={styles.dataSummary} key={index}>
                                    <Text style={styles.dataLabel}>Nome: {item.name}</Text>
                                    <Text style={styles.data}>Data: {item.date}</Text>
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

    return (
        <View style={styles.fileInfo}>
            <View style={styles.fileInfoTitleArea}>
                <Ionicons name="checkmark-circle-outline" size={25} color={"#34D399"} />
                <Text style={styles.fileInfoTitle}>{data.length} Arquivos Selecionados</Text>
            </View>
            <View style={styles.fileData}>
                {
                    data.map((item, index) => {
                        return (
                            <View style={styles.dataSummary} key={index}>
                                <Text style={styles.dataLabel}>Nome: {item.name}</Text>
                                <Text style={styles.data}>Data: {item.date}</Text>
                            </View>
                        )
                    })
                }

            </View>
            <TouchableOpacity style={styles.otherDocumentButton} onPress={otherDocument}>
                <Text style={{ color: "rgba(255, 255, 255, 0.6)" }}>Selecionar outros documentos</Text>
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
        color: "white"
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