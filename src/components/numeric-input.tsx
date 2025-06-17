import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function NumericInput({ onChange, ref}: { onChange: (e: string) => any , ref: any}) {

    const [qtyInput, onChangeQty] = useState('0');
    const [disabled, setDisabled] = useState(false)

    const inputRef = useRef(null);

    useImperativeHandle(ref, () => ({
        clearInput: () => {
            onChangeQty("0")
        }
    }));

    useEffect(() => {
        onChange(qtyInput)
        if (qtyInput == "0")
            setDisabled(true)
        else
            setDisabled(false)

    }, [qtyInput])


    const onChanged = (text: string) => {
        const sanitized = text.replace(/[^0-9]/g, '');
        onChangeQty(sanitized === '' ? '' : sanitized);
    }

    const add = () => {
        onChangeQty((parseInt(qtyInput) + 1).toString());
    }
    const subtract = () => {
        const newValue = Math.max(0, parseInt(qtyInput) - 1);
        onChangeQty(newValue.toString());
    }


    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantidade</Text>
            <View style={{ justifyContent: "center", flexDirection: "row", alignItems: "center", gap: 10 }}>
                <TouchableOpacity
                    style={styles.inputButton}
                    onPress={subtract}
                    disabled={disabled}>


                    <Text style={{ fontSize: 26, color: "#DDDFE3", fontWeight: "400" }}>-</Text>
                </TouchableOpacity>
                <TextInput
                    keyboardType="numeric"
                    style={[styles.input, styles.numericInput]}
                    onChangeText={(text) => { onChanged(text) }}
                    value={qtyInput}
                    onEndEditing={() => {
                        if (qtyInput == "")
                            onChangeQty("0")
                    }}
                    onFocus={() => {
                        if (qtyInput == "0") {
                            onChangeQty("")
                        }
                    }}
                />

                <TouchableOpacity
                    style={styles.inputButton}
                    onPress={add}>

                    <Text style={{ fontSize: 26, color: "#DDDFE3", fontWeight: "400" }}>+</Text>
                </TouchableOpacity>
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
        borderWidth: 1,
        borderColor: "#475569",
        borderRadius: 8,
        color: "white",
        padding: 10,
        height: 50,
        fontSize: 16,
    },
    numericInput: {
        textAlign: "center",
        flex: 1
    },
    inputGroup: {
        gap: 10
    },
    inputButton: {
        height: 50,
        width: 50,
        backgroundColor: "#334155",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10
    },
})