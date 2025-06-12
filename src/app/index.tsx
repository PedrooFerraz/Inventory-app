import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MasterLoginModal from '@/components/home/master-login-modal';
import { masterPassword } from '@/password';
import Card from '@/components/home/card';
import { router } from 'expo-router';


export default function GMIHomeScreen() {
  const [showMasterLogin, setShowMasterLogin] = useState(false);
  const [password, setPassword] = useState('');

  const handleMasterAccess = () => {
    setShowMasterLogin(true);
  };

  const handleMasterLogin = () => {
    router.navigate("/")
  };

  const handleInventoryAccess = () => {
    router.navigate("/user-select-screen")
  };

  const handleCloseMasterLogin = () => {
    setShowMasterLogin(false);
    setPassword('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <LinearGradient
        colors={['#182234', '#121A2D']}
        style={styles.background}
      >
        <View style={styles.backgroundElements}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />
          <View style={[styles.circle, styles.circle4]} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.logoContainer}
            >
              <Ionicons name="cube-outline" size={48} color="#FFFFFF" />
            </LinearGradient>

            <Text style={styles.title}>Inventário GMI</Text>
            <Text style={styles.subtitle}>
              Sistema Profissional de Gestão de Inventário Industrial
            </Text>
          </View>

          <View style={styles.mainContent}>

            <Card icon={"shield-outline"} onPress={handleMasterAccess} title='Acesso Master' description='Administração do sistema' colors={['#EF4444', '#DC2626']}></Card>
            <Card icon={"cube-outline"} onPress={handleInventoryAccess} title='Realizar Inventário' description='Executar contagem de itens' colors={['#10B981', '#059669']}></Card>

            <View style={styles.infoCard}>
              <Text style={styles.versionText}>Versão 1.0.0</Text>
              <Text style={styles.copyrightText}>
                © 2025 GMI Consultoria • Todos os direitos reservados
              </Text>
            </View>

          </View>
        </ScrollView>
        <MasterLoginModal visible={showMasterLogin} handleCloseMasterLogin={handleCloseMasterLogin} handleMasterLogin={handleMasterLogin}></MasterLoginModal>
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
  circle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 1000,
  },
  circle1: {
    width: 128,
    height: 128,
    top: 80,
    left: 40,
  },
  circle2: {
    width: 96,
    height: 96,
    top: 160,
    right: 80,
  },
  circle3: {
    width: 160,
    height: 160,
    bottom: 128,
    left: 80,
  },
  circle4: {
    width: 64,
    height: 64,
    bottom: 80,
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#CBD5E1',
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
  accessCard: {
    backgroundColor: "#1c263d",
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
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
    marginBottom: 16,
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
    color: '#94A3B8',
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#64748B',
  },
  statusContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 8,
    padding: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.3)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  versionText: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 8,
  },
  copyrightText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  }
});