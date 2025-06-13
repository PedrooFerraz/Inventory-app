import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, Button } from "react-native"
import * as DocumentPicker from 'expo-document-picker';
import { readDocument } from "@/services/fileService";
import { useEffect, useState } from "react";
import { getData } from "@/services/fileService";
import Ionicons from "@expo/vector-icons/Ionicons";
import HowToUse from "@/components/how-to-use";
import FileInfoBefore from "@/components/file-info-before";
import FileInfoAfter from "@/components/file-info-after";
import DataPreview from "@/components/data-preview";
import { router } from "expo-router";
import ButtonWithIcon from "@/components/button-with-icon";

export default function ImportScreen() {

  const [selectedFile, setSelectedFile] = useState<string>();

  useEffect(() => {

    getData("fileInfo")
      .then(data => setSelectedFile(data.name))

  }, [])

  const pickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/comma-separated-values"
      });

      if (result.canceled) {
        console.log("Seleção do Documento Cancelada");
      }
      const successResult = result as DocumentPicker.DocumentPickerSuccessResult;

      if (successResult.assets) {
        readDocument(successResult.assets[0])
      }
    } catch (error) {
      console.log("Erro ao selecionar um documento:", error);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.header} >
         <Ionicons onPress={() => router.back()} name="arrow-back" size={26} color={"white"} />
        <Text style={styles.headerTitle}>Importar Inventário</Text>
      </View>

      <ScrollView>

        <View style={styles.content}>

          <View style={styles.fileContainer}>

            <View style={styles.selectFileIconArea}>
              <Ionicons name="document-text-outline" size={32} color={"#94A3B8"} />
            </View>

            <View style={styles.selectFile}>

              <Text style={styles.selectFileTitle}>
                Importar Dados do Inventário
              </Text>
              <Text style={styles.selectFileSubTitle}>
                Selecione o arquivo CSV com os dados atuais do estoque
              </Text>
            </View>

            {/* <FileInfoBefore></FileInfoBefore> */}
            
            <FileInfoAfter></FileInfoAfter>
          </View>

          <DataPreview></DataPreview>

          <ButtonWithIcon route={"/inventory-screen"} label="Importar Inventário" icon={"save-outline"}></ButtonWithIcon>

          <HowToUse></HowToUse>

        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121A2D"
  },
  header: {
    height: 90,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#182234",
    alignItems: "center",
    color: "white",
    gap: 16,
    paddingHorizontal: 20
  },
  headerTitle: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  headerSubTitle: {
    fontSize: 14,
    color: "#94A3B8",
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 28
  },
  fileContainer: {
    borderColor: "#475569",
    borderWidth: 2,
    borderRadius: 15,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 30
  },
  selectFile: {
    gap: 8
  },
  selectFileIconArea: {
    backgroundColor: "#263246",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    width: 60,
  },
  selectFileTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center"
  },
  selectFileSubTitle: {
    color: "#94A3B8",
    fontSize: 14,
    textAlign: "center"
  }

})