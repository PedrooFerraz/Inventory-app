import Ionicons from "@expo/vector-icons/Ionicons";
import { ColorValue, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function ButtonWithIcon({
  icon,
  label,
  onPress,
  color,
  disabled,
}: {
  onPress: any,
  icon: any,
  label: string,
  color: ColorValue | undefined,
  disabled?: boolean
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color },
        disabled ? styles.disabledButton : null
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={20} color={"white"} />
      <Text style={styles.name}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    gap: 10
  },
  disabledButton: {
    opacity: 0.5
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  }
})
