import { scanTypes } from "@/types/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useImperativeHandle, useEffect } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function QRCodeInput({error, label, placeholder, iconName, onScanPress, onEndEditing, ref }: { error: boolean, label: string, placeholder: string, iconName: any, onScanPress: (label: scanTypes) => any, onEndEditing: (e: any) => any, ref: any }) {

    const [text, onChangeText] = useState('')
    const [color, setColor] = useState<"#fa6060" | "#475569">()

    useImperativeHandle(ref, () => ({
        clearInput: () => {
            onChangeText("")
        },
        setValue: (value: string) => {
            onChangeText(value)
        }

    }));
    useEffect(()=>{
        if(error){
            setColor("#fa6060")
        }
        else{
            setColor("#475569")
        }
    }, [error])

    return (
        <View style={{ gap: 4 }}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputGroup, { borderColor: color }]}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={"#475569"}
                    onChangeText={onChangeText}
                    value={text}
                    onEndEditing={() => onEndEditing(text)}
                />
                <Ionicons onPress={()=>{onScanPress(label[0] as scanTypes)}} name={iconName} color={"#94A3B8"} size={32} />
            </View>
            {
                error &&
                <Text style={{ color: "#fa6060" }}>Esse campo precisa ser preenchido</Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        color: "#BDC7D3",
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
    }
})