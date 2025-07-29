import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type CornerPoint = { x: number; y: number };
type Props = {
  cornerPoints?: CornerPoint[];
};

export const ScanDebugOverlay = ({ cornerPoints }: Props) => {
  const frameWidth = screenWidth * 0.8;
  const frameHeight = screenHeight * 0.3;
  const frameLeft = (screenWidth - frameWidth) / 2;
  const frameTop = (screenHeight - frameHeight) / 2;

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Área de leitura central */}
      <View
        style={{
          position: 'absolute',
          left: frameLeft,
          top: frameTop,
          width: frameWidth,
          height: frameHeight,
          borderColor: 'lime',
          borderWidth: 2,
          borderRadius: 6,
        }}
      />

      {/* Pontos vermelhos nas extremidades do código */}
      {cornerPoints?.map((point, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            left: point.x - 4,
            top: point.y - 4,
            width: 8,
            height: 8,
            backgroundColor: 'red',
            borderRadius: 4,
          }}
        />
      ))}
    </View>
  );
};
