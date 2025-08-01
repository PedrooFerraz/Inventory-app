import ButtonWithIcon from "@/components/button-with-icon";
import DrawerMenu from "@/components/drawer-menu";
import InventoryProgress from "@/components/inventory-progress";
import CameraScanner from "@/components/inventory/camera-scanner";
import ItemDescription from "@/components/item-description";
import { CustomModal } from "@/components/master/custom-modal";
import NumericInput from "@/components/numeric-input";
import QRCodeInput from "@/components/qrcode-input";
import { BatchOption, ErrorModalProps, Inventory, Item, scanTypes } from "@/types/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, DrawerLayoutAndroid, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { InventoryService } from "@/services/inventoryService";


export default function InventoryScreen() {

    const navigationView = () => (
        <DrawerMenu drawer={drawer} finalizeInventoryFunction={handleFinalizeInventory}></DrawerMenu>
    );

    const params = useLocalSearchParams();
    const drawer = useRef<DrawerLayoutAndroid>(null);
    const numericInputRef = useRef<{ clearInput: () => void }>(null);
    const qrCodeInputRefLoc = useRef<{ clearInput: () => void, setValue: (value: string) => void }>(null);
    const qrCodeInputRefCode = useRef<{ clearInput: () => void, setValue: (value: string) => void }>(null);

    const [progress, setProgress] = useState(0);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [observation, setObservation] = useState("");
    const [showCamera, setShowCamera] = useState(false);
    const [currentItem, setCurrentItem] = useState<Item>();
    const [itemNotFound, setItemNotFound] = useState(false);
    const [errorModal, setErrorModal] = useState<ErrorModalProps>({
        visible: false,
        title: "",
        message: "",
        onConfirm: () => { },
        onCancel: () => { },
    })
    const [wrongQuantity, setWrongQuantity] = useState(false);
    const [wrongLocation, setWrongLocation] = useState(false);
    const [currentQuantity, setCurrentQuantity] = useState(0);
    const [emptyCodeError, setEmptyCodeError] = useState(false);
    const [emptyLocError, setEmptyLocError] = useState(false);
    const [zeroQuantityError, setZeroQuantityError] = useState(false);
    const [pendingSubmit, setPendingSubmit] = useState(false);
    const [scanInputTarget, setScanInputTarget] = useState<scanTypes>() //C - Código Material; P - Posição
    const [currentLocation, setCurrentLocation] = useState("");
    const [currentCode, setCurrentCode] = useState("");
    const [showDescription, setShowDescription] = useState(false);
    const [currentInventory, setCurrentInventory] = useState<Inventory | null>();
    const [description, setDescription] = useState<{ item: Partial<Item> | string, status: boolean }>({ item: "", status: false });
    const [userChoices, setUserChoices] = useState<{
        ignoreLocation?: boolean;
        ignoreQuantity?: boolean;
    }>({});
    const [showBatchSelection, setShowBatchSelection] = useState(false);
    const [batchOptions, setBatchOptions] = useState<BatchOption[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

    useEffect(() => {
        getInventoryData()
        setIsLoading(false)
        restartForm()
    }, [])

    useEffect(() => {
        if (pendingSubmit) {
            handleSubmit()
            setPendingSubmit(false)
        }
    }, [userChoices])

    const handleCamView = (input?: scanTypes) => {
        if (input)
            setScanInputTarget(input)

        setShowCamera(!showCamera)
    }

    const onScan = (e: any) => {
        if (scanInputTarget === "C" && e.data !== undefined) {
            handleEndEditingCode(e.data)
            qrCodeInputRefCode.current?.setValue(e.data);
        }


        if (scanInputTarget === "P" && e.data !== undefined) {
            handleEndEditingLoc(e.data)
            qrCodeInputRefLoc.current?.setValue(e.data);
        }

        if (showCamera)
            handleCamView()

    }

    const handleEditCode = (code: string) => {
        const upperCaseCode = code.toUpperCase()
        setCurrentCode(upperCaseCode)
    }

    const handleEndEditingCode = async (code: string) => {
        setEmptyCodeError(false);
        setShowDescription(false);
        setSelectedBatch(null);

        if (code.trim() === "") {
            setCurrentCode("")
            setEmptyCodeError(true)
            return
        }

        const upperCaseCode = code.toUpperCase()
        setCurrentCode(upperCaseCode)

        if (currentInventory) {
            const batches = await InventoryService.getBatchesForItem(
                currentInventory.id,
                upperCaseCode
            );

            let batchQty = 0;

            batches.forEach(batch => {
                if (batch.batch !== "") {
                    batchQty++;
                }
            });

            if (batchQty > 1) {
                getBatch(batches)
                return
            }
        }
        defineCurrentItem(upperCaseCode, false)
    }

    const getBatch = (batches: BatchOption[]) => {
        setBatchOptions(batches);
        setShowBatchSelection(true);
    }

    const defineCurrentItem = async (code: string, hasManyBatch: boolean) => {
        let res
        if (selectedBatch && hasManyBatch) {
            res = await InventoryService.getItemByCodeAndBatch(Number(params.id), code, selectedBatch)
        }
        else {
            res = await InventoryService.getItemByCode(Number(params.id), code)
        }

        if (!res) {
            setDescription({ item: "Item não encontrado", status: false });
            setShowDescription(true);
            setCurrentItem(undefined);
            return;
        }

        setCurrentItem(res);
        setDescription({ item: res, status: true })
        setShowDescription(true)
    }

    const handleEditLoc = (loc: string) => {
        const locToUpperCase = loc.toUpperCase()
        setCurrentLocation(locToUpperCase);
    }

    const handleEndEditingLoc = async (loc: string) => {
        setEmptyLocError(false)
        if (loc.trim() === "") {
            setCurrentLocation("")
            setEmptyLocError(true)
            return
        }
        const locToUpperCase = loc.toUpperCase()
        setCurrentLocation(locToUpperCase);
    }

    const handleOnQuantityChange = (e: any) => {
        if (zeroQuantityError)
            setZeroQuantityError(false)

        setCurrentQuantity(Number(e))
    }
    const handleWrongQuantity = () => {
        setWrongQuantity(!wrongQuantity)
    }
    const handleWrongLocation = () => {
        setWrongLocation(!wrongLocation)
    }
    const handleConfirmWrongLocation = async () => {
        setUserChoices(prev => ({ ...prev, ignoreLocation: true }));
        handleWrongLocation()
    }
    const handleItemNotFound = () => {
        setItemNotFound(!itemNotFound)
    }
    const handleCustomModal = ({
        title,
        message,
        onConfirm,
        onCancel,
        visible,
    }: {
        title: string;
        message: string;
        onConfirm: () => void;
        onCancel: () => void;
        visible: boolean;
    }) => {
        setErrorModal({
            visible,
            title,
            message,
            onConfirm,
            onCancel,
        });
    }
    const handleSuccess = () => {
        setSuccess(!success)
    }
    const handleSubmit = async () => {

        if (currentCode.trim() === "" || currentLocation.trim() === "") {
            if (!emptyCodeError && currentCode.trim() === "")
                setEmptyCodeError(true)
            if (!emptyLocError && currentLocation.trim() === "")
                setEmptyLocError(true)
            return
        }

        if (batchOptions.length > 1 && !selectedBatch) {
            setShowBatchSelection(true);
            return;
        }

        if (currentQuantity === 0) {
            setZeroQuantityError(true)
            return
        }

        if (!currentItem) {
            setItemNotFound(true);
            return;
        }

        if (currentItem.expectedLocation !== currentLocation && !userChoices.ignoreLocation) {
            setWrongLocation(true);
        }

        if (currentQuantity !== currentItem.expectedQuantity && !userChoices.ignoreQuantity) {
            setWrongQuantity(true);
            return;
        }

        await confirmItem();
    }
    const handleFinalizeInventory = () => {

        let diff
        if (currentInventory) {
            diff = currentInventory?.totalItems - currentInventory?.countedItems;

            if (diff === 0) {
                handleCustomModal({
                    title: "Atenção",
                    message: "Realmente deseja finalizar o inventário? Após finalizar você não poderá mais adicionar novos registros",
                    onConfirm: () => { finalizeInventory() },
                    onCancel: () => { },
                    visible: true,
                })
            }
            if (diff > 0) {
                handleCustomModal({
                    title: "Atenção",
                    message: `Ainda restam itens a serem contados, realmente deseja finalizar o inventário? Após finalizar você não poderá adicionar novas contagens. Os materiais não contados serão considerados sem estoque.`,
                    onConfirm: () => { finalizeInventory() },
                    onCancel: () => { },
                    visible: true,
                })
            }
        }
    }
    const finalizeInventory = async () => {

        if (!currentInventory)
            return
        const res = await InventoryService.finalizeInventory(currentInventory?.id)
        if (res.success) {
            router.navigate("/")
            Alert.alert("Sucesso", "Contagem Concluída")
            return
        }
        Alert.alert("Error", "Ocorreu algum erro ao finalizar o inventário tente novamente")
    }

    const restartForm = () => {
        setCurrentItem(undefined);
        setShowDescription(false);
        setSelectedBatch(null)
        setCurrentCode("")
        setCurrentLocation("")
        setUserChoices({});
        setObservation("")
        qrCodeInputRefCode.current?.clearInput();
        qrCodeInputRefLoc.current?.clearInput();
        numericInputRef.current?.clearInput();
        getInventoryData();
        setProgress(prev => prev + 1)
    }
    const confirmItem = async () => {
        if (!currentItem || !currentInventory)
            return;
        let status = 1
        if (currentItem.expectedQuantity !== currentQuantity) {
            status = 2
        }
        if (currentItem.expectedLocation !== currentLocation) {
            status = 3
        }
        if (currentItem.expectedLocation !== currentLocation && currentItem.expectedQuantity !== currentQuantity) {
            status = 4
        }
        const updatedItem = {
            reportedQuantity: currentQuantity,
            reportedLocation: currentLocation,
            observation: observation,
            operator: Array.isArray(params.operator) ? params.operator[0] : params.operator as string,
            status: status
        }
        const res = await InventoryService.updateItem(currentItem.id, currentInventory.id, updatedItem)

        if (res === "Item has already been accounted for") {
            handleCustomModal(
                {
                    title: "Error",
                    message: "Este item já foi contabilizado, deseja substituir?",
                    onConfirm: () => { replaceItem() },
                    onCancel: () => { },
                    visible: true,
                }
            )
            restartForm()
            return

        }

        handleSuccess()
        restartForm();
    }
    const addNewItem = async () => {

        if (!currentInventory)
            return;

        const newItem = {
            code: currentCode,
            reportedQuantity: currentQuantity,
            reportedLocation: currentLocation,
            observation: observation,
            operator: Array.isArray(params.operator) ? params.operator[0] : params.operator as string,
        }

        const res = await InventoryService.addNewItem(currentInventory.id, newItem)

        if (res.success) {
            handleSuccess()
            restartForm();
        }
    }

    const replaceItem = async () => {
        if (!currentItem || !currentInventory)
            return;

        const dataToReplace = {
            code: currentCode,
            reportedQuantity: currentQuantity,
            reportedLocation: currentLocation,
            observation: observation,
            operator: Array.isArray(params.operator) ? params.operator[0] : params.operator as string,
        }

        const res = await InventoryService.replaceItem(currentInventory.id, currentItem.id, dataToReplace)

        if (res.success) {
            handleSuccess()
            restartForm();
        }


    }

    const getInventoryData = async () => {
        const res = await InventoryService.getInventory(Number(params.id))
        setCurrentInventory(res)
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
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}}>
                <ScrollView>

                    <View style={styles.header} >
                        <Text style={styles.headerTitle}>Inventário - {currentInventory?.inventoryDocument} | {currentInventory?.inventoryYear}</Text>
                        <TouchableOpacity onPress={() => drawer.current?.openDrawer()}>
                            <Ionicons name="menu" size={32} color={"#FFF"} />
                        </TouchableOpacity>
                    </View>

                    {
                        currentInventory &&
                        <InventoryProgress key={progress} totalItems={currentInventory.totalItems} countedItems={currentInventory.countedItems}></InventoryProgress>
                    }

                    <View style={styles.content}>

                        <View style={styles.form}>


                            <QRCodeInput onEditing={handleEditCode} error={emptyCodeError} ref={qrCodeInputRefCode} onEndEditing={handleEndEditingCode} onScanPress={handleCamView} label="Código Material *" placeholder="0000000000" iconName={"qr-code-outline"}></QRCodeInput>

                            {showDescription &&
                                <ItemDescription status={description.status} data={description.item} ></ItemDescription>
                            }

                            <QRCodeInput onEditing={handleEditLoc} error={emptyLocError} ref={qrCodeInputRefLoc} onEndEditing={handleEndEditingLoc} onScanPress={handleCamView} label="Posição *" placeholder="123a" iconName={"qr-code-outline"}></QRCodeInput>

                            <NumericInput error={zeroQuantityError} ref={numericInputRef} onChange={handleOnQuantityChange}></NumericInput>

                            <View style={{ gap: 10 }}>
                                <Text style={styles.label}>Observação</Text>
                                <TextInput
                                    style={styles.observationInput}
                                    value={observation}
                                    onChangeText={(text) => setObservation(text)}
                                >
                                </TextInput>
                            </View>

                        </View>

                        <TouchableOpacity style={styles.nextButton} activeOpacity={0.5} onPress={handleSubmit}>
                            <Ionicons name="checkmark-circle-outline" size={20} color={"white"} />
                            <Text style={styles.buttonName}>Confirmar & Próximo</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>

                {
                    showCamera &&
                    <CameraScanner onButtonPress={handleCamView} onScan={onScan}></CameraScanner>
                }

                <CustomModal onClose={handleWrongQuantity} title="Atenção" visible={wrongQuantity}>
                    <Text style={{ fontSize: 16, color: "white", marginBottom: 22 }}>
                        A quantidade contada não confere. Deseja aprovar?
                    </Text>
                    <View style={{ gap: 20 }}>
                        <ButtonWithIcon
                            color="#7F95B9"
                            icon="close-outline"
                            label="Reavaliar"
                            onPress={() => handleWrongQuantity()}
                        />
                        <ButtonWithIcon
                            color="#5A7BA1"
                            icon="checkmark-outline"
                            label="Aprovar"
                            onPress={async () => {
                                setUserChoices(prev => ({ ...prev, ignoreQuantity: true }));
                                handleWrongQuantity();
                                await confirmItem();
                            }}
                        />
                    </View>
                </CustomModal>

                <CustomModal onClose={handleWrongLocation} title="Atenção" visible={wrongLocation}>
                    <Text style={{ fontSize: 16, color: "white", marginBottom: 22 }}>
                        A Posição não confere. Deseja continuar?
                    </Text>
                    <View style={{ gap: 20 }}>
                        <ButtonWithIcon
                            color="#7F95B9"
                            icon="close-outline"
                            label="Reavaliar"
                            onPress={() => {
                                handleWrongLocation();
                                setWrongQuantity(false)
                                // Foca no campo de Posição para correção
                            }}
                        />
                        <ButtonWithIcon
                            color="#5A7BA1"
                            icon="checkmark-outline"
                            label="Confirmar"
                            onPress={async () => {
                                await handleConfirmWrongLocation()
                            }}
                        />
                    </View>
                </CustomModal>

                <CustomModal onClose={handleItemNotFound} title="Atenção" visible={itemNotFound}>
                    <Text style={{ fontSize: 16, color: "white", marginBottom: 22 }}>
                        Este item não consta na lista, deseja adicionar?
                    </Text>
                    <View style={{ gap: 20 }}>
                        <ButtonWithIcon
                            color="#7F95B9"
                            icon="close-outline"
                            label="Cancelar"
                            onPress={() => {
                                handleItemNotFound()
                                restartForm()
                            }}
                        />
                        <ButtonWithIcon
                            color="#5A7BA1"
                            icon="add-outline"
                            label="Adicionar"
                            onPress={async () => {
                                await addNewItem();
                                handleItemNotFound();
                            }}
                        />
                    </View>
                </CustomModal>

                <CustomModal onClose={handleSuccess} title="Sucesso" visible={success}>
                    <Text style={{ fontSize: 16, color: "white", marginBottom: 22 }}>
                        Item inserido com sucesso!
                    </Text>
                    <View style={{ gap: 20 }}>
                        <ButtonWithIcon
                            color="#5A7BA1"
                            icon="checkmark-outline"
                            label="Ok"
                            onPress={handleSuccess}
                        />

                    </View>
                </CustomModal>
                {
                    errorModal.visible &&
                    <CustomModal
                        onClose={() => handleCustomModal({ ...errorModal, visible: false })}
                        title={errorModal.title}
                        visible={errorModal.visible}
                    >
                        <Text style={{ fontSize: 16, color: "white", marginBottom: 22 }}>
                            {errorModal.message}
                        </Text>
                        <View style={{ gap: 20 }}>
                            <ButtonWithIcon
                                color="#5A7BA1"
                                icon="checkmark-outline"
                                label="Confirmar"
                                onPress={() => {
                                    errorModal.onConfirm();
                                    handleCustomModal({ ...errorModal, visible: false });
                                }}
                            />
                            <ButtonWithIcon
                                color="#7F95B9"
                                icon="close-outline"
                                label="Cancelar"
                                onPress={() => {
                                    errorModal.onCancel();
                                    restartForm()
                                    handleCustomModal({ ...errorModal, visible: false });
                                }}
                            />
                        </View>
                    </CustomModal>


                }

                <CustomModal
                    onClose={() => setShowBatchSelection(false)}
                    title="Selecione o Lote"
                    visible={showBatchSelection}
                >

                    <ScrollView style={{ maxHeight: 300 }}>
                        {batchOptions.map((batch) => (
                            <TouchableOpacity
                                key={batch.batch}
                                style={[
                                    styles.batchOption,
                                    selectedBatch === batch.batch && styles.selectedBatchOption
                                ]}
                                onPress={() => setSelectedBatch(batch.batch)}
                            >
                                <Text style={styles.batchText}>Lote: {batch.batch}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>


                    <View style={{ marginTop: 20 }}>
                        <ButtonWithIcon
                            color="#5A7BA1"
                            icon="checkmark-outline"
                            label="Confirmar Lote"
                            onPress={() => {
                                if (!selectedBatch) {
                                    Alert.alert("Atenção", "Por favor, selecione um lote");
                                    return;
                                }
                                defineCurrentItem(currentCode, true)
                                setShowBatchSelection(false);
                            }}
                        />
                    </View>
                </CustomModal>
            </KeyboardAvoidingView>

        </DrawerLayoutAndroid>
    )
}


const styles = StyleSheet.create({

    header: {
        height: 70,
        width: "100%",
        flexDirection: "row",
        backgroundColor: "#4E6A92",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        color: "white",
        borderBottomColor: "#79859B",
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
        backgroundColor: "#3A5073"
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
        backgroundColor: "#5A7BA3",
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
        backgroundColor: "#8BA1C3",
        padding: 12,
        paddingHorizontal: 28,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        flexDirection: "row",
        gap: 10
    },
    footer: {
        backgroundColor: "#4E6A92",
        opacity: 0.9,
        alignSelf: "flex-end",
        height: 70,
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: 20,
        justifyContent: "flex-end",
        alignItems: "center",
        borderTopColor: "#3B5275",
        borderTopWidth: 1
    },
    observationInput: {
        height: 50,
        fontSize: 16,
        flex: 1,
        color: "white",
        borderWidth: 1,
        borderColor: "#79859B",
        borderRadius: 8,
        paddingHorizontal: 10
    },
    label: {
        color: "rgba(255, 255, 255, 0.75)",
        fontWeight: "500",
        fontSize: 14
    },
    batchOption: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#5A7BA1',
        borderRadius: 8,
        backgroundColor: '#849BBD',
        marginBottom: 8,
    },
    selectedBatchOption: {
        borderColor: '#3B5275',
        backgroundColor: '#3B5275',
    },
    batchText: {
        color: 'white',
        fontSize: 16,
    },
    batchLabel: {
        fontWeight: 'bold',
        color: '#CBD5E1',
    },

});
