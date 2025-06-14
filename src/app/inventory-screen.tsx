import DrawerMenu from "@/components/drawer-menu";
import InventoryProgress from "@/components/inventory-progress";
import ItemDescription from "@/components/item-description";
import NumericInput from "@/components/numeric-input";
import QRCodeInput from "@/components/qrcode-input";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRef} from "react";
import { View, Text, StyleSheet, DrawerLayoutAndroid, TouchableOpacity, TextInput, ScrollView } from "react-native";


export default function InventoryScreen() {

    const drawer = useRef<DrawerLayoutAndroid>(null);




    const navigationView = () => (

        <DrawerMenu drawer={drawer}></DrawerMenu>
    );

    return (
        <DrawerLayoutAndroid style={styles.container}
            ref={drawer}
            drawerWidth={300}
            drawerPosition={"left"}
            renderNavigationView={navigationView}>
            <ScrollView>

                <View style={styles.header} >
                    <Text style={styles.headerTitle}>Inventário</Text>
                    <TouchableOpacity onPress={() => drawer.current?.openDrawer()}>
                        <Ionicons name="menu" size={32} color={"#94A3B8"} />
                    </TouchableOpacity>
                </View>


                <InventoryProgress></InventoryProgress>

                <View style={styles.content}>

                    <View style={styles.form}>

                        <QRCodeInput label="Código Material" placeholder="0000000000" iconName={"qr-code-outline"}></QRCodeInput>

                        <ItemDescription description="Descrição do item"></ItemDescription>

                        <QRCodeInput label="Localização" placeholder="123a" iconName={"qr-code-outline"}></QRCodeInput>

                        <NumericInput></NumericInput>

                    </View>

                    <TouchableOpacity style={styles.nextButton} activeOpacity={0.5}>
                        <Ionicons name="checkmark-circle-outline" size={20} color={"white"} />
                        <Text style={styles.buttonName}>Confirmar & Próximo</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.endButton}>
                    <Text style={styles.buttonName}>Finalizar Contagem</Text>
                </TouchableOpacity>
            </View>

        </DrawerLayoutAndroid>
    )
}


const styles = StyleSheet.create({

    header: {
        height: 70,
        width: "100%",
        flexDirection: "row",
        backgroundColor: "#182234",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        color: "white",
        borderBottomColor: "#263346",
        borderBottomWidth: 0.8
    },
    headerTitle: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold"
    },
    headerSubTitle: {
        fontSize: 14,
        color: "#94A3B8",
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: "#121A2D"
    },
    content: {
        flex: 1,
        gap: 22,
        padding: 24,
    },
    form: {
        gap: 28
    },
    nextButton: {
        backgroundColor: "#079C6D",
        padding: 18,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        flexDirection: "row",
        gap: 10
    },
    buttonName: {
        fontSize: 16,
        fontWeight: "500",
        color: "white",
    },
    endButton: {
        backgroundColor: "#334155",
        padding: 12,
        paddingHorizontal: 28,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        flexDirection: "row",
        gap: 10
    },
    footer: {
        backgroundColor: "#182234",
        opacity: 0.9,
        alignSelf: "flex-end",
        height: 70,
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: 20,
        justifyContent: "flex-end",
        alignItems: "center",
        borderTopColor: "#263346",
        borderTopWidth: 1
    }

});
