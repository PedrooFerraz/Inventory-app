import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { DrawerLayoutAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, SPACING, buttonStyles } from '@/assets/style/theme';

interface DrawerMenuProps {
  drawer: React.RefObject<DrawerLayoutAndroid | null>;
  finalizeInventoryFunction: () => void;
}

export default function DrawerMenu({
  drawer,
  finalizeInventoryFunction
}: DrawerMenuProps) {
  return (
    <View style={[styles.navigationContainer, { backgroundColor: COLORS.primaryDark }]}>
      <View style={styles.header}>
        <Text style={FONTS.headerTitle}>Menu</Text>
        <TouchableOpacity
          onPress={() => drawer.current?.closeDrawer()}
          accessibilityLabel="Fechar menu"
        >
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity
          style={buttonStyles.menuButton}
          activeOpacity={0.5}
          onPress={() => router.navigate('/')}
          accessibilityLabel="Voltar para a tela inicial"
        >
          <Text style={FONTS.buttonName}>Voltar para a Tela Inicial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={buttonStyles.menuButton}
          activeOpacity={0.5}
          onPress={() => {
              finalizeInventoryFunction();
              drawer.current?.closeDrawer();
          }}
          accessibilityLabel="Finalizar contagem"
        >
          <Text style={FONTS.buttonName}>
            Finalizar Contagem
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navigationContainer: {
    flex: 1,
  },
  header: {
    padding: SPACING.headerPadding,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: COLORS.menuBorder,
    borderBottomWidth: 0.8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});