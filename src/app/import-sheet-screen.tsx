import { router } from "expo-router";
import HowToUse from "@/components/import-sheet/how-to-use";
import Ionicons from "@expo/vector-icons/Ionicons";
import DataPreview from "@/components/import-sheet/data-preview";
import { formatSizeUnits, getData, readDocument } from "@/services/fileService";
import * as DocumentPicker from 'expo-document-picker';
import FileInfoAfter from "@/components/import-sheet/file-info-after";
import ButtonWithIcon from "@/components/button-with-icon";
import FileInfoBefore from "@/components/import-sheet/file-info-before";
import { View, StyleSheet, Text, ScrollView } from "react-native"
import { useState } from "react";
import Loading from "@/components/import-sheet/loading-preview";

interface fileInfo {
  date: string,
  name: string,
  size: string,
}

interface dataPreview {
  qty: number,
  localizations: number
}

export default function ImportScreen() {

  const [fileInfo, setFileInfo] = useState<fileInfo>()
  const [showInfo, setShowInfo] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dataPreview, setDataPreview] = useState<dataPreview>()

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
        handleSelectDocument(selectedDoc.assets[0])
        readDocument(selectedDoc.assets[0])
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
      date: date.toLocaleDateString("Pt-br")
    }
    setShowInfo(true)
    setFileInfo(fileInfo)
    loadPreview()
  }

  const handleSelectOtherDocument = () => {
    setShowInfo(false)
    setFileInfo(undefined)
    setShowPreview(false)
  }

  const loadPreview = async () => {
    setIsLoading(true)
    setShowPreview(true)
    const res = await getData("fileData")

    // const localizations = res.data.filter((d: { Material: string; }) => d.Material == "100-400")

    const data : dataPreview = {
      qty: res.data.length,
      localizations: 1,
    }
    setIsLoading(false)
    console.log(res.meta)
    console.log("DATA: " + JSON.stringify(data))
  }


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


            {
              showInfo && fileInfo ?
                <FileInfoAfter date={fileInfo.date} name={fileInfo.name} size={fileInfo.size} otherDocument={handleSelectOtherDocument}></FileInfoAfter>
                :
                <FileInfoBefore onPress={getDoc}></FileInfoBefore>
            }
          </View>

          {
            showPreview && (
              isLoading ? <Loading /> : <DataPreview />
            )
          }


          {/* <ButtonWithIcon route={"/inventory-screen"} label="Importar Inventário" icon={"save-outline"}></ButtonWithIcon> */}

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