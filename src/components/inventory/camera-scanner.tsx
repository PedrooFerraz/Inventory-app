import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  StatusBar,
  Dimensions
} from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const scanBoxWidth = 300; // Largura maior
const scanBoxHeight = 120; // Altura menor

export default function CameraScanner({
  onScan,
  onButtonPress
}: {
  onScan: (e: any) => any,
  onButtonPress: () => any
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [codeInFrame, setCodeInFrame] = useState(false);
  const cooldownRef = useRef(false);

  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    if (isScanning) {
      animation.start();
    } else {
      animation.stop();
    }

    return () => animation.stop();
  }, [isScanning]);

  const handleBarcodeScanned = (e: any) => {
    if (cooldownRef.current || !isScanning) return;

    // Verifica se o código está dentro da área do scanBox
    const { bounds } = e;
    if (bounds?.origin) {
      const { x, y } = bounds.origin;
      if (
        y >= (windowWidth - scanBoxWidth) / 2 &&
        y <= (windowWidth + scanBoxWidth) / 2 &&
        x >= (windowHeight - scanBoxHeight) / 2 &&
        x <= (windowHeight + scanBoxHeight) / 2
      ) {
        setCodeInFrame(true);
        cooldownRef.current = true;
        onScan(e);

        setTimeout(() => {
          cooldownRef.current = false;
          setCodeInFrame(false);
        }, 2000);
      }
    }
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#3A5073" />
        <Text style={styles.message}>Precisamos de permissão para usar a câmera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Permitir</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3A5073" />

      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['code39', 'code128', 'code93', 'qr', 'ean13', 'ean8'],
        }}
      />

      {/* Overlay de escurecimento */}
      <View style={styles.overlay}>
        <View style={[styles.mask, { height: (windowHeight - scanBoxHeight) / 2 }]} />

        <View style={styles.centerRow}>
          <View style={styles.mask} />

          {/* Scan Box */}
          <View style={styles.scanBox}>
            {/* Canto decorativo */}
            <View style={[styles.corner, styles.topLeft, codeInFrame && styles.cornerActive]} />
            <View style={[styles.corner, styles.topRight, codeInFrame && styles.cornerActive]} />
            <View style={[styles.corner, styles.bottomLeft, codeInFrame && styles.cornerActive]} />
            <View style={[styles.corner, styles.bottomRight, codeInFrame && styles.cornerActive]} />

            {/* Linha animada */}
            {isScanning && (
              <Animated.View
                style={[
                  styles.scanLine,
                  codeInFrame && styles.scanLineActive,
                  {
                    transform: [{
                      translateY: scanLineAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-55, scanBoxHeight - 60], // ajuste da linha animada
                      }),
                    }],
                  },
                ]}
              />
            )}
          </View>

          <View style={styles.mask} />
        </View>

        <View style={[styles.mask, { height: (windowHeight - scanBoxHeight) / 2 }]} />
      </View>

      {/* Instruções */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.headerSubtitle}>
          Posicione o código dentro do quadro e toque em iniciar
        </Text>
      </View>

      {/* Botões */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={onButtonPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsScanning(!isScanning)}
          style={[styles.scanButton, !isScanning && styles.scanButtonPaused]}
        >
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Pausar' : 'Iniciar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#3A5073',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  mask: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
  },
  centerRow: {
    flexDirection: 'row',
  },
  scanBox: {
    width: scanBoxWidth,
    height: scanBoxHeight,
    position: 'relative',
    borderColor: 'white',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#fff',
  },
  scanLineActive: {
    backgroundColor: '#FFD700',
    height: 3,
  },
  corner: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderColor: '#FFF',
    borderWidth: 3,
  },
  cornerActive: {
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionsContainer: {
    backgroundColor: '#3A5073',
    padding: 20,
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#3A5073',
  },
  backButton: {
    backgroundColor: '#5A7FAC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  scanButton: {
    backgroundColor: '#5A7FAC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  scanButtonPaused: {
    opacity: 1,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  message: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#5a7fac',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
