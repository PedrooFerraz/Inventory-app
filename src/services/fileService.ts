import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Papa from 'papaparse';
import { DocumentPickerAsset } from 'expo-document-picker';


const storeData = async (value : Papa.ParseResult<unknown> | DocumentPickerAsset, key: string) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    throw new Error("Erro ao salvar dados:" + e)
  }
};

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    throw new Error("Erro ao carregar dados:" + e)
  }
};

export const readDocument = async (SelectedDocument : DocumentPickerAsset) => {
    storeData(SelectedDocument, "fileInfo");

    let data = await FileSystem.readAsStringAsync(SelectedDocument.uri)
    let res = Papa.parse(data, {
        header: true,
        skipEmptyLines: true,
    })
    storeData(res, "fileData");
}