import Card from "@/components/home/card";
import { FormInput } from "@/components/master/form-input";
import { OperatorItem } from "@/components/master/operator-item";
import { CustomModal } from "@/components/master/custom-modal";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDatabase } from "@/hooks/useDatabase";
import { deleteOperator, fetchOperatorById, insertOperator, updateOperator } from "@/models/operators";

export default function MasterAcessScreen() {

    const { operators, loading, error, refresh } = useDatabase();

    const [operatorsModalVisible, setOperatorsModalVisible] = useState(false);
    const [operatorFormModalVisible, setOperatorFormModalVisible] = useState(false);
    const [currentOperator, setCurrentOperator] = useState({
        id: 0,
        name: '',
        code: '',
    });

    const closeOperatorsModal = () => setOperatorsModalVisible(false);
    const openOperatorsModal = () => setOperatorsModalVisible(true);

    const openOperatorFormModal = () => setOperatorFormModalVisible(true);
    const closeOperatorFormModal = () => setOperatorFormModalVisible(false);

    const showAddOperatorForm = () => {
        setCurrentOperator({
            id: 0,
            name: '',
            code: '',
        });
        openOperatorFormModal();
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteOperator(id);
            await refresh();
        } catch (err: any) {
            console.error('Erro ao excluir operário:', err);
        }
    };

    const handleUpdate = async (id: number, name: string, code: string) => {
        try {
            let op = await fetchOperatorById(id)
            if (op == null) {
                await insertOperator(name, code)
            }
            else {
                await updateOperator(id, name, code);
            }
            await refresh();
            closeOperatorFormModal();
        } catch (err: any) {
            console.error('Erro ao atualizar operário:', err);
        }
    }

    const editOperator = (id: number) => {
        const operator = operators.find(op => op.id === id);
        if (operator) {
            setCurrentOperator({ id: operator.id, name: operator.name, code: operator.code });
            openOperatorFormModal();
        }
    };

    const deleteOp = (id: number) => {
        Alert.alert(
            'Confirmar Exclusão',
            'Tem certeza que deseja excluir este operário?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Excluir',
                    onPress: () => {
                        handleDelete(id)
                        Alert.alert('Sucesso', 'Operário excluído com sucesso!');
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header} >

                <Ionicons onPress={() => router.back()} name="arrow-back" size={32} color={"white"} style={{ position: "absolute", top: 20, left: 10 }} />

                <LinearGradient
                    colors={['#EF4444', '#DC2626']}
                    style={styles.logoContainer}
                >
                    <Ionicons name="bar-chart" size={48} color="#FFFFFF" />
                </LinearGradient>



                <Text style={styles.headerTitle}>Dashboard Master</Text>
                <Text style={styles.headerSubTitle}>Administração do Sistema</Text>
            </View>

            <View style={styles.mainContent}>
                <Card colors={['#10B981', '#059669']} description="Adicionar, editar ou remover operários" title="Gerenciar Operários" icon={"people"} onPress={openOperatorsModal}></Card>
                <Card colors={['#3B82F6', '#2563EB']} description="Importar dados via arquivo CSV" title="Importar Inventário" icon={"folder-open"} onPress={() => { router.navigate("/import-sheet-screen") }}></Card>
                <Card colors={['#FBBF24', '#FFC121']} description="Exporte os invetários realizados" title="Histórico" icon={"folder-open"} onPress={() => router.navigate("/inventory-history")}></Card>

                <CustomModal onClose={closeOperatorsModal} title="Gerenciar Operários" visible={operatorsModalVisible} showCloseButton>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.buttonPrimary,
                            { marginBottom: 20 }
                        ]}
                        onPress={showAddOperatorForm}
                    >
                        <Text style={{ color: 'white', fontWeight: '600' }}>
                            + Adicionar Novo Operário
                        </Text>
                    </TouchableOpacity>
                    {operators.length == 0 ? "" :
                        <Text style={{
                            marginBottom: 15,
                            fontSize: 18,
                            fontWeight: "500",
                            color: 'white'
                        }}>
                            Lista de Operários
                        </Text>
                    }

                    {/* Lista de operários */}
                    <ScrollView style={{ maxHeight: 300 }}>
                        {operators.map(operator => (
                            <OperatorItem
                                key={operator.id}
                                name={operator.name}
                                onEdit={() => editOperator(operator.id)}
                                onDelete={() => deleteOp(operator.id)}
                            />
                        ))}
                    </ScrollView>

                </CustomModal>

                <CustomModal
                    visible={operatorFormModalVisible}
                    onClose={closeOperatorFormModal}
                    title={currentOperator.id ? 'Editar Operário' : 'Adicionar Operário'}
                >
                    <FormInput
                        label="Nome Completo"
                        placeholder="Digite o nome completo"
                        value={currentOperator.name}
                        onChangeText={(text) => setCurrentOperator({ ...currentOperator, name: text })}
                        required
                    />
                    <FormInput
                        label="Código Operário"
                        placeholder="000000"
                        value={currentOperator.code}
                        onChangeText={(text) => setCurrentOperator({ ...currentOperator, code: text })}
                        required
                    />

                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.buttonPrimary,
                            { marginTop: 10 }
                        ]}
                        onPress={() => handleUpdate(currentOperator.id, currentOperator.name, currentOperator.code)}
                    >
                        <Text style={{ color: 'white', fontWeight: '600' }}>
                            {currentOperator.id ? 'Salvar Alterações' : 'Salvar Operário'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.buttonSecondary,
                            { marginTop: 10 }
                        ]}
                        onPress={closeOperatorFormModal}
                    >
                        <Text style={{ color: 'white', fontWeight: '600' }}>Cancelar</Text>
                    </TouchableOpacity>
                </CustomModal>

            </View>




        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121A2D"
    },
    header: {
        backgroundColor: "#182234",
        alignItems: 'center',
        paddingTop: 64,
        paddingBottom: 32,
    },
    headerTitle: {
        fontSize: 24,
        color: "white",
        fontWeight: "bold"
    },
    headerSubTitle: {
        fontSize: 14,
        color: "#94A3B8",
    },
    logoContainer: {
        width: 96,
        height: 96,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    mainContent: {
        flex: 1,
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
        paddingVertical: 28,
        paddingHorizontal: 20
    },
    button: {
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPrimary: {
        backgroundColor: '#3B82F6',
    },
    buttonSecondary: {
        backgroundColor: '#546e7a',
    },
    buttonTertiary: {
        backgroundColor: '#546e7a',
    }
})