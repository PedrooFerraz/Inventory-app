import { StyleSheet } from 'react-native';

// Color palette
export const COLORS = {
    primaryDark: '#3a5073',
    primary: '#4f6a92',
    secondary: '#6b8ab5',
    accent: '#7f96b9',
    lightAccent: '#8fa5c7',
    white: '#FFFFFF',
    transparentBlue: 'rgba(59, 131, 246, 0.07)',
    transparentBlueDark: 'rgba(59, 131, 246, 0.08)',
    shadow: '#000',
    border: 'rgba(51, 65, 85, 0.42)',
    textSecondary: 'rgba(255, 255, 255, 0.65)',
    cardBackground: 'rgba(58, 80, 115, 0.85)',
    filterButton: '#607EA8',
    filterText: '#CBD5E1',
    nextButton: '#5A7BA3', // From InventoryScreen
    batchOption: '#849BBD', // From InventoryScreen
    batchSelected: '#3B5275', // From InventoryScreen
    inputBorder: '#79859B', // From InventoryScreen
    labelText: 'rgba(255, 255, 255, 0.75)', // From InventoryScreen
    loadingOverlay: 'rgba(24, 34, 52, 0.8)', // From InventoryScreen
    scannerBlue: '#60A5FA', // From InventoryScreen
    menuBorder: '#5B7295', // From DrawerMenu
};

// Spacing constants
export const SPACING = {
    small: 8,
    medium: 16,
    large: 24,
    extraLarge: 32,
    paddingHorizontal: 20,
    paddingVerticalHeader: 16,
    paddingVerticalFilter: 10,
    formGap: 28, // From InventoryScreen
    buttonPadding: 18, // From InventoryScreen
    modalGap: 20, // From InventoryScreen
    inputGap: 10, // From InventoryScreen
    menuPadding: 14, // From DrawerMenu
    headerPadding: 10, // From DrawerMenu
};


// Common shadow styles
export const SHADOWS = {
    card: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
};

// Typography styles (type-safe)
export const FONTS = StyleSheet.create({
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    version: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    copyright: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600', // Updated from DrawerMenu
        color: COLORS.white,
    },
    filterButtonText: {
        color: COLORS.filterText,
        fontWeight: '500',
    },
    activeFilterText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    buttonName: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.white,
    },
    batchText: {
        fontSize: 16,
        color: COLORS.white,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.labelText,
    },
    modalText: {
        fontSize: 16,
        color: COLORS.white,
    },
});

// Common styles for layouts
export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullWidth: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.paddingHorizontal,
    },
});

// Button styles (for filter buttons)
export const buttonStyles = StyleSheet.create({
    filterButton: {
        paddingVertical: SPACING.paddingVerticalFilter,
        paddingHorizontal: SPACING.medium,
        borderRadius: 20,
    },
    activeFilter: {
        backgroundColor: COLORS.filterButton,
    },
    nextButton: {
        backgroundColor: COLORS.nextButton,
        padding: SPACING.buttonPadding,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        gap: SPACING.inputGap,
    },

    menuButton: {
        padding: SPACING.menuPadding,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.menuBorder,
    },
});


// Hexagon styles (unchanged)
export const hexagonStyles = StyleSheet.create({
    group: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    hexagon1top: {
        position: 'absolute',
        borderBottomColor: COLORS.transparentBlue,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomWidth: 30,
        borderLeftWidth: 52,
        borderRightWidth: 52,
        width: 0,
        top: 50,
        left: 40,
    },
    hexagon1mid: {
        position: 'absolute',
        backgroundColor: COLORS.transparentBlue,
        height: 60,
        width: 104,
        top: 80,
        left: 40,
    },
    hexagon1bot: {
        position: 'absolute',
        borderTopColor: COLORS.transparentBlue,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopWidth: 30,
        borderLeftWidth: 52,
        borderRightWidth: 52,
        width: 0,
        top: 140,
        left: 40,
    },
    hexagon2top: {
        position: 'absolute',
        borderBottomColor: COLORS.transparentBlue,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomWidth: 30,
        borderLeftWidth: 52,
        borderRightWidth: 52,
        width: 0,
        top: 160,
        right: 80,
    },
    hexagon2mid: {
        position: 'absolute',
        backgroundColor: COLORS.transparentBlue,
        height: 60,
        width: 104,
        top: 190,
        right: 80,
    },
    hexagon2bot: {
        position: 'absolute',
        borderTopColor: COLORS.transparentBlue,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopWidth: 30,
        borderLeftWidth: 52,
        borderRightWidth: 52,
        width: 0,
        top: 250,
        right: 80,
    },
    hexagon3top: {
        position: 'absolute',
        borderBottomColor: COLORS.transparentBlueDark,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomWidth: 50,
        borderLeftWidth: 80,
        borderRightWidth: 80,
        width: 0,
        top: 550,
        left: 80,
    },
    hexagon3mid: {
        position: 'absolute',
        backgroundColor: COLORS.transparentBlueDark,
        height: 100,
        width: 160,
        top: 580,
        left: 80,
    },
    hexagon3bot: {
        position: 'absolute',
        borderTopColor: COLORS.transparentBlueDark,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopWidth: 50,
        borderLeftWidth: 80,
        borderRightWidth: 80,
        width: 0,
        top: 680,
        left: 80,
    },
    hexagon4top: {
        position: 'absolute',
        borderBottomColor: COLORS.transparentBlue,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomWidth: 30,
        borderLeftWidth: 52,
        borderRightWidth: 52,
        width: 0,
        top: 700,
        right: 40,
    },
    hexagon4mid: {
        position: 'absolute',
        backgroundColor: COLORS.transparentBlue,
        height: 60,
        width: 104,
        top: 730,
        right: 40,
    },
    hexagon4bot: {
        position: 'absolute',
        borderTopColor: COLORS.transparentBlue,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopWidth: 30,
        borderLeftWidth: 52,
        borderRightWidth: 52,
        width: 0,
        top: 790,
        right: 40,
    },
});
export const batchStyles = StyleSheet.create({
    batchOption: {
        padding: SPACING.medium,
        borderWidth: 1,
        borderColor: COLORS.nextButton,
        borderRadius: 8,
        backgroundColor: COLORS.batchOption,
        marginBottom: SPACING.small,
    },
    selectedBatchOption: {
        borderColor: COLORS.batchSelected,
        backgroundColor: COLORS.batchSelected,
    },
});

