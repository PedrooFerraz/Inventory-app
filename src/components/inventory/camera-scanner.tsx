import { CameraView, Point, useCameraPermissions } from 'expo-camera';
import { useRef, useState, useEffect } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  StatusBar,
  Dimensions
} from 'react-native';

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
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const cooldownRef = useRef(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

  useEffect(() => {
    // Animação da linha de scan
    const scanAnimation = Animated.loop(
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
      scanAnimation.start();
    } else {
      scanAnimation.stop();
    }

    return () => {
      scanAnimation.stop();
    };
  }, [isScanning]);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#3A5073" />
        <View style={styles.modalOverlay}>
          <View style={styles.messageContainer}>
            <Text style={styles.message}>
              Precisamos de permissão para acessar sua câmera
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermission}
              activeOpacity={0.8}
            >
              <Text style={styles.permissionButtonText}>Permitir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const handleBarcodeScanned = (e: any) => {
    if (cooldownRef.current || !isScanning) return;

    const { origin, size } = e.bounds

    setX(origin.x)
    setY(origin.y)
    setWidth(size.width)
    setHeight(size.height)

    const isIn = isInScannableArea({ origin, size });
    setCodeInFrame(isIn);

    if (!isIn) return;

    cooldownRef.current = true;
    setCodeInFrame(false);
    onScan(e);

    setTimeout(() => {
      cooldownRef.current = false;
    }, 2000);
  };

  const isInScannableArea = ({ origin, size }: { origin: any, size: any }) => {
    const minY = origin.y;
    const maxY = minY + size.height;
    const minX = width - origin.x
    const maxX = minX - size.width

    if (minY >= 25 && maxY <= 400 && minX >= 67 && maxX <= 135) {
      return true
    } else {
      return false
    }
  };

  const toggleScanning = () => {
    setIsScanning(!isScanning);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3A5073" />
      <View style={{ position: 'absolute', top: y, left: x, width: width, height: height, borderWidth: 2, borderColor: "red" }}></View>
      {/* Camera Container */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['code39', 'code128', 'code93', 'qr', 'ean13', 'ean8'],
          }}
          onBarcodeScanned={handleBarcodeScanned}
        />
      </View>

      {/* Controles */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={onButtonPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleScanning}
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
    width: "100%",
    height: "100%",
    backgroundColor: '#3A5073',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  messageContainer: {
    backgroundColor: '#4E6B92',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#5a7fac',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative', // Importante para posicionamento absoluto do frame
  },
  camera: {
    position: 'absolute',
    width: '100%',
    height: "100%",
    overflow: 'hidden',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  backButton: {
    backgroundColor: '#5A7FAC',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  scanButton: {
    backgroundColor: '#5A7FAC',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  scanButtonPaused: {
    backgroundColor: '#5A7FAC',
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});