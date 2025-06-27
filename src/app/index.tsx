import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity
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
import Configuration from '@/components/home/configurtation';


export default function GMIHomeScreen() {

  const [showMasterLogin, setShowMasterLogin] = useState(false);
  const [showFirstTimeSetup, setShowFirstTimeSetup] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfig, setShowConfig] = useState(false)

  useEffect(() => {
    const initDatabase = async () => {
      try {
        await getDatabase();
      } catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error);
      }
    };

    initDatabase();
    checkPasswordExists();
  }, []);


  const checkPasswordExists = async () => {
    try {
      const passwordExists = await hasMasterPassword();
      setShowFirstTimeSetup(!passwordExists);
    } catch (error) {
      console.error("Erro ao verificar senha:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleFirstTimeSetup = async (password: string) => {
    try {
      await setMasterPassword(password);
      setShowFirstTimeSetup(false);
    } catch (error) {
      console.error("Erro ao salvar senha:", error);
    }
  };

  const handleMasterLogin = async (password: string) => {
    const isValid = await verifyMasterPassword(password);
    if (isValid) {
      router.navigate("/master-acess-screen");
    } else {
      setWrongPassword(true);
      setTimeout(() => setWrongPassword(false), 4000);
    }
  };

  const closeConfig = () => {
    setShowConfig(false)
  }

  const handleMasterAccess = () => {
    setShowMasterLogin(true);
  };

  const handleInventoryAccess = () => {
    router.navigate("/user-select-screen")
  };


  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <LinearGradient
        colors={['#3a5073', '#4f6a92']}
        style={styles.background}
      >
        <View style={styles.backgroundElements}>
          <View>
            <View style={[styles.hexagon1top]} />
            <View style={[styles.hexagon1mid]} />
            <View style={[styles.hexagon1bot]} />
          </View>
          <View>
            <View style={[styles.hexagon2top]} />
            <View style={[styles.hexagon2mid]} />
            <View style={[styles.hexagon2bot]} />
          </View>
          <View>
            <View style={[styles.hexagon3top]} />
            <View style={[styles.hexagon3mid]} />
            <View style={[styles.hexagon3bot]} />
          </View>
          <View>
            <View style={[styles.hexagon4top]} />
            <View style={[styles.hexagon4mid]} />
            <View style={[styles.hexagon4bot]} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <LinearGradient
              colors={['white', '#4f6a92']}
              style={styles.logoContainer}
            >
              <Image source={require("@/assets/images/LogoGMI.png")} style={{ width: 70, height: 70 }}></Image>
            </LinearGradient>

            <Text style={styles.title}>GMI Inventory Pro</Text>
            <Text style={styles.subtitle}>
              Sistema Profissional de Gestão de Inventário Industrial
            </Text>
          </View>

          <View style={styles.mainContent}>

            <Card icon={"shield-outline"} onPress={handleMasterAccess} title='Acesso Master' description='Administração do sistema' colors={['#4f6a92', '#6b8ab5']}></Card>
            <Card icon={"cube-outline"} onPress={handleInventoryAccess} title='Realizar Contagem' description='Executar contagem de itens' colors={['#7f96b9', '#8fa5c7']}></Card>

            <View style={styles.infoCard}>
              <Text style={styles.versionText}>Versão 1.0.0</Text>
              <Text style={styles.copyrightText}>
                © 2025 GMI Consultoria • Todos os direitos reservados
              </Text>
            </View>

          </View>
          <TouchableOpacity
            style={styles.configButton}
            onPress={() => setShowConfig(true)}
          >
            <Ionicons name="settings-outline" size={34} color={"white"} />
          </TouchableOpacity>

        </ScrollView>
        <FirstTimeSetupModal
          visible={showFirstTimeSetup}
          onSubmit={handleFirstTimeSetup}
        />

        <CustomModal onClose={closeConfig} title='Configurações' visible={showConfig} showCloseButton >
          <Configuration>

          </Configuration>
        </CustomModal>


        {/* Modal de login existente */}
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
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hexagon1top: {
    position: 'absolute',
    borderBottomColor: 'rgba(59, 131, 246, 0.07)',
    borderLeftColor: "rgba(0, 0, 0, 0.00)",
    borderRightColor: "rgba(0, 0, 0, 0.00)",
    borderBottomWidth: 30,
    borderLeftWidth: 52,
    borderRightWidth: 52,
    width: 0,
    top: 50,
    left: 40,
  },
  hexagon1mid: {
    position: 'absolute',
    backgroundColor: 'rgba(59, 131, 246, 0.07)',
    height: 60,
    width: 104,
    top: 80,
    left: 40,
  },
  hexagon1bot: {
    position: 'absolute',
    borderTopColor: 'rgba(59, 131, 246, 0.07)',
    borderLeftColor: "rgba(0, 0, 0, 0.00)",
    borderRightColor: "rgba(0, 0, 0, 0.00)",
    borderTopWidth: 30,
    borderLeftWidth: 52,
    borderRightWidth: 52,
    width: 0,
    top: 140,
    left: 40,
  },
  hexagon2top: {
    position: 'absolute',
    borderBottomColor: 'rgba(59, 131, 246, 0.07)',
    borderLeftColor: "rgba(0, 0, 0, 0.00)",
    borderRightColor: "rgba(0, 0, 0, 0.00)",
    borderBottomWidth: 30,
    borderLeftWidth: 52,
    borderRightWidth: 52,
    width: 0,
    top: 160,
    right: 80,
  },
  hexagon2mid: {
    position: 'absolute',
    backgroundColor: 'rgba(59, 131, 246, 0.07)',
    height: 60,
    width: 104,
    top: 190,
    right: 80,
  },
  hexagon2bot: {
    position: 'absolute',
    borderTopColor: 'rgba(59, 131, 246, 0.07)',
    borderLeftColor: "rgba(0, 0, 0, 0.00)",
    borderRightColor: "rgba(0, 0, 0, 0.00)",
    borderTopWidth: 30,
    borderLeftWidth: 52,
    borderRightWidth: 52,
    width: 0,
    top: 250,
    right: 80,
  },
  hexagon3top: {
    position: 'absolute',
    borderBottomColor: 'rgba(59, 131, 246, 0.08)',
    borderLeftColor: "rgba(0, 0, 0, 0.00)",
    borderRightColor: "rgba(0, 0, 0, 0.00)",
    borderBottomWidth: 30,
    borderLeftWidth: 52,
    borderRightWidth: 52,
    width: 0,
    top: 350,
    left: 80,
  },
  hexagon3mid: {
    position: 'absolute',
    backgroundColor: 'rgba(59, 131, 246, 0.08)',
    height: 60,
    width: 104,
    top: 380,
    left: 80,
  },
  hexagon3bot: {
    position: 'absolute',
    borderTopColor: 'rgba(59, 131, 246, 0.08)',
    borderLeftColor: "rgba(0, 0, 0, 0.00)",
    borderRightColor: "rgba(0, 0, 0, 0.00)",
    borderTopWidth: 30,
    borderLeftWidth: 52,
    borderRightWidth: 52,
    width: 0,
    top: 440,
    left: 80,
  },
  hexagon4top: {
    position: 'absolute',
    borderBottomColor: 'rgba(59, 131, 246, 0.10)',
    borderLeftColor: "rgba(0, 0, 0, 0.00)",
    borderRightColor: "rgba(0, 0, 0, 0.00)",
    borderBottomWidth: 30,
    borderLeftWidth: 52,
    borderRightWidth: 52,
    width: 0,
    top: 550,
    right: 40,
  },
  hexagon4mid: {
    position: 'absolute',
    backgroundColor: 'rgba(59, 131, 246, 0.10)',
    height: 60,
    width: 104,
    top: 580,
    right: 40,
  },
  hexagon4bot: {
    position: 'absolute',
    borderTopColor: 'rgba(59, 131, 246, 0.10)',
    borderLeftColor: "rgba(0, 0, 0, 0.00)",
    borderRightColor: "rgba(0, 0, 0, 0.00)",
    borderTopWidth: 30,
    borderLeftWidth: 52,
    borderRightWidth: 52,
    width: 0,
    top: 640,
    right: 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: 32,
  },
  logoContainer: {
    width: 96,
    height: 96,
    paddingTop: 8,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  mainContent: {
    flex: 1,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  infoCard: {
    backgroundColor: 'rgba(58, 80, 115, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.42)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  versionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.65)',
    marginBottom: 8,
  },
  copyrightText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.65)',
    textAlign: 'center',
  },
  configButton: {
    position: 'absolute',
    right: 20,
    top: 20,
  }
});