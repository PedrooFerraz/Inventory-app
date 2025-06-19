import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Loading() {

    return (
        <View style={styles.container}>
            <ActivityIndicator size={"large"} color={"#60A5FA"}/>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        borderColor: "#5E7290",
        borderWidth: 1,
        borderRadius: 15,
        borderStyle: "solid",
        gap: 20,
        padding: 30
    }
})