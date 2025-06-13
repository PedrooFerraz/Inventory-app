import Card from "@/components/home/card";
import { FormInput } from "@/components/master/form-input";
import { OperatorItem } from "@/components/master/operator-item";
import { CustomModal } from "@/components/master/custom-modal";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MasterAcessScreen() {

    const [operators, setOperators] = useState([
        { id: 1, name: 'João Silva', code: '12345678901' },
        { id: 2, name: 'Maria Santos', code: '98765432102' },
        { id: 3, name: 'Pedro Oliveira', code: '45678912303' },
        { id: 4, name: 'Ana Costa', code: '78912345604' },
        { id: 5, name: 'Carlos Ferreira', code: '32165498705' },
        { id: 6, name: 'Lucia Almeida', code: '65432198706' },
        { id: 7, name: 'Roberto Lima', code: '14725836907' },
        { id: 8, name: 'Fernanda Rocha', code: '36925814708' }
    ]);

    const [operatorsModalVisible, setOperatorsModalVisible] = useState(false);
    const [operatorFormModalVisible, setOperatorFormModalVisible] = useState(false);
    const [currentOperator, setCurrentOperator] = useState({
        id: '',
        name: '',
        code: '',
    });

    const closeOperatorsModal = () => setOperatorsModalVisible(false);
    const openOperatorsModal = () => setOperatorsModalVisible(true);
    
    const openOperatorFormModal = () => setOperatorFormModalVisible(true);
    const closeOperatorFormModal = () => setOperatorFormModalVisible(false);
    
    const showAddOperatorForm = () => {
        setCurrentOperator({
            id: '',
            name: '',
            code: '',
        });
        openOperatorFormModal();
    };

    const editOperator = (id: number) => {
        const operator = operators.find(op => op.id === id);
        if (operator) {
            setCurrentOperator({ id: JSON.stringify(operator.id), name: operator.name, code: operator.code });
            openOperatorFormModal();
        }
    };

    const deleteOperator = (id: number) => {
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
                        setOperators(operators.filter(op => op.id !== id));
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
                <Card colors={['#FBBF24', '#FFC121']} description="Exporte os invetários realizados" title="Histórico" icon={"folder-open"} onPress={()=> router.navigate("/inventory-history")}></Card>

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
                    <Text style={{
                        marginBottom: 15,
                        fontSize: 18,
                        fontWeight: "500",
                        color: 'white'
                    }}>
                        Lista de Operários
                    </Text>

                    {/* Lista de operários */}
                    <ScrollView style={{ maxHeight: 300 }}>
                        {operators.map(operator => (
                            <OperatorItem
                                key={operator.id}
                                name={operator.name}
                                onEdit={()=> editOperator(operator.id)}
                                onDelete={()=> deleteOperator(operator.id)}
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
                        onPress={() => { }}
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