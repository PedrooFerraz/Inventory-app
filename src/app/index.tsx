import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MasterLoginModal from '@/components/home/master-login-modal';
import Card from '@/components/home/card';
import { router } from 'expo-router';
import { getDatabase } from '@/services/database';
import FirstTimeSetupModal from '@/components/home/first-time-setup-modal';
import { hasMasterPassword, setMasterPassword, verifyMasterPassword } from '@/services/passwordService';
import { Ionicons } from '@expo/vector-icons';
import { CustomModal } from '@/components/master/custom-modal';
import Configuration from '@/components/home/configuration';
import { COLORS, FONTS, SPACING, SHADOWS, commonStyles, hexagonStyles } from '@/assets/style/theme';

// Constants
const TIMEOUTS = {
  errorMessage: 4000,
};

export default function GMIHomeScreen() {
  const [showMasterLogin, setShowMasterLogin] = useState<boolean>(false);
  const [showFirstTimeSetup, setShowFirstTimeSetup] = useState<boolean>(false);
  const [wrongPassword, setWrongPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showConfigurationModal, setShowConfigurationModal] = useState<boolean>(false);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        await getDatabase();
      } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
        // TODO: Consider adding user-facing error feedback (e.g., toast)
      }
    };

    const checkPasswordExists = async () => {
      try {
        const passwordExists = await hasMasterPassword();
        setShowFirstTimeSetup(!passwordExists);
      } catch (error) {
        console.error('Erro ao verificar senha:', error);
        // TODO: Consider fallback UI (e.g., retry button)
      } finally {
        setIsLoading(false);
      }
    };

    initDatabase();
    checkPasswordExists();
  }, []);

  const handleFirstTimeSetup = async (password: string) => {
    try {
      await setMasterPassword(password);
      setShowFirstTimeSetup(false);
    } catch (error) {
      console.error('Erro ao salvar senha:', error);
      // TODO: Show user-friendly error (e.g., invalid password format)
    }
  };

  const handleMasterLogin = async (password: string) => {
    const isValid = await verifyMasterPassword(password);
    if (isValid) {
      router.navigate('/master-access-screen');
    } else {
      setWrongPassword(true);
      setTimeout(() => setWrongPassword(false), TIMEOUTS.errorMessage);
    }
  };

  const handleMasterAccess = () => {
    setShowMasterLogin(true);
  };

  const handleInventoryAccess = () => {
    router.navigate('/user-select-screen');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <ActivityIndicator size="large" color={COLORS.white} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <LinearGradient
        colors={[COLORS.primaryDark, COLORS.primary]}
        style={styles.background}
      >
        <View style={hexagonStyles.group}>
          <View>
            <View style={hexagonStyles.hexagon1top} />
            <View style={hexagonStyles.hexagon1mid} />
            <View style={hexagonStyles.hexagon1bot} />
          </View>
          <View>
            <View style={hexagonStyles.hexagon2top} />
            <View style={hexagonStyles.hexagon2mid} />
            <View style={hexagonStyles.hexagon2bot} />
          </View>
          <View>
            <View style={hexagonStyles.hexagon3top} />
            <View style={hexagonStyles.hexagon3mid} />
            <View style={hexagonStyles.hexagon3bot} />
          </View>
          <View>
            <View style={hexagonStyles.hexagon4top} />
            <View style={hexagonStyles.hexagon4mid} />
            <View style={hexagonStyles.hexagon4bot} />
          </View>
        </View>

        <ScrollView contentContainerStyle={commonStyles.scrollContent}>
          <View style={styles.header}>
            <LinearGradient
              colors={[COLORS.white, COLORS.primary]}
              style={styles.logoContainer}
            >
              <Image
                source={require('@/assets/images/LogoGMI.png')}
                style={styles.logoImage}
              />
            </LinearGradient>

            <Text style={FONTS.title}>GMI Inventory Pro</Text>
            <Text style={[FONTS.subtitle, styles.subtitle]}>
              Sistema Profissional de Gestão de Inventário Industrial
            </Text>
          </View>

          <View style={commonStyles.fullWidth}>
            <Card
              icon="shield-outline"
              onPress={handleMasterAccess}
              title="Acesso Master"
              description="Administração do sistema"
              colors={[COLORS.primary, COLORS.secondary]}
            />
            <Card
              icon="cube-outline"
              onPress={handleInventoryAccess}
              title="Realizar Contagem"
              description="Executar contagem de itens"
              colors={[COLORS.accent, COLORS.lightAccent]}
            />

            <View style={styles.infoCard}>
              <Text style={FONTS.version}>Versão 1.0.2</Text>
              <Text style={FONTS.copyright}>
                © 2025 GMI Consultoria • Todos os direitos reservados
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.configButton}
            onPress={() => setShowConfigurationModal(true)}
            accessibilityLabel="Abrir configurações"
          >
            <Ionicons name="settings-outline" size={34} color={COLORS.white} />
          </TouchableOpacity>
        </ScrollView>

        <FirstTimeSetupModal
          visible={showFirstTimeSetup}
          onSubmit={handleFirstTimeSetup}
        />

        <CustomModal
          onClose={() => setShowConfigurationModal(false)}
          title="Configurações"
          visible={showConfigurationModal}
          showCloseButton
        >
          <Configuration />
        </CustomModal>

        <MasterLoginModal
          error={wrongPassword}
          visible={showMasterLogin}
          handleCloseMasterLogin={() => setShowMasterLogin(false)}
          handleMasterLogin={handleMasterLogin}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.paddingVerticalHeader,
    paddingBottom: SPACING.extraLarge,
  },
  logoContainer: {
    width: 96,
    height: 96,
    paddingTop: SPACING.small,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.large,
    ...SHADOWS.card,
  },
  logoImage: {
    width: 70,
    height: 70,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 280,
  },
  infoCard: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.medium,
    alignItems: 'center',
    marginBottom: SPACING.extraLarge,
  },
  configButton: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
});