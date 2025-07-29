import { CameraView, Point, useCameraPermissions } from 'expo-camera';
import { useRef, useState, useEffect } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  StatusBar
} from 'react-native';
import { ScanDebugOverlay } from '../test/ScanDebugOverlay';

export default function CameraScanner({
  onScan,
  onButtonPress
}: {
  onScan: (e: any) => any,
  onButtonPress: () => any
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [codeInFrame, setCodeInFrame] = useState(false);
  const [bounds, setBounds] = useState<any>(null);
  const scanFrameRef = useRef<View>(null);
  const [scanFrameLayout, setScanFrameLayout] = useState<{
    pageX: number;
    pageY: number;
    width: number;
    height: number;
  } | null>(null);

  const cooldownRef = useRef(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    setTimeout(getLayoutOnScreen, 500);
  }, [isScanning]);

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
    if (cooldownRef.current || !isScanning || !scanFrameLayout) return;

    const scannableArea = {
      x: scanFrameLayout.pageX,
      y: scanFrameLayout.pageY,
      width: scanFrameLayout.width,
      height: scanFrameLayout.height
    };

    const isInScannableArea = isWithinScannableArea(e.cornerPoints, scannableArea);
    setBounds(e.bounds);
    setCodeInFrame(isInScannableArea);

    if (!isInScannableArea) return;

    cooldownRef.current = true;
    setCodeInFrame(false);
    setScanStatus('Código detectado!');

    onScan(e);

    setTimeout(() => {
      cooldownRef.current = false;
      setScanStatus('');
    }, 2000);
  };

  const getLayoutOnScreen = () => {

    const viewRef = scanFrameRef.current;

    if (viewRef && typeof viewRef.measureInWindow === 'function') {
      viewRef.measureInWindow((x, y, width, height) => {
        setScanFrameLayout({ pageX: x, pageY: y, width, height });
      });
    }
  };


  const isWithinScannableArea = (
    cornerPoints: Point[],
    scannableArea: { x: number; y: number; width: number; height: number }
  ) => {
    return cornerPoints.every((point) => {
      const isWithinXRange =
        point.x >= scannableArea.x &&
        point.x <= scannableArea.x + scannableArea.width;
      const isWithinYRange =
        point.y >= scannableArea.y &&
        point.y <= scannableArea.y + scannableArea.height;
      return isWithinXRange && isWithinYRange;
    });
  };

  const toggleScanning = () => {
    setIsScanning(!isScanning);
  };

  return (
    <View
      style={styles.container}
      onLayout={getLayoutOnScreen}
    >
      {/* <ScanDebugOverlay bounds={bounds}></ScanDebugOverlay> */}
      <StatusBar barStyle="light-content" backgroundColor="#3A5073" />

      {/* Header */}
      <View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scanner de Código</Text>
          <Text style={styles.headerSubtitle}>Posicione o código dentro do quadro</Text>
        </View>

      </View>

      {/* Camera Container */}
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
      }}
        ref={scanFrameRef}
      >
        <View
          style={{
            position: 'absolute',
            width: "100%",
            top: scanFrameLayout?.pageX,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
        >
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['code39', 'code128', 'code93', 'qr', 'ean13', 'ean8'],
            }}
            onBarcodeScanned={handleBarcodeScanned}
          />
          <View
            style={styles.scanFrame}
          >
            {/* Corner indicators */}
            <View style={[styles.corner, styles.topLeft, codeInFrame && styles.cornerActive]} />
            <View style={[styles.corner, styles.topRight, codeInFrame && styles.cornerActive]} />
            <View style={[styles.corner, styles.bottomLeft, codeInFrame && styles.cornerActive]} />
            <View style={[styles.corner, styles.bottomRight, codeInFrame && styles.cornerActive]} />

            {/* Scanning line */}
            {isScanning && (
              <Animated.View
                style={[
                  styles.scanLine,
                  codeInFrame && styles.scanLineActive,
                  {
                    transform: [
                      {
                        translateY: scanLineAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-80, 80],
                        }),
                      },
                    ],
                  },
                ]}
              />
            )}
          </View>
        </View>

        {/* Scanning Frame */}
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={onButtonPress}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleScanning}
          style={[
            styles.scanButton,
            !isScanning && styles.scanButtonPaused
          ]}
          activeOpacity={0.8}
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
    flex: 1,
    justifyContent: 'space-between',
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statusText: {
    color: '#FF9500',
    fontSize: 16,
    fontWeight: '500',
  },
  camera: {
    width: '90%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
  },
  scanFrame: {
    position: 'absolute',
    width: '80%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
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
    shadowOffset: {
      width: 0,
      height: 0,
    },
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
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#FFF',
    shadowColor: '#FFF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  scanLineActive: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    height: 3,
  },
  instructionsContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  instructionsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  instructionsText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    lineHeight: 20,
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