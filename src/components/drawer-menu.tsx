import Ionicons from "@expo/vector-icons/Ionicons";
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
                <TouchableOpacity style={styles.menuButton} activeOpacity={0.5}>
                    <Text style={{color:"white", fontSize: 14}}>Limpar Importação</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuButton} activeOpacity={0.5}>
                    <Text style={{color:"white"}}>Exportar arquivo</Text>
                </TouchableOpacity>
            </View>



        </View>
    )
}

const styles = StyleSheet.create({
    navigationContainer: {
        backgroundColor: "#121A2D",
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
        borderBottomColor: "#263346",
        borderBottomWidth: 0.8
    },
    menuButton: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#263346",
    }
})