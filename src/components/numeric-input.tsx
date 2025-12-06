import { useEffect, useImperativeHandle, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Animated } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function NumericInput({
    error,
    onChange,
    ref
}: {
    error: boolean,
    onChange: (e: string) => any,
    ref: any
}) {
    const [qtyInput, onChangeQty] = useState('0');
    const [disabled, setDisabled] = useState(false);
    const [shakeAnim] = useState(new Animated.Value(0));

    useImperativeHandle(ref, () => ({
        clearInput: () => {
            onChangeQty("0");
        }
    }));

    useEffect(() => {
        onChange(qtyInput);
        setDisabled(qtyInput === "0");
    }, [qtyInput]);

    useEffect(() => {
        if (error) {
            // Animação de shake quando há erro
            Animated.sequence([
                Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
            ]).start();
        }
    }, [error]);

    const onChanged = (text: string) => {
        let normalized = text.replace(',', '.');
        normalized = normalized.replace(/[^0-9.]/g, '');

        if ((normalized.match(/\./g) || []).length > 1) {
            // evita 10.4.5
            normalized = normalized.substring(0, normalized.length - 1);
        }

        onChangeQty(normalized === '' ? '' : normalized);
    };

    const add = () => {
        const current = parseFloat(qtyInput || "0");
        const newValue = current + 1;
        onChangeQty(newValue.toString());
    };

    const subtract = () => {
        const current = parseFloat(qtyInput || "0");
        const newValue = Math.max(0, current - 1);
        onChangeQty(newValue.toString());
    };

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantidade*</Text>
            <Animated.View
                style={[
                    styles.quantityContainer,
                    { transform: [{ translateX: shakeAnim }] }
                ]}
            >
                <TouchableOpacity
                    style={[
                        styles.inputButton,
                        disabled && styles.inputButtonDisabled
                    ]}
                    onPress={subtract}
                    disabled={disabled}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="remove"
                        size={20}
                        color={disabled ? "#64748B" : "#FFFFFF"}
                    />
                </TouchableOpacity>

                <TextInput
                    keyboardType="numeric"
                    style={[
                        styles.input,
                        styles.numericInput,
                        error && styles.inputError
                    ]}
                    onChangeText={onChanged}
                    value={qtyInput}
                    onEndEditing={() => {
                        if (qtyInput === "")
                            onChangeQty("0");
                    }}
                    onFocus={() => {
                        if (qtyInput === "0") {
                            onChangeQty("");
                        }
                    }}
                    selectionColor="#64B5F6"
                />

                <TouchableOpacity
                    style={styles.inputButton}
                    onPress={add}
                    activeOpacity={0.7}
                >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </Animated.View>

            {error && (
                <Animated.View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color="#EF4444" />
                    <Text style={styles.errorText}>
                        A quantidade precisa ser diferente de 0
                    </Text>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    inputGroup: {
        flex: 1
    },
    label: {
        color: "rgba(255, 255, 255, 0.75)",
        fontWeight: "500",
        fontSize: 14,
        marginBottom: 12,

    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        justifyContent: "center",
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        color: "white",
        padding: 16,
        height: 56,
        fontSize: 18,
        fontWeight: "600",
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    numericInput: {
        textAlign: "center",
        flex: 1,

    },
    inputError: {
        borderColor: "#EF4444",
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    inputButton: {
        height: 56,
        width: 56,
        backgroundColor: "#5A7BA2",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    inputButtonDisabled: {
        backgroundColor: "#41597cff",
        opacity: 0.5,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
    errorText: {
        color: "#EF4444",
        fontSize: 14,
        fontWeight: "500",
    },
});