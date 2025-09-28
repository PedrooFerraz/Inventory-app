import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export const CustomModal = ({
    visible,
    onClose,
    title,
    children,
    showCloseButton = true
}: {
    visible: boolean,
    onClose: any
    title: string,
    children: React.ReactNode,
    showCloseButton?: boolean
}) => {
    const [fadeAnim] = React.useState(new Animated.Value(0));
    const [scaleAnim] = React.useState(new Animated.Value(0.9));

    React.useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.9,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <Animated.View style={[styles.modalBackdrop, { opacity: fadeAnim }]}>
                <TouchableOpacity 
                    style={styles.backdropTouchable} 
                    activeOpacity={1}
                    onPress={onClose}
                />
                <Animated.View 
                    style={[
                        styles.modalContent, 
                        { 
                            transform: [{ scale: scaleAnim }],
                            opacity: fadeAnim 
                        }
                    ]}
                >
                    {/* Cabeçalho do modal */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.title}>{title}</Text>
                        {showCloseButton && (
                            <TouchableOpacity
                                onPress={onClose}
                                style={styles.closeButton}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons name="close" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Corpo do modal com scroll */}
                    <ScrollView 
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        {children}
                    </ScrollView>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdropTouchable: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContent: {
        backgroundColor: '#4A5F7A',
        borderRadius: 24,
        width: width * 0.9,
        maxWidth: 400,
        maxHeight: height * 0.85,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    modalHeader: {
        backgroundColor: '#3B4C66',
        padding: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: -0.5,
        flex: 1,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    },
    scrollView: {
        padding: 24,
    },
});
