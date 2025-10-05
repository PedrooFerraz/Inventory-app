import ButtonWithIcon from "@/components/button-with-icon";
import DrawerMenu from "@/components/drawer-menu";
import InventoryProgress from "@/components/inventory-progress";
import CameraScanner from "@/components/inventory/camera-scanner";
import ItemDescription from "@/components/item-description";
import { CustomModal } from "@/components/master/custom-modal";
import NumericInput from "@/components/numeric-input";
import QRCodeInput from "@/components/qrcode-input";
import { BatchOption, Inventory, Item, scanTypes } from "@/types/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, DrawerLayoutAndroid, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { InventoryService } from "@/services/inventoryService";

export default function InventoryByCodeScreen() {
    const navigationView = () => (
        <DrawerMenu drawer={drawer} finalizeInventoryFunction={handleFinalizeInventory}></DrawerMenu>
    );

    const params = useLocalSearchParams();
    const drawer = useRef<DrawerLayoutAndroid>(null);
    const numericInputRef = useRef<{ clearInput: () => void }>(null);
    const qrCodeInputRefLoc = useRef<{ clearInput: () => void, setValue: (value: string) => void }>(null);
    const qrCodeInputRefCode = useRef<{ clearInput: () => void, setValue: (value: string) => void }>(null);

    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [observation, setObservation] = useState("");
    const [showCamera, setShowCamera] = useState(false);
    const [currentItem, setCurrentItem] = useState<Item | null>(null);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [alreadyCountModalVisible, setAlreadyCountModalVisible] = useState(false);
    const [errorTitle, setErrorTitle] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [modalAction, setModalAction] = useState<() => void>(() => { });
    const [modalCancelAction, setModalCancelAction] = useState<() => void>(() => { });
    const [currentQuantity, setCurrentQuantity] = useState(0);
    const [zeroQuantityError, setZeroQuantityError] = useState(false);
    const [emptyCodeError, setEmptyCodeError] = useState(false);
    const [emptyLocError, setEmptyLocError] = useState(false);
    const [scanInputTarget, setScanInputTarget] = useState<scanTypes>();
    const [currentLocation, setCurrentLocation] = useState("");
    const [currentCode, setCurrentCode] = useState("");
    const [showDescription, setShowDescription] = useState(false);
    const [description, setDescription] = useState<{ item: Partial<Item> | string, status: boolean }>({ item: "", status: false });
    const [currentInventory, setCurrentInventory] = useState<Inventory | null>(null);
    const [showBatchSelection, setShowBatchSelection] = useState(false);
    const [batchOptions, setBatchOptions] = useState<BatchOption[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
    const [successVisible, setSuccessVisible] = useState(false);
    const [ignoreQuantity, setIgnoreQuantity] = useState(false);
    const [ignoreLocation, setIgnoreLocation] = useState(false);

    useEffect(() => {
        loadInventoryData();
        setIsLoading(false);
    }, []);

    const loadInventoryData = async () => {
        try {
            const inventory = await InventoryService.getInventory(Number(params.id));
            setCurrentInventory(inventory);
            setProgress(inventory ? inventory.countedItems / inventory.totalItems : 0);
        } catch (error) {
            console.error('Error loading inventory:', error);
        }
    };

    const handleCamView = (input?: scanTypes) => {
        if (input) setScanInputTarget(input);
        setShowCamera(!showCamera);
    };

    const onScan = (e: any) => {
        if (scanInputTarget === "C" && e.data !== undefined) {
            handleEndEditingCode(e.data);
            qrCodeInputRefCode.current?.setValue(e.data);
        }

        if (scanInputTarget === "P" && e.data !== undefined) {
            handleEndEditingLoc(e.data);
            qrCodeInputRefLoc.current?.setValue(e.data);
        }

        if (showCamera) handleCamView();
    };

    const handleEditCode = (code: string) => {
        const upperCaseCode = code.toUpperCase();
        setCurrentCode(upperCaseCode);
    };

    const handleEndEditingCode = async (code: string) => {
        setEmptyCodeError(false);
        setShowDescription(false);
        setSelectedBatch(null);

        if (code.trim() === "") {
            setCurrentCode("");
            setEmptyCodeError(true);
            return;
        }

        const upperCaseCode = code.toUpperCase();
        setCurrentCode(upperCaseCode);

        const batches = await InventoryService.getBatchesForItem(Number(params.id), upperCaseCode);

        let batchQty = 0;
        batches.forEach(batch => {
            if (batch.batch !== "") batchQty++;
        });

        if (batchQty > 1) {
            setBatchOptions(batches);
            setShowBatchSelection(true);
            return;
        }

        await defineCurrentItem(upperCaseCode, false);
    };

    const defineCurrentItem = async (code: string, hasManyBatch: boolean) => {
        let res: Item | undefined;
        if (selectedBatch && hasManyBatch) {
            res = await InventoryService.getItemByCodeAndBatch(Number(params.id), code, selectedBatch);
        } else {
            res = await InventoryService.getItemByCode(Number(params.id), code);
        }

        if (!res) {
            setDescription({ item: "Item não encontrado", status: false });
            setShowDescription(true);
            setCurrentItem(null);
            return;
        }

        setCurrentItem(res);
        setDescription({ item: res, status: true });
        setShowDescription(true);
    };

    const handleEditLoc = (loc: string) => {
        const locToUpperCase = loc.toUpperCase();
        setCurrentLocation(locToUpperCase);
    };

    const handleEndEditingLoc = async (loc: string) => {
        setEmptyLocError(false);
        if (loc.trim() === "") {
            setCurrentLocation("");
            setEmptyLocError(true);
            return;
        }
        const locToUpperCase = loc.toUpperCase();
        setCurrentLocation(locToUpperCase);
    };

    const handleOnQuantityChange = (e: any) => {
        if (zeroQuantityError) setZeroQuantityError(false);
        setCurrentQuantity(Number(e));
    };

    const handleFinalizeInventory = () => {
        if (!currentInventory) return;

        const diff = currentInventory.totalItems - currentInventory.countedItems;

        let message = "";
        if (diff === 0) {
            message = "Realmente deseja finalizar o inventário? Após finalizar você não poderá mais adicionar novos registros";
        } else {
            message = `Ainda restam itens a serem contados, realmente deseja finalizar o inventário? Após finalizar você não poderá adicionar novas contagens. Os materiais não contados serão considerados sem estoque.`;
        }

        showErrorModal("Atenção", message, async () => {
            const res = await InventoryService.finalizeInventory(currentInventory.id);
            if (res.success) {
                Alert.alert("Sucesso", "Contagem Concluída");
                router.navigate("/");
            } else {
                Alert.alert("Erro", "Ocorreu algum erro ao finalizar o inventário, tente novamente");
            }
        }, () => {
            setErrorTitle("");
            setErrorMessage("");
            setModalAction(() => { });
            setModalCancelAction(() => { });
            setErrorModalVisible(false)
        });
    };

    const restartForm = () => {
        setCurrentItem(null);
        setShowDescription(false);
        setSelectedBatch(null);
        setCurrentCode("");
        setCurrentLocation("");
        setObservation("");
        setZeroQuantityError(false);
        setEmptyCodeError(false);
        setEmptyLocError(false);
        setIgnoreQuantity(false);
        setIgnoreLocation(false);
        qrCodeInputRefCode.current?.clearInput();
        qrCodeInputRefLoc.current?.clearInput();
        numericInputRef.current?.clearInput();
        loadInventoryData();
        setProgress(prev => prev + 1);
        setBatchOptions([]);
    };

    const handleSubmit = async () => {
        if (currentCode.trim() === "" || currentLocation.trim() === "") {
            if (currentCode.trim() === "") setEmptyCodeError(true);
            if (currentLocation.trim() === "") setEmptyLocError(true);
            return;
        }

        if (currentQuantity === 0) {
            setZeroQuantityError(true);
            return;
        }

        if (batchOptions.length > 1 && !selectedBatch) {
            setShowBatchSelection(true);
            return;
        }

        const itemData = {
            reportedQuantity: currentQuantity,
            reportedLocation: currentLocation,
            observation,
            operator: Array.isArray(params.operator) ? params.operator[0] : params.operator as string,
            status: 1, // Default status; service will adjust based on divergences
        };

        let response;
        if (currentItem) {
            response = await InventoryService.updateItem(currentItem.id, Number(params.id), itemData, ignoreQuantity, ignoreLocation);
        } else {
            response = await InventoryService.addNewItem(Number(params.id), { code: currentCode, ...itemData });
        }

        handleServiceResponse(response, itemData);
    };

    const handleServiceResponse = (
        response: { success: boolean; error?: string; errors?: string[]; data?: any },
        itemData: { reportedQuantity: number, reportedLocation: string, observation: string, operator: string, status: number },
        ignoreErrors: { quantity?: boolean; location?: boolean } = { quantity: false, location: false }
    ) => {
        if (response.success) {
            setSuccessVisible(true);
            restartForm();
            return;
        }

        // Handle multiple errors if present
        if (response.errors && response.errors.length > 0) {
            const handleNextError = (remainingErrors: string[], currentIgnoreErrors: { quantity?: boolean; location?: boolean }) => {
                if (remainingErrors.length === 0) return;

                const error = remainingErrors[0];
                const nextErrors = remainingErrors.slice(1);

                switch (error) {
                    case 'quantity_mismatch':
                        showErrorModal("Quantidade Divergente", "Aprovar mesmo assim?", async () => {
                            const updatedIgnoreErrors = { ...currentIgnoreErrors, quantity: true };
                            setIgnoreQuantity(true); // Update state for UI consistency
                            setErrorModalVisible(false); // Ensure modal closes
                            if (currentItem) {
                                const res = await InventoryService.updateItem(currentItem.id, Number(params.id), itemData, updatedIgnoreErrors.quantity, updatedIgnoreErrors.location);
                                handleServiceResponse(res, itemData, updatedIgnoreErrors);
                            }
                        }, () => {
                            setErrorModalVisible(false);
                            restartForm();
                        });
                        break;
                    case 'location_mismatch':
                        showErrorModal("Posição Divergente", "Continuar mesmo assim?", async () => {
                            const updatedIgnoreErrors = { ...currentIgnoreErrors, location: true };
                            setIgnoreLocation(true); // Update state for UI consistency
                            setErrorModalVisible(false); // Ensure modal closes
                            if (currentItem) {
                                const res = await InventoryService.updateItem(currentItem.id, Number(params.id), itemData, updatedIgnoreErrors.quantity, updatedIgnoreErrors.location);
                                handleServiceResponse(res, itemData, updatedIgnoreErrors);
                            }
                        }, () => {
                            setErrorModalVisible(false);
                            restartForm();
                        });
                        break;
                    default:
                        showErrorModal("Erro", "Operação falhou.", () => {
                            setErrorModalVisible(false);
                        }, () => {
                            setErrorModalVisible(false);
                            restartForm();
                        });
                }
            };

            handleNextError(response.errors, ignoreErrors);
            return;
        }

        // Handle single errors
        switch (response.error) {
            case 'already_counted':
                showAlreadyCountModal(
                    'Item Já Contabilizado',
                    `Já foram contabilizadas ${response.data.lastCount} unidades na posição ${response.data.lastLoc}\n\nEscolha:`,
                    async () => {
                        if (currentItem) {
                            setAlreadyCountModalVisible(false);
                            const replaceRes = await InventoryService.replaceItem(Number(params.id), currentItem.id, {
                                reportedQuantity: itemData.reportedQuantity,
                                reportedLocation: itemData.reportedLocation,
                                observation: itemData.observation,
                                operator: itemData.operator,
                            });
                            handleServiceResponse(replaceRes, itemData, ignoreErrors);
                        }
                    },
                    async () => {
                        setAlreadyCountModalVisible(false);
                        const newCount = await InventoryService.addNewItem(Number(params.id), { code: currentCode, ...itemData });
                        console.log(newCount);
                        handleServiceResponse(newCount, itemData, ignoreErrors);
                    },
                    () => {
                        setAlreadyCountModalVisible(false);
                        restartForm();
                    }
                );
                break;
            case 'quantity_mismatch':
                showErrorModal("Quantidade Divergente", "Aprovar mesmo assim?", async () => {
                    const updatedIgnoreErrors = { ...ignoreErrors, quantity: true };
                    setIgnoreQuantity(true); // Update state for UI consistency
                    setErrorModalVisible(false);
                    if (currentItem) {
                        const res = await InventoryService.updateItem(currentItem.id, Number(params.id), itemData, updatedIgnoreErrors.quantity, updatedIgnoreErrors.location);
                        handleServiceResponse(res, itemData, updatedIgnoreErrors);
                    }
                }, () => {
                    setErrorModalVisible(false);
                    restartForm();
                });
                break;
            case 'location_mismatch':
                showErrorModal("Posição Divergente", "Continuar mesmo assim?", async () => {
                    const updatedIgnoreErrors = { ...ignoreErrors, location: true };
                    setIgnoreLocation(true); // Update state for UI consistency
                    setErrorModalVisible(false); // Ensure modal closes
                    if (currentItem) {
                        const res = await InventoryService.updateItem(currentItem.id, Number(params.id), itemData, updatedIgnoreErrors.quantity, updatedIgnoreErrors.location);
                        handleServiceResponse(res, itemData, updatedIgnoreErrors);
                    }
                }, () => {
                    setErrorModalVisible(false);
                    restartForm();
                });
                break;
            case 'exists_in_other_location':
                showErrorModal("Item Existe em Outra Posição", "Adicionar mesmo assim?", async () => {
                    setErrorModalVisible(false); // Ensure modal closes
                    const res = await InventoryService.addNewItem(Number(params.id), { code: currentCode, ...itemData }, true);
                    handleServiceResponse(res, itemData, ignoreErrors);
                }, () => {
                    setErrorModalVisible(false);
                    restartForm();
                });
                break;
            case 'already_counted_in_other':
                showErrorModal("Item Contado em Outra Posição", `Já contado na posição ${response.data}. Escolha: Nova contagem, Somar à anterior ou Cancelar.`, async () => {
                    setErrorModalVisible(false); // Ensure modal closes
                    const res = await InventoryService.addNewItem(Number(params.id), { code: currentCode, ...itemData }, false, true);
                    handleServiceResponse(res, itemData, ignoreErrors);
                }, async () => {
                    setErrorModalVisible(false); // Ensure modal closes
                    await InventoryService.sumToPreviousCount(Number(params.id), currentCode, response.data, currentQuantity);
                    restartForm();
                });
                break;
            default:
                showErrorModal("Erro", "Operação falhou.", () => {
                    setErrorModalVisible(false);
                }, () => {
                    setErrorModalVisible(false);
                    restartForm();
                });
        }
    };

    const showErrorModal = (title: string, message: string, onConfirm: () => void, onCancel: () => void) => {
        setErrorTitle(title);
        setErrorMessage(message);
        setModalAction(() => onConfirm);
        setModalCancelAction(() => onCancel);
        setErrorModalVisible(true);
    };

    const showAlreadyCountModal = (title: string, message: string, onReplace: () => void, onAdd: () => void, onCancel: () => void) => {
        setErrorTitle(title);
        setErrorMessage(message);
        setModalAction(() => onReplace);
        setModalCancelAction(() => onAdd);
        setAlreadyCountModalVisible(true);
    };

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
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView>
                    <View style={styles.header} >
                        <Text style={styles.headerTitle}>Inventário - {currentInventory?.inventoryDocument} | {currentInventory?.inventoryYear}</Text>
                        <TouchableOpacity onPress={() => drawer.current?.openDrawer()}>
                            <Ionicons name="menu" size={32} color={"#FFF"} />
                        </TouchableOpacity>
                    </View>

                    {currentInventory &&
                        <InventoryProgress key={progress} totalItems={currentInventory.totalItems} countedItems={currentInventory.countedItems}></InventoryProgress>
                    }

                    <View style={styles.content}>
                        <View style={styles.form}>
                            <QRCodeInput onEditing={handleEditCode} error={emptyCodeError} ref={qrCodeInputRefCode} onEndEditing={handleEndEditingCode} onScanPress={() => handleCamView("C")} label="Código Material *" placeholder="0000000000" iconName={"qr-code-outline"}></QRCodeInput>

                            {showDescription &&
                                <ItemDescription status={description.status} data={description.item} ></ItemDescription>
                            }

                            <QRCodeInput onEditing={handleEditLoc} error={emptyLocError} ref={qrCodeInputRefLoc} onEndEditing={handleEndEditingLoc} onScanPress={() => handleCamView("P")} label="Posição *" placeholder="123a" iconName={"qr-code-outline"}></QRCodeInput>

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

                {showCamera &&
                    <CameraScanner onButtonPress={handleCamView} onScan={onScan}></CameraScanner>
                }

                <CustomModal visible={errorModalVisible} title={errorTitle} onClose={() => setErrorModalVisible(false)}>
                    <Text style={{ fontSize: 16, color: "white", marginBottom: 22 }}>
                        {errorMessage}
                    </Text>
                    <View style={{ gap: 20 }}>
                        <ButtonWithIcon
                            color="#5A7BA1"
                            icon="checkmark-outline"
                            label="Confirmar"
                            onPress={modalAction}
                        />
                        <ButtonWithIcon
                            color="#7F95B9"
                            icon="close-outline"
                            label="Cancelar"
                            onPress={modalCancelAction}
                        />
                    </View>
                </CustomModal>

                <CustomModal visible={alreadyCountModalVisible} title={errorTitle} onClose={() => setAlreadyCountModalVisible(false)}>
                    <Text style={{ fontSize: 16, color: "white", marginBottom: 22 }}>
                        {errorMessage}
                    </Text>
                    <View style={{ gap: 20 }}>
                        <ButtonWithIcon
                            color="#5A7BA1"
                            icon="checkmark-outline"
                            label="Substituir"
                            onPress={modalAction}
                        />
                        <ButtonWithIcon
                            color="#5A7BA1"
                            icon="add-outline"
                            label="Adicionar nova Contagem"
                            onPress={modalCancelAction}
                        />
                        <ButtonWithIcon
                            color="#7F95B9"
                            icon="close-outline"
                            label="Cancelar"
                            onPress={() => {
                                setAlreadyCountModalVisible(false);
                                restartForm();
                            }}
                        />
                    </View>
                </CustomModal>

                <CustomModal onClose={() => {
                    setSuccessVisible(false);
                    restartForm();
                }} title="Sucesso" visible={successVisible}>
                    <Text style={{ fontSize: 16, color: "white", marginBottom: 22 }}>
                        Item inserido com sucesso!
                    </Text>
                    <View style={{ gap: 20 }}>
                        <ButtonWithIcon
                            color="#5A7BA1"
                            icon="checkmark-outline"
                            label="Ok"
                            onPress={() => {
                                setSuccessVisible(false);
                                restartForm();
                            }}
                        />
                    </View>
                </CustomModal>

                <CustomModal
                    onClose={() => setShowBatchSelection(false)}
                    title="Selecione o Lote"
                    visible={showBatchSelection}
                >
                    <ScrollView style={{ maxHeight: 300 }}>
                        {batchOptions.map((batch, i) => (
                            <TouchableOpacity
                                key={i}
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
                                defineCurrentItem(currentCode, true);
                                setShowBatchSelection(false);
                            }}
                        />
                    </View>
                </CustomModal>
            </KeyboardAvoidingView>
        </DrawerLayoutAndroid>
    );
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