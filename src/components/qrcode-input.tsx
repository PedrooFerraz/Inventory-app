import { scanTypes } from "@/types/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useImperativeHandle, useEffect } from "react";
import { Animated, StyleSheet, Text, TextInput, View } from "react-native";

export default function QRCodeInput({ error, label, placeholder, iconName, onScanPress, onEditing, onEndEditing, ref }: { error: boolean, label: string, placeholder: string, iconName: any, onScanPress: (label: scanTypes) => any, onEditing: (e: any) => any, onEndEditing: (e: any) => any, ref: any }) {

    const [text, onChangeText] = useState('')
    const [color, setColor] = useState<"#fa6060" | "#79859B">()

    useImperativeHandle(ref, () => ({
        clearInput: () => {
            onChangeText("")
        },
        setValue: (value: string) => {
            onChangeText(value)
        }

    }));

    useEffect(() => {
        onEditing(text)
    }, [text])

    useEffect(() => {
        if (error) {
            setColor("#fa6060")
        }
        else {
            setColor("#79859B")
        }
    }, [error])

    return (
        <View style={{ gap: 4 }}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputGroup, { borderColor: color }]}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={"rgba(255, 255, 255, 0.3)"}
                    onChangeText={onChangeText}
                    value={text}
                    onEndEditing={() => onEndEditing(text)}
                />
                <Ionicons onPress={() => { onScanPress(label[0] as scanTypes) }} name={iconName} color={"#94A3B8"} size={32} />
            </View>
            {
                error &&

                <Animated.View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color="#EF4444" />

                    <Text style={{ color: "#fa6060" }}>Esse campo precisa ser preenchido</Text>
                </Animated.View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        color: "rgba(255, 255, 255, 0.75)",
        fontWeight: "500",
        fontSize: 14
    },
    input: {
        height: 50,
        fontSize: 16,
        flex: 1,
        color: "white"
    },
    inputGroup: {
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: "row",
        paddingHorizontal: 10
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
})