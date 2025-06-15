import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';

export const CustomModal = ({
    visible,
    onClose,
    title,
    children,
    showCloseButton = true
}:
    {
        visible: boolean,
        onClose: any
        title: string,
        children: React.ReactNode,
        showCloseButton?: boolean
    }

) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackdrop}>
                <View style={styles.modalContent}>
                    {/* Cabeçalho do modal */}
                    <View style={styles.modalHeader}>
                        {showCloseButton && (
                            <TouchableOpacity
                                onPress={onClose}
                                style={{
                                    position: 'absolute',
                                    right: 20,
                                    top: 20,
                                }}
                            >
                                <Text style={{
                                    fontSize: 28,
                                    fontWeight: 'bold',
                                    opacity: 0.7,
                                    color: 'white'
                                }}>
                                    &times;
                                </Text>
                            </TouchableOpacity>
                        )}
                        <Text style={[styles.text, styles.title, { fontSize: 24 }]}>
                            {title}
                        </Text>
                    </View>

                    {/* Corpo do modal com scroll */}
                    <ScrollView style={{ padding: 20 }}>
                        {children}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#121A2D',
        borderRadius: 20,
        width: '90%',
        maxWidth: 400,
        maxHeight: '90%',
    },
    modalHeader: {
        backgroundColor: '#182234',
        padding: 30,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontFamily: 'Roboto',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
    },
});
