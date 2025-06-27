import { router } from "expo-router";
import HowToUse from "@/components/master/import-sheet/how-to-use";
import Ionicons from "@expo/vector-icons/Ionicons";
import DataPreview from "@/components/master/import-sheet/data-preview";
import { formatSizeUnits, generateCSVPreview, saveSelectedFileInfo, clearFileCache } from "@/services/fileService";
import * as DocumentPicker from 'expo-document-picker';
import FileInfoAfter from "@/components/master/import-sheet/file-info-after";
import ButtonWithIcon from "@/components/button-with-icon";
import FileInfoBefore from "@/components/master/import-sheet/file-info-before";
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from "react-native"
import { useState } from "react";
import Loading from "@/components/master/import-sheet/loading-preview";
import { insertInventory } from "@/models/inventory";
import { exportModelSheet } from "@/services/xlsxService";

interface fileInfo {
  date: string,
  name: string,
  size: string,
  uri: string
}

export interface dataPreview {
  qty: number,
  localizations: number
}

export default function ImportScreen() {

  const [fileInfo, setFileInfo] = useState<fileInfo>()
  const [showInfo, setShowInfo] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dataPreview, setDataPreview] = useState<dataPreview>()
  const [saving, setSaving] = useState(false)

  const getDoc = async () => {
    try {
      const doc = await DocumentPicker.getDocumentAsync({
        type: 'text/comma-separated-values',
        multiple: false,
      })

      if (doc.canceled) {
        return
      }
      const selectedDoc = doc as DocumentPicker.DocumentPickerSuccessResult
      if (selectedDoc.assets) {
        await saveSelectedFileInfo(selectedDoc.assets[0].uri, selectedDoc.assets[0].name)
        handleSelectDocument(selectedDoc.assets[0])
      }
    } catch (err: any) {
      console.log("Erro ao selecionar um documento:", err);
    }
  }
  const handleSelectDocument = (info: DocumentPicker.DocumentPickerAsset) => {
    let date = new Date()
    let MBSize: string
    if (typeof info.size === "number") {
      MBSize = formatSizeUnits(info.size)
    } else {
      MBSize = "0MB"
    }

    const fileInfo = {
      name: info.name,
      size: MBSize,
      date: date.toLocaleDateString("Pt-br"),
      uri: info.uri
    }
    setFileInfo(fileInfo)
    setShowInfo(true)
    loadPreview(info)
  }
  const handleSelectOtherDocument = () => {
    setShowInfo(false)
    setFileInfo(undefined)
    setShowPreview(false)
    clearFileCache()
  }
  const loadPreview = async (info: DocumentPicker.DocumentPickerAsset) => {
    setShowPreview(true)
    setIsLoading(true)
    const res = await generateCSVPreview(info)

    setIsLoading(false)
    const preview: dataPreview = {
      localizations: res.uniqueLocations,
      qty: res.totalRows
    }
    setDataPreview(preview)
  }
  const handleSubmit = async () => {
    await clearFileCache()

    if (!fileInfo?.uri || !fileInfo?.name) {
      return
    }

    setSaving(true)

    await insertInventory(fileInfo?.uri, fileInfo?.name)

    setSaving(false)

    router.navigate("/master-acess-screen")
  }

  const handleDowloadModel = async () => {
    exportModelSheet()
  }


  return (
    <View style={styles.container}>
      {saving &&
        <View style={{ position: "absolute", width: "100%", height: "100%", zIndex: 10, backgroundColor: "rgba(24, 34, 52, 0.8)" }}>
          <ActivityIndicator size={"large"} color={"#60A5FA"} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        </View>
      }
      <View style={styles.header} >
        <Ionicons onPress={() => router.back()} name="arrow-back" size={26} color={"white"} />
        <Text style={styles.headerTitle}>Importar Inventário</Text>
      </View>

      <ScrollView>

        <View style={styles.content}>

          <View style={styles.fileContainer}>

            <View style={styles.selectFileIconArea}>
              <Ionicons name="document-text-outline" size={32} color={"#FFFFFF"} />
            </View>

            <View style={styles.selectFile}>

              <Text style={styles.selectFileTitle}>
                Importar Dados do Inventário
              </Text>
              <Text style={styles.selectFileSubTitle}>
                Selecione o arquivo CSV com os dados atuais do estoque
              </Text>
            </View>
            {
              showInfo && fileInfo ?
                <FileInfoAfter date={fileInfo.date} name={fileInfo.name} size={fileInfo.size} otherDocument={handleSelectOtherDocument}></FileInfoAfter>
                :
                <FileInfoBefore onPress={getDoc}></FileInfoBefore>
            }
          </View>

          <ButtonWithIcon color={"#5A7BA2"} icon={"share-outline"} label="Baixar Planilha Modelo" onPress={() => {handleDowloadModel()}}>

          </ButtonWithIcon>

          {
            showPreview && (
              isLoading ?
                <Loading />
                :
                dataPreview && (
                  <View style={{ gap: 28 }}>
                    <DataPreview data={dataPreview} />
                    <ButtonWithIcon color={"#5A7BA2"} onPress={handleSubmit} label="Importar Inventário" icon={"save-outline"}></ButtonWithIcon>
                  </View>
                )
            )
          }
          <HowToUse></HowToUse>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3a5073"
  },
  header: {
    height: 90,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#4f6a92",
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
    borderColor: "#7284A0",
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
    backgroundColor: "#6b8ab5",
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
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 14,
    textAlign: "center"
  }

})