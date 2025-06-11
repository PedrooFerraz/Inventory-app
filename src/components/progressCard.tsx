import { ColorValue, StyleSheet, Text, View } from "react-native";

export default function ProgressCard({label, number, color} : {label:string, number: number, color: ColorValue | undefined}) {
    return (
        <View style={styles.progressStatus}>
            <Text style={{ fontSize: 20, color: color, fontWeight: "700" }}>{number}</Text>
            <Text style={{ fontSize: 12, color: "#93A2B7" }}>{label}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    progressStatus: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#273347",
        padding: 10,
        borderRadius: 12
    }
})