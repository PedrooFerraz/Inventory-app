import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ButtonWithIcon from "../button-with-icon";
import { CustomModal } from "../master/custom-modal";
import { useState } from "react";
import { setMasterPassword, verifyMasterPassword } from "@/services/passwordService";
import { Ionicons } from "@expo/vector-icons";

export default function Configuration() {
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    // controle de visualização
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async () => {
        if (!password || !newPassword || !confirmNewPassword) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        const isValid = await verifyMasterPassword(password);
        if (!isValid) {
            setError('Senha atual inválida');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (newPassword.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setError('');
        onSubmit(newPassword);
    };

    const onSubmit = async (password: string) => {
        try {
            await setMasterPassword(password);
            handleShowChangePassword();
        } catch (error) {
            console.error("Erro ao salvar senha:", error);
        }
    };

    const handleShowChangePassword = () => {
        setShowChangePassword(!showChangePassword);
    };

    return (
        <View>
            <ButtonWithIcon
                color={"#7F95B9"}
                icon={"build-outline"}
                label="Alterar Senha"
                onPress={handleShowChangePassword}
            />

            <CustomModal
                onClose={handleShowChangePassword}
                title="Alterar Senha"
                visible={showChangePassword}
                showCloseButton
            >
                {/* Senha atual */}
                <Text style={styles.label}>Senha Atual</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Senha Atual"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry={!showCurrentPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                        <Ionicons
                            name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color="#94A3B8"
                        />
                    </TouchableOpacity>
                </View>

                {/* Nova senha */}
                <Text style={styles.label}>Nova Senha</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nova Senha"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry={!showNewPassword}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                    >
                        <Ionicons
                            name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color="#94A3B8"
                        />
                    </TouchableOpacity>
                </View>

                {/* Confirmar nova senha */}
                <Text style={styles.label}>Confirmar Nova Senha</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar Nova Senha"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry={!showConfirmPassword}
                        value={confirmNewPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        <Ionicons
                            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color="#94A3B8"
                        />
                    </TouchableOpacity>
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.buttonText}>Salvar Senha</Text>
                    </TouchableOpacity>
                </View>
            </CustomModal>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        position: "relative",
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#3A5074',
        color: '#FFFFFF',
        borderRadius: 8,
        padding: 12,
        paddingRight: 40,
    },
    eyeButton: {
        position: "absolute",
        right: 12,
        top: 0,
        bottom: 0,
        justifyContent: "center",
    },
    errorText: {
        color: '#FF7D7D',
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 16,
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: 8,
    },
    submitButton: {
        backgroundColor: '#C7DCF0',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
    },
    buttonText: {
        color: '#3A5073',
        fontWeight: 'bold',
    },
    label: {
        fontSize: 14,
        color: "white",
        fontWeight: "500",
        marginBottom: 4,
    },
});
