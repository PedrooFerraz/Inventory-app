// src/components/home/first-time-setup-modal.tsx
import React, { useState } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

interface FirstTimeSetupModalProps {
  visible: boolean;
  onSubmit: (password: string) => void;
}

export default function FirstTimeSetupModal({ visible, onSubmit }: FirstTimeSetupModalProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!password || !confirmPassword) {
      setError('Por favor, preencha ambos os campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setError('');
    onSubmit(password);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => { }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Configuração Inicial</Text>
          <Text style={styles.subtitle}>
            Este é o primeiro acesso. Por favor, defina uma senha master para administração do sistema.
          </Text>

          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nova senha"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
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
          
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirme a senha"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Salvar Senha</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#4E6A91',
    borderRadius: 12,
    padding: 24,
    width: '80%',
  },
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 48,
    marginBottom: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#E27E85',
    fontSize: 12,
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
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: -12,
    bottom: 0,
    justifyContent: 'center',
  },
  passwordInputContainer: {
    position: 'relative',
  },
});