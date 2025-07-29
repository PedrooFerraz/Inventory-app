// ScanDebugOverlay.tsx
import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Props = {
  bounds?: {
    origin: { x: number; y: number };
    size: { width: number; height: number };
  };
};

export const ScanDebugOverlay = ({ bounds }: Props) => {
  const frameWidth = screenWidth * 0.8;
  const frameHeight = screenHeight * 0.3;
  const frameLeft = (screenWidth - frameWidth) / 2;
  const frameTop = (screenHeight - frameHeight) / 2;

  const boxStyle = bounds
    ? {
        left: bounds.origin.x,
        top: bounds.origin.y,
        width: bounds.size.width,
        height: bounds.size.height,
        borderColor: 'red',
      }
    : null;

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Frame de leitura desejado */}
      <View
        style={{
          position: 'absolute',
          left: frameLeft,
          top: frameTop,
          width: frameWidth,
          height: frameHeight,
          borderWidth: 2,
          borderColor: 'lime',
          borderRadius: 6,
        }}
      />

      {/* Retângulo do código detectado */}
      {boxStyle && (
        <View
          style={{
            position: 'absolute',
            ...boxStyle,
            borderWidth: 2,
            borderRadius: 4,
          }}
        />
      )}
    </View>
  );
};
