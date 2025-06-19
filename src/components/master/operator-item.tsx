import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const OperatorItem = ({ name, onEdit, onDelete }: { name: string, onEdit: any, onDelete: any }) => {
    return (
        <View style={[
            styles.card,
            {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
                padding: 16,
            }
        ]}>
            {/* Informações do operário */}
            <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600', marginBottom: 4 , color: "white"}}>{name}</Text>
            </View>

            {/* Ações */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                    onPress={onEdit}
                    style={[
                        styles.button,
                        styles.buttonSmall,
                    ]}
                >
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: "600"  }}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onDelete}
                    style={[
                        styles.button,
                        styles.buttonSmall,
                    ]}
                >
                    <Text style={{ color: 'white', fontSize: 12 }}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 22,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: "rgba(51, 65, 85, 0.60)"
    },
    buttonSmall: {
        padding: 8,
        borderRadius: 8,
    },
    card: {
        backgroundColor: '#4f6a92',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(51, 65, 85, 0.42)',
    },
})