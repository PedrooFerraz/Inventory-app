import DrawerMenu from "@/components/drawer-menu";
import InventoryProgress from "@/components/inventory-progress";
import CameraScanner from "@/components/inventory/camera-scanner";
import ItemDescription from "@/components/item-description";
import NumericInput from "@/components/numeric-input";
import QRCodeInput from "@/components/qrcode-input";
import { fetchDescriptionByCode, fetchInventoryById, getItemByCode } from "@/models/inventory";
import { Inventory, Item } from "@/types/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, DrawerLayoutAndroid, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";


export default function InventoryScreen() {

    const params = useLocalSearchParams();
    const drawer = useRef<DrawerLayoutAndroid>(null);

    const [isLoading, setIsLoading] = useState(true)
    const [currentInventory, setCurrentInventory] = useState<Inventory | null>()
    const [showCamera, setShowCamera] = useState(false)
    const [currentItem, setCurrentItem] = useState<any>()
    const [showDescription, setShowDescription] = useState(false)
    const [description, setDescription] = useState("")

    useEffect(() => {
        getInventoryData()
        setIsLoading(false)
    }, [])

    const getInventoryData = async () => {
        const data = await fetchInventoryById(Number(params.id))
        setCurrentInventory(data)
    }

    const navigationView = () => (
        <DrawerMenu drawer={drawer}></DrawerMenu>
    );
    const handleCamView = () => {
        setShowCamera(!showCamera)
    }
    const handleScan = (e: any) => {
        handleCamView()
        console.log(e.data)
    }
    const handleEndEditingCode = async (e: any) => {
        const res = await getItemByCode(Number(params.id), e)
        console.log(res)
        if(res.length == 0){
            setDescription("Item não encontrado")
            return
        }
        setCurrentItem(res)
        getDescription(res[0].code)
    }
    const handleEndEditingLoc = (e: any) => {
        // fetchItemByCode()
        console.log(e)
    }

    const getDescription = async (item: string) =>{
        const res = await fetchDescriptionByCode(Number(params.id), item)
        if(!res)
            return
        setDescription(res[0].description)
        setShowDescription(true)
    }


    return (
        <DrawerLayoutAndroid style={styles.container}
            ref={drawer}
            drawerWidth={300}
            drawerPosition={"left"}
            renderNavigationView={navigationView}>

            {isLoading &&
                <View style={{ position: "absolute", width: "100%", height: "100%", zIndex: 10, backgroundColor: "rgba(24, 34, 52, 0.8)" }}>
                    <ActivityIndicator size={"large"} color={"#60A5FA"} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
                </View>
            }

            <ScrollView>

                <View style={styles.header} >
                    <Text style={styles.headerTitle}>Inventário</Text>
                    <TouchableOpacity onPress={() => drawer.current?.openDrawer()}>
                        <Ionicons name="menu" size={32} color={"#94A3B8"} />
                    </TouchableOpacity>
                </View>

                {
                    currentInventory &&
                    <InventoryProgress totalItems={currentInventory.totalItems} countedItems={currentInventory.countedItems}></InventoryProgress>
                }

                <View style={styles.content}>

                    <View style={styles.form}>


                        <QRCodeInput value="" onEndEditing={handleEndEditingCode} onScanPress={handleCamView} label="Código Material" placeholder="0000000000" iconName={"qr-code-outline"}></QRCodeInput>

                        {showDescription &&
                            <ItemDescription description={description}></ItemDescription>
                        }

                        <QRCodeInput value={""} onEndEditing={handleEndEditingLoc} onScanPress={handleCamView} label="Localização" placeholder="123a" iconName={"qr-code-outline"}></QRCodeInput>

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

            {
                showCamera &&
                <CameraScanner onButtonPress={handleCamView} onScan={handleScan}></CameraScanner>
            }

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
