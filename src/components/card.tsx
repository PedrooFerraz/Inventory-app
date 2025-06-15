import { StyleSheet, Text, View } from "react-native";

export default function Card({info, label, color} : {info: number, label : string, color: string}){
    return (
            <View style={styles.card}>
                <Text style={{fontSize: 20, fontWeight: "900", color: color}}>{info}</Text>
                <Text style={styles.cardLabel}>{label}</Text>
            </View>
    )
}

const styles = StyleSheet.create({
        card :{
        backgroundColor: "#283447",
        borderRadius: 10,
        padding: 14,
        justifyContent: "center",
        alignItems: "center"
    },
    cardLabel: {
        fontSize: 14,
        color: "#94A3B8",
    }
})