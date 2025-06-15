import { CameraView, useCameraPermissions } from 'expo-camera';

import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CameraScanner({ onScan, onButtonPress }: { onScan: (event: any) => any, onButtonPress: ()=> any }) {

  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.message}>Precisamos de Permissão para acessar sua camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['code39', 'code128', 'code93', 'qr', 'ean13', 'ean8'] }}
        onBarcodeScanned={(e) => { onScan(e) }}>
        <TouchableOpacity onPress={onButtonPress} style={styles.button} activeOpacity={0.8}>
          <Text style={styles.text}>Voltar</Text>
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    position: "absolute", 
    width: "100%", 
    height: "100%", 
    zIndex: 10, 
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 80
  },
  button: {
    alignItems: 'center',
    backgroundColor: "#5a7fac",
    padding: 14,
    borderRadius: 14,

  },
  text: {
    fontSize: 24,
    fontWeight: "600",
    color: "white"
  }
});
