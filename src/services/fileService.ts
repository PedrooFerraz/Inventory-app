import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Papa from 'papaparse';
import { DocumentPickerAsset } from 'expo-document-picker';

interface CSVPreviewResult {
  totalRows: number;
  uniqueLocations: number;
}

// Apenas salva o fileUri e o nome do arquivo
export const saveSelectedFileInfo = async (fileUri: string, fileName: string) => {
  try {
    const info = { fileUri, fileName };
    await AsyncStorage.setItem('selectedFile', JSON.stringify(info));
  } catch (error) {
    throw new Error('Erro ao salvar o arquivo selecionado:' + error);
  }
};

export const getSelectedFileInfo = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('selectedFile');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    throw new Error('Erro ao carregar o arquivo selecionado:' + error);
  }
};

export const clearFileCache = async () => {
  try {
    await AsyncStorage.removeItem('selectedFile');
  } catch (error) {
    throw new Error('Erro ao limpar cache do arquivo:' + error);
  }
};

export const generateCSVPreview = async (SelectedDocument: DocumentPickerAsset): Promise<CSVPreviewResult> => {

  await clearFileCache();

  const fileContent = await FileSystem.readAsStringAsync(SelectedDocument.uri, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  let totalRows = 0;
  const locationSet = new Set<string>();

  return new Promise<CSVPreviewResult>((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      step: (row) => {

        const data = row.data as Record<string, any>;

        if (data["MATERIAL"] !== "" && data["MATERIAL"] !== "MATERIAL")
          totalRows++;

        const location = data['POSIÇÃO NO DEPÓSITO'] || ''; // Ajuste o nome da coluna de acordo com seu CSV
        if (location && location !== "POSIÇÃO NO DEPÓSITO") {
          locationSet.add(location.trim());
        }

      },
      complete: async () => {
        // Salva apenas a referência ao arquivo no AsyncStorage
        await saveSelectedFileInfo(SelectedDocument.uri, SelectedDocument.name ?? 'arquivo.csv');

        resolve({
          totalRows,
          uniqueLocations: locationSet.size
        });
      },
      error: (error: any) => reject(error),
    });
  });
};

export const formatSizeUnits = (bytes: number) => {
  let res;
  if (bytes >= 1073741824) { res = (bytes / 1073741824).toFixed(2) + ' GB'; }
  else if (bytes >= 1048576) { res = (bytes / 1048576).toFixed(2) + ' MB'; }
  else if (bytes >= 1024) { res = (bytes / 1024).toFixed(2) + ' KB'; }
  else if (bytes > 1) { res = bytes + ' bytes'; }
  else if (bytes === 1) { res = bytes + ' byte'; }
  else { res = '0 bytes'; }
  return res;
};
