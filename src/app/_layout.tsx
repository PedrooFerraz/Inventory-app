import { Slot } from "expo-router"
import { StatusBar } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Layout() {

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#182234" }}>
            <StatusBar
                animated={true}
                backgroundColor="#FFF"
                barStyle="light-content"
            />
            <Slot />

        </SafeAreaView>
    )
}
