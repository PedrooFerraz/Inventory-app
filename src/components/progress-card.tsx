import { ColorValue, StyleSheet, Text, View } from "react-native";

export default function ProgressCard({label, number, color} : {label:string, number: number, color: ColorValue | undefined}) {
    return (
        <View style={styles.progressStatus}>
            <Text style={{ fontSize: 17, color: color, fontWeight: "700" }}>{number}</Text>
            <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.85)" }}>{label}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    progressStatus: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#5A7BA2",
        padding: 10,
        borderRadius: 12
    }
})