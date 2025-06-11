import { ColorValue, DimensionValue, StyleSheet, View } from "react-native";

export default function ProgressBar({percentage, color}: {percentage: DimensionValue | undefined, color: ColorValue | undefined}) {
    return (
        <View style={{ height: 8, backgroundColor: color, borderRadius: 12 }}>
            <View style={[styles.progresBar, { width: percentage }]}>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    progressBarArea: {
        gap: 16
    },
    progresBar: {
        backgroundColor: "#079C6D",
        zIndex: 100,
        flex: 1,
        borderRadius: 12
    },
})