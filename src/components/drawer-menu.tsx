import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { DrawerLayoutAndroid, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DrawerMenu({ drawer }: { drawer: React.RefObject<DrawerLayoutAndroid | null> }) {
    return (
        <View style={styles.navigationContainer}>

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Menu</Text>
                <TouchableOpacity onPress={() => drawer.current?.closeDrawer()}>
                    <Ionicons name="close" size={28} color={"white"} />
                </TouchableOpacity>
            </View>

            <View>
                <TouchableOpacity style={styles.menuButton} activeOpacity={0.5} onPress={()=>router.navigate("/")}>
                    <Text style={{color:"white", fontSize: 14}}>Voltar para a Tela Inicial</Text>
                </TouchableOpacity>

            </View>



        </View>
    )
}

const styles = StyleSheet.create({
    navigationContainer: {
        backgroundColor: "#3A5073",
        flex: 1,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        color: "#fff",
        fontWeight: "600"
    },
    header: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        borderBottomColor: "#5B7295",
        borderBottomWidth: 0.8
    },
    menuButton: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#5B7295",
    }
})