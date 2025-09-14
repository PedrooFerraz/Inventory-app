import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ButtonWithIcon from "../button-with-icon";
import { CustomModal } from "../master/custom-modal";
import { useState } from "react";
import { setMasterPassword, verifyMasterPassword } from "@/services/passwordService";

export default function Configuration() {

    const [showChangePassword, setShowChangePassword] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [confirmNewPassword, setConfirmPassword] = useState('');
    const [newPassword, setNewPassword] = useState("")


    const handleSubmit = async () => {
        if (!password || !confirmNewPassword || !newPassword) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        const isValid = await verifyMasterPassword(password);
        if (!isValid) {
            setError('Senha atual inválida');
            return
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
    }

    const handleShowChangePassword = () => {
        setShowChangePassword(!showChangePassword);
    }

    return (
        <View>
            <ButtonWithIcon color={"#7F95B9"} icon={"build-outline"} label="Alterar Senha" onPress={handleShowChangePassword}></ButtonWithIcon>

            <CustomModal onClose={handleShowChangePassword} title="Altera Senha" visible={showChangePassword} showCloseButton>
                <Text style={styles.label}>Senha Atual</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Senha Atual"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <Text style={styles.label}>Nova Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nova Senha"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                />
                <Text style={styles.label}>Confirmar Nova Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirmar Nova Senha"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry
                    value={confirmNewPassword}
                    onChangeText={setConfirmPassword}
                />

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
    )
}

const styles = StyleSheet.create({

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.85)',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    input: {
        backgroundColor: '#3A5074',
        color: '#FFFFFF',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
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
        fontWeight: "500"
    }
});