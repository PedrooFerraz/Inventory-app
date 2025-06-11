import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function QRCodeInput({label, placeholder, iconName}:{label: string, placeholder: string, iconName: any}) {



    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={{ justifyContent: "center" }}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={"#475569"}
                />
                <Ionicons onPress={()=>router.navigate("/qrcode-camera-view")} name={iconName} color={"#94A3B8"} size={32} style={{ position: "absolute", right: 10 }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        color: "#BDC7D3",
        fontWeight: "500",
        fontSize: 14
    },
    input: {
        borderWidth: 1,
        borderColor: "#475569",
        borderRadius: 8,
        color: "white",
        padding: 10,
        height: 50,
        fontSize: 16,
    },
    inputGroup: {
        gap: 10
    },
})