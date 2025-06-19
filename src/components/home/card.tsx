import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ColorValue, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Card(
    {
        onPress,
        colors,
        title,
        description,
        icon
    }
        :
    {
        onPress: any
        colors: readonly [ColorValue, ColorValue, ...ColorValue[]],
        title: string,
        description: string,
        icon: any
    }

) {
    return (
        <TouchableOpacity
            style={styles.accessCard}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <LinearGradient
                        colors={colors}
                        style={styles.iconContainer}
                    >
                        <Ionicons name={icon} size={28} color="#FFFFFF" />
                    </LinearGradient>

                    <View style={styles.cardText}>
                        <Text style={styles.cardTitle}>{title}</Text>
                        <Text style={styles.cardDescription}>{description}</Text>
                    </View>

                    <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    accessCard: {
        backgroundColor: "#5a7ba3",
        borderWidth: 1,
        borderColor: 'rgba(58, 80, 115, 0.85)',
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    cardContent: {
        padding: 24,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    cardText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.75)',
    },
})