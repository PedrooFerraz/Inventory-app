import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function ButtonWithIcon({route, icon, label} : {route: string, icon: any, label: string}) {

    const goToInventory = ()=>{
        router.navigate(route as any)
    }


    return (
        <TouchableOpacity style={styles.button} activeOpacity={0.5} onPress={goToInventory}>
            <Ionicons name={icon} size={20} color={"white"}/>
            <Text style={styles.name}>{label}</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    button: {
        backgroundColor: "#079C6D",
        padding: 18,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        flexDirection: "row",
        gap: 10
    },
    name: {
        fontSize: 16,
        fontWeight: "500",
        color: "white",
    }
})