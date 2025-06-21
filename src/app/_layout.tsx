import { Slot } from "expo-router"
import { StatusBar } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Layout() {

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#4f6a92" }}>
            <StatusBar
                animated={true}
                backgroundColor="#4f6a92"
                barStyle="light-content"
            />
            <Slot />

        </SafeAreaView>
    )
}
