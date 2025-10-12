import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function MasterLoginModal(
    {
        visible,
        handleCloseMasterLogin,
        handleMasterLogin,
        error
    }
        :
        {
            visible: boolean,
            handleCloseMasterLogin: any,
            handleMasterLogin: any,
            error: boolean
        }
) {

    const [masterPassword, setMasterPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleCloseMasterLogin}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <LinearGradient
                            colors={['#7f96b9', '#6b8ab5']}
                            style={styles.modalIcon}
                        >
                            <Ionicons name="lock-closed-outline" size={32} color="#FFFFFF" />
                        </LinearGradient>

                        <Text style={styles.modalTitle}>Acesso Master</Text>
                        <Text style={styles.modalSubtitle}>Digite a senha de administrador</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={masterPassword}
                                onChangeText={setMasterPassword}
                                placeholder="Senha master"
                                placeholderTextColor="#94A3B8"
                                secureTextEntry={!showPassword}
                                onSubmitEditing={(event) => {
                                    const submittedText = event.nativeEvent.text;
                                    handleMasterLogin(submittedText);
                                }}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#94A3B8"
                                />
                            </TouchableOpacity>
                        </View>
                        {
                            error &&
                            <View>
                                <Text style={{ color: "#ff6b6b", fontWeight: "500" }}>
                                    Senha Incorreta
                                </Text>
                            </View>

                        }

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleCloseMasterLogin}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={() => handleMasterLogin(masterPassword)}
                            >
                                <LinearGradient
                                    colors={['#aecce7', '#e8f1fc']}
                                    style={styles.loginButtonGradient}
                                >

                                    <Text style={styles.loginButtonText}>Acessar</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#4f6a92',
        borderWidth: 1,
        borderColor: 'rgba(51, 65, 85, 0.42)',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 350,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    modalIcon: {
        width: 64,
        height: 64,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.85)',
        textAlign: 'center',
    },
    inputContainer: {
        gap: 16,
    },
    passwordInputContainer: {
        position: 'relative',
    },
    passwordInput: {
        backgroundColor: '#3a5073',
        borderWidth: 1,
        borderColor: 'rgba(51, 65, 85, 0.42)',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingRight: 48,
        fontSize: 16,
        color: '#FFFFFF',
    },
    eyeButton: {
        position: 'absolute',
        right: 12,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#7f96b9',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    loginButton: {
        flex: 1,
    },
    loginButtonGradient: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#3a5073',
        fontSize: 16,
        fontWeight: '500',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
})