import React from 'react';
import { View, Text, TextInput } from 'react-native';

export const FormInput = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  keyboardType = 'default',
  required = false
} :
{
    label: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    required?: boolean;
}


) => {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ 
        marginBottom: 8, 
        fontWeight: '500',
        color: 'white'
      }}>
        {label}{required && ' *'}
      </Text>
      <TextInput
        style={{
          width: '100%',
          padding: 12,
          backgroundColor: '#3a5073',
          color: 'white',
          fontSize: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: 'rgba(51, 65, 85, 0.42)',
        }}
        placeholder={placeholder}
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
};