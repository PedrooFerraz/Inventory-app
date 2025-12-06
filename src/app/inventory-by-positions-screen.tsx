import SelectItemCard from '@/components/inventory/select-item-card';
import { CustomModal } from '@/components/master/custom-modal';
import ButtonWithIcon from '@/components/button-with-icon';
import { useDatabase } from '@/hooks/useDatabase';
import { InventoryItem } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { InventoryService } from '@/services/inventoryService';
import NumericInput from '@/components/numeric-input';

export default function InventoryByPosition() {
    const params = useLocalSearchParams();
    const inventoryId = Number(params.id);
    const location = params.location as string;
    const operator = params.operator as string;
    const numericInputRef = useRef<{ clearInput: () => void }>(null);

    const { items, refresh } = useDatabase({ inventoryId, location });

    const [filter, setFilter] = useState<0 | 2 | 3>(3); // 0-Não Contados, 2-Contados, 3-Todos
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [alreadyCountModalVisible, setAlreadyCountModalVisible] = useState(false);
    const [alreadyCountInOtherModalVisible, setAlreadyCountInOtherModalVisible] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [modalAction, setModalAction] = useState<() => void>(() => { });
    const [modalActionTwo, setModalActionTwo] = useState<() => void>(() => { });
    const [modalCancelAction, setModalCancelAction] = useState<() => void>(() => { });
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [code, setCode] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [reportedLocation, setReportedLocation] = useState(location);
    const [observation, setObservation] = useState('');
    const [batch, setBatch] = useState('');
    const [ignoreErrors, setIgnoreErrors] = useState<{ quantity?: boolean; location?: boolean }>({ quantity: false, location: false });
    const [zeroQuantityError, setZeroQuantityError] = useState(false);
    const [codeError, setCodeError] = useState(false);
    const [locationError, setLocationError] = useState(false);

    // Preenche os inputs quando um item é selecionado para edição
    useEffect(() => {
        if (selectedItem) {
            setQuantity(selectedItem.reportedQuantity || 0);
            setBatch(selectedItem.batch || '');
            setObservation(selectedItem.observation || '');
            setCode(selectedItem.code || '');
            setReportedLocation(selectedItem.reportedLocation || selectedItem.expectedLocation || location); // Preenche localização
            setCodeError(false);
            setZeroQuantityError(false);
            setLocationError(false);
        } else {
            setCode('');
            setQuantity(0);
            setReportedLocation(location); // Inicializa com a localização padrão
            setObservation('');
            setCodeError(false);
            setZeroQuantityError(false);
            setLocationError(false);
        }
    }, [selectedItem, location]);

    // Filtra itens com base no status e na pesquisa por código
    const filteredItems = items.filter((item) => {
        const isCounted = item.reportedQuantity !== null;
        const itemStatus = isCounted ? 2 : 0;
        const matchesStatus = filter === 3 || itemStatus === filter;
        const matchesSearch = item.code.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const FilterButton = ({ status, label }: { status: 0 | 2 | 3; label: string }) => (
        <TouchableOpacity
            style={[styles.filterButton, filter === status && styles.activeFilter]}
            onPress={() => setFilter(status)}
        >
            <Text
                style={[
                    styles.filterButtonText,
                    filter === status && styles.activeFilterText,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    const handleOnQuantityChange = (e: any) => {
        if (zeroQuantityError) setZeroQuantityError(false);
        setQuantity(Number(e));
    };

    const handleItemPress = (item: InventoryItem) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const handleAddNewItem = () => {
        setSelectedItem(null);
        setModalVisible(true);
    };

    const restartForm = () => {
        setSelectedItem(null);
        setCode('');
        setQuantity(0);
        setReportedLocation(location); // Reseta localização
        setObservation('');
        setIgnoreErrors({ quantity: false, location: false });
        setModalVisible(false);
        setErrorModalVisible(false);
        setAlreadyCountModalVisible(false);
        setAlreadyCountInOtherModalVisible(false);
        setSuccessModalVisible(false);
        setCodeError(false);
        setZeroQuantityError(false);
        setLocationError(false);
        refresh();
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

    const showAlreadyCountInOtherModal = (title: string, message: string, onReplace: () => void, onSum: () => void, onAdd: () => void, onCancel: () => void) => {
        setErrorTitle(title);
        setErrorMessage(message);
        setModalAction(() => onReplace);
        setModalActionTwo(() => onAdd);
        setModalCancelAction(() => onSum);
        setAlreadyCountInOtherModalVisible(true);
    };

    const handleServiceResponse = (
        response: { success: boolean; error?: string; errors?: string[]; data?: any },
        itemData: { reportedQuantity: number; reportedLocation: string; observation: string; operator: string; status: number },
        currentIgnoreErrors: { quantity?: boolean; location?: boolean } = { quantity: false, location: false }
    ) => {
        if (response.success) {
            setSuccessModalVisible(true);
            restartForm();
            return;
        }

        // Handle multiple errors if present
        if (response.errors && response.errors.length > 0) {
            const handleNextError = (remainingErrors: string[], localIgnoreErrors: { quantity?: boolean; location?: boolean }) => {
                if (remainingErrors.length === 0) return;

                const error = remainingErrors[0];
                const nextErrors = remainingErrors.slice(1);

                switch (error) {
                    case 'quantity_mismatch':
                        showErrorModal("Quantidade Divergente", "Aprovar mesmo assim?", async () => {
                            const updatedIgnoreErrors = { ...localIgnoreErrors, quantity: true };
                            setIgnoreErrors(updatedIgnoreErrors);
                            setErrorModalVisible(false);
                            if (selectedItem) {
                                const res = await InventoryService.updateItem(selectedItem.id, inventoryId, itemData, updatedIgnoreErrors.quantity, updatedIgnoreErrors.location);
                                handleServiceResponse(res, itemData, updatedIgnoreErrors);
                            }
                        }, () => {
                            setErrorModalVisible(false);
                            restartForm();
                        });
                        break;
                    case 'location_mismatch':
                        showErrorModal("Posição Divergente", "Continuar mesmo assim?", async () => {
                            const updatedIgnoreErrors = { ...localIgnoreErrors, location: true };
                            setIgnoreErrors(updatedIgnoreErrors);
                            setErrorModalVisible(false);
                            if (selectedItem) {
                                const res = await InventoryService.updateItem(selectedItem.id, inventoryId, itemData, updatedIgnoreErrors.quantity, updatedIgnoreErrors.location);
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

            handleNextError(response.errors, currentIgnoreErrors);
            return;
        }

        // Handle single errors
        switch (response.error) {
            case 'already_counted':
                showAlreadyCountModal(
                    'Item Já Contabilizado',
                    `Já foram contabilizadas ${response.data.lastCount} unidades na posição ${response.data.lastLoc}\n\nEscolha:`,
                    async () => {
                        if (selectedItem) {
                            setAlreadyCountModalVisible(false);
                            const replaceRes = await InventoryService.replaceItem(inventoryId, selectedItem.id, {
                                reportedQuantity: itemData.reportedQuantity,
                                reportedLocation: itemData.reportedLocation,
                                batch: batch,
                                observation: itemData.observation,
                                operator: itemData.operator,
                            });
                            handleServiceResponse(replaceRes, itemData, currentIgnoreErrors);
                        }
                    },
                    async () => {
                        setAlreadyCountModalVisible(false);
                        const newCount = await InventoryService.addNewItem(inventoryId, {
                            code: code,
                            reportedQuantity: itemData.reportedQuantity,
                            reportedLocation: itemData.reportedLocation,
                            batch: batch,
                            observation: itemData.observation,
                            operator: itemData.operator,
                        });
                        handleServiceResponse(newCount, itemData, currentIgnoreErrors);
                    },
                    () => {
                        setAlreadyCountModalVisible(false);
                        restartForm();
                    }
                );
                break;
            case 'quantity_mismatch':
                showErrorModal("Quantidade Divergente", "Aprovar mesmo assim?", async () => {
                    const updatedIgnoreErrors = { ...currentIgnoreErrors, quantity: true };
                    setIgnoreErrors(updatedIgnoreErrors);
                    setErrorModalVisible(false);
                    if (selectedItem) {
                        const res = await InventoryService.updateItem(selectedItem.id, inventoryId, itemData, updatedIgnoreErrors.quantity, updatedIgnoreErrors.location);
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
                    setIgnoreErrors(updatedIgnoreErrors);
                    setErrorModalVisible(false);
                    if (selectedItem) {
                        const res = await InventoryService.updateItem(selectedItem.id, inventoryId, itemData, updatedIgnoreErrors.quantity, updatedIgnoreErrors.location);
                        handleServiceResponse(res, itemData, updatedIgnoreErrors);
                    }
                }, () => {
                    setErrorModalVisible(false);
                    restartForm();
                });
                break;
            case 'exists_in_other_location':
                showErrorModal("Item Existe em Outra Posição", `Esse item já existe na posição ${response.data}\n\nAdicionar mesmo assim?`, async () => {
                    setErrorModalVisible(false);
                    const res = await InventoryService.addNewItem(inventoryId, {
                        code: code,
                        reportedQuantity: itemData.reportedQuantity,
                        reportedLocation: itemData.reportedLocation,
                        batch: batch,
                        observation: itemData.observation,
                        operator: itemData.operator,
                    }, true);
                    handleServiceResponse(res, itemData, currentIgnoreErrors);
                }, () => {
                    setErrorModalVisible(false);
                    restartForm();
                });
                break;
            case 'already_counted_in_other':
                showAlreadyCountInOtherModal(
                    "Item Contado em Outra Posição",
                    `Já foram contabilizados ${response.data.reportedQuantity} unidades na posição ${response.data.local}\n\nEscolha:`,
                    async () => {
                        setAlreadyCountInOtherModalVisible(false);
                        const replaceRes = await InventoryService.replaceItem(inventoryId, response.data.id, {
                            reportedQuantity: itemData.reportedQuantity,
                            reportedLocation: itemData.reportedLocation,
                            batch: batch,
                            observation: itemData.observation,
                            operator: itemData.operator,
                        });
                        handleServiceResponse(replaceRes, itemData, currentIgnoreErrors);
                    },
                    async () => {
                        setAlreadyCountInOtherModalVisible(false);
                        const res = await InventoryService.sumToPreviousCount(inventoryId, code, response.data, Number(quantity));
                        handleServiceResponse(res, itemData, currentIgnoreErrors);
                    },
                    async () => {
                        setAlreadyCountInOtherModalVisible(false);
                        const res = await InventoryService.addNewItem(inventoryId, {
                            code: code,
                            reportedQuantity: itemData.reportedQuantity,
                            reportedLocation: itemData.reportedLocation,
                            batch: batch,
                            observation: itemData.observation,
                            operator: itemData.operator,
                        }, true, true);
                        handleServiceResponse(res, itemData, currentIgnoreErrors);
                    },
                    () => {
                        setAlreadyCountInOtherModalVisible(false);
                        restartForm();
                    }
                );
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

    const handleSave = async () => {
        const qty = Number(quantity);
        if (!selectedItem && (isNaN(qty) || qty === 0)) {
            setZeroQuantityError(true);
            return;
        }

        if (!selectedItem && !code.trim()) {
            setCodeError(true);
            return;
        }

        const itemData = {
            reportedQuantity: qty,
            reportedLocation: reportedLocation,
            batch: batch,
            observation,
            operator,
            status: 1,
        };

        try {
            let response;
            if (selectedItem) {
                response = await InventoryService.updateItem(selectedItem.id, inventoryId, itemData, ignoreErrors.quantity, ignoreErrors.location);
            } else {
                response = await InventoryService.addNewItem(inventoryId, { code, ...itemData });
            }
            handleServiceResponse(response, itemData, ignoreErrors);
        } catch (err) {
            console.error('Erro ao salvar item:', err);
            showErrorModal('Erro', 'Erro ao salvar. Tente novamente.', () => { }, () => {
                setErrorModalVisible(false);
                restartForm();
            });
        }
    };

    const renderItem = ({ item }: { item: InventoryItem }) => (
        <SelectItemCard
            item={item}
            onPress={() => handleItemPress(item)}
            key={item.id}
        />
    );

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Itens na posição {location}</Text>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons
                    name="search"
                    size={20}
                    color="#CBD5E1"
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar por código..."
                    placeholderTextColor="#CBD5E1"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={styles.filterContainer}>
                <FilterButton status={3} label="Todos" />
                <FilterButton status={0} label="Não Contados" />
                <FilterButton status={2} label="Contados" />
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAddNewItem}>
                <Ionicons name="add-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.addButtonText}>Adicionar Novo Item</Text>
            </TouchableOpacity>

            <View style={styles.content}>
                <FlatList
                    data={filteredItems}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            Nenhum item encontrado.
                        </Text>
                    }
                />
            </View>

            {/* Modal para Adicionar/Editar */}
            <CustomModal
                visible={modalVisible}
                title={selectedItem ? 'Contabilizar Item' : 'Adicionar Novo Item'}
                onClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContent}>
                    {selectedItem && (
                        <View style={styles.productInfo}>
                            <Text style={styles.productCode}>
                                Código: {selectedItem.code}
                            </Text>
                            <Text style={styles.productName}>
                                {selectedItem.description}
                            </Text>
                        </View>
                    )}

                    {!selectedItem && (
                        <View>
                            <TextInput
                                style={[styles.input, codeError && styles.inputError]}
                                placeholder="Código do item"
                                placeholderTextColor="#94A3B8"
                                value={code}
                                onChangeText={(text) => {
                                    setCode(text);
                                    if (codeError) setCodeError(false);
                                }}
                                onBlur={() => {
                                    if (!code.trim()) {
                                        setCodeError(true);
                                    }
                                }}
                            />
                            {codeError && (
                                <Text style={{ color: "#fa6060" }}>Esse campo precisa ser preenchido</Text>
                            )}
                        </View>
                    )}

                    {selectedItem && (
                        <View style={styles.productInfo}>
                            <Text style={styles.productCode}>
                                Unidade: {selectedItem.unit}
                            </Text>
                        </View>
                    )}

                    {!selectedItem && (
                        null
                    )}


                    {(!selectedItem || (!selectedItem.reportedLocation && !selectedItem.expectedLocation)) && (
                        <View>
                            <TextInput
                                style={styles.input}
                                placeholder="Localização do item"
                                placeholderTextColor="#94A3B8"
                                value={reportedLocation}
                                onChangeText={(text) => {
                                    setReportedLocation(text);
                                }
                                }
                            />
                        </View>
                    )}



                    {
                        !selectedItem ?
                            <View>
                                <TextInput
                                    style={[styles.input]}
                                    placeholder="Lote"
                                    placeholderTextColor="#94A3B8"
                                    value={batch}
                                    onChangeText={(text) => {
                                        setBatch(text);
                                    }}
                                />
                            </View>

                            :

                            <View>
                                <TextInput
                                    style={[styles.input]}
                                    editable={false}
                                    placeholder="Lote"
                                    placeholderTextColor="#94A3B8"
                                    value={batch}
                                    onChangeText={(text) => {
                                        setBatch(text);
                                    }}
                                />
                            </View>

                    }

                    <View>
                        <NumericInput
                            error={zeroQuantityError}
                            ref={numericInputRef}
                            onChange={handleOnQuantityChange}
                        />
                    </View>

                    <TextInput
                        style={[styles.input, styles.inputMultiline]}
                        placeholder="Adicione uma observação (opcional)..."
                        placeholderTextColor="#94A3B8"
                        value={observation}
                        onChangeText={setObservation}
                        multiline
                        numberOfLines={4}
                    />

                    <View style={styles.buttonGroup}>
                        <ButtonWithIcon
                            color="#5A7BA1"
                            icon="checkmark-outline"
                            label="Salvar"
                            onPress={handleSave}
                        />
                        <ButtonWithIcon
                            color="#7F95B9"
                            icon="close-outline"
                            label="Cancelar"
                            onPress={() => setModalVisible(false)}
                        />
                    </View>
                </View>
            </CustomModal>

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

            <CustomModal visible={alreadyCountInOtherModalVisible} title={errorTitle} onClose={() => setAlreadyCountInOtherModalVisible(false)}>
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
                        icon="add-circle-outline"
                        label="Somar na contagem anterior"
                        onPress={modalCancelAction}
                    />
                    <ButtonWithIcon
                        color="#5A7BA1"
                        icon="add-outline"
                        label="Adicionar nova contagem"
                        onPress={modalActionTwo}
                    />
                    <ButtonWithIcon
                        color="#7F95B9"
                        icon="close-outline"
                        label="Cancelar"
                        onPress={() => {
                            setAlreadyCountInOtherModalVisible(false);
                            restartForm();
                        }}
                    />
                </View>
            </CustomModal>

            <CustomModal onClose={() => {
                setSuccessModalVisible(false);
                restartForm();
            }} title="Sucesso" visible={successModalVisible}>
                <Text style={{ fontSize: 16, color: "white", marginBottom: 22 }}>
                    Item inserido com sucesso!
                </Text>
                <View style={{ gap: 20 }}>
                    <ButtonWithIcon
                        color="#5A7BA1"
                        icon="checkmark-outline"
                        label="Ok"
                        onPress={() => {
                            setSuccessModalVisible(false);
                            restartForm();
                        }}
                    />
                </View>
            </CustomModal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3a5073',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#4f6a92',
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    backButton: {
        padding: 8,
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 10,
        backgroundColor: '#4f6a92',
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        color: '#FFF',
        fontSize: 16,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#3A5073',
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    filterButtonText: {
        color: '#CBD5E1',
        fontWeight: '500',
    },
    activeFilter: {
        backgroundColor: '#607EA8',
    },
    activeFilterText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    listContainer: {
        paddingVertical: 20,
    },
    emptyText: {
        color: '#CBD5E1',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#607EA8',
        padding: 12,
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    addButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    modalContent: {
        gap: 24,
        paddingBottom: 8,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 14,
        fontSize: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    inputError: {
        borderColor: '#FF6B6B',
    },
    inputFocused: {
        borderColor: '#607EA8',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    inputMultiline: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    buttonGroup: {
        gap: 16,
        marginTop: 16,
    },
    productInfo: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    productCode: {
        fontSize: 16,
        color: '#b3c0d3ff',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: '600',
    },
    productName: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '500',
        lineHeight: 20,
    }
});