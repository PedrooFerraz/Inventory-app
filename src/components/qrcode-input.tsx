import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function QRCodeInput({value, label, placeholder, iconName, onScanPress, onEndEditing }: {value?:string, label: string, placeholder: string, iconName: any, onScanPress: ()=> any, onEndEditing: (e : any)=> any }) {

    const [text, onChangeText] = useState('')

    useEffect(()=>{
        if(value)
        onChangeText(value)
    }, [])

    return (
        <View style={{gap: 10}}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputGroup}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={"#475569"}
                    onChangeText={onChangeText}
                    value={text}
                    onEndEditing={() =>onEndEditing(text)}
                />
                <Ionicons onPress={onScanPress} name={iconName} color={"#94A3B8"} size={32} style={styles.icon} />
            </View>
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
        borderColor: "#475569",
        borderRadius: 8,
        flexDirection: "row",
        paddingHorizontal: 10
    },
    icon: {

    }
})