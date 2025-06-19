import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FileInfoBefore({onPress} : {onPress : any}) {
    return (
        <View style={styles.fileInfo}>
            <TouchableOpacity style={styles.selectFileButton} onPress={onPress}>
                <Ionicons name="folder-outline" size={20} color={"white"} />
                <Text style={styles.selectFileButtonText}>Selecionar Arquivo CSV</Text>
            </TouchableOpacity>
            <Text style={styles.fileInfoSubText}>Formatos aceitos: .csv | Tamanho máximo: 50MB</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    selectFileButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#5a7ba3",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10
  },
  selectFileButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15
  },
  fileInfoSubText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },  
  fileInfo: {
    gap: 16
  },
})