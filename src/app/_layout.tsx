import { Slot } from "expo-router"
import { StatusBar, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Layout() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#182234" }}>
            <StatusBar
                backgroundColor="#000"
                barStyle="light-content"
            />
            <Slot />

        </SafeAreaView>
    )
}
