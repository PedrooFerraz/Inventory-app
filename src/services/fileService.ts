import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Papa from 'papaparse';
import { DocumentPickerAsset } from 'expo-document-picker';


const storeData = async (key: string, value: Papa.ParseResult<unknown>) => {
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

export const readDocument = async (SelectedDocument: DocumentPickerAsset) => {

    console.log(SelectedDocument)
    let data = await FileSystem.readAsStringAsync(SelectedDocument.uri)
    let res = Papa.parse(data, {
        header: true,
        skipEmptyLines: true,
    })
    await storeData("fileData", res);
}



export const formatSizeUnits = (bytes: number) => {
    let res
    if (bytes >= 1073741824) { res = (bytes / 1073741824).toFixed(2) + " GB"; }
    else if (bytes >= 1048576) { res = (bytes / 1048576).toFixed(2) + " MB"; }
    else if (bytes >= 1024) { res = (bytes / 1024).toFixed(2) + " KB"; }
    else if (bytes > 1) { res = bytes + " bytes"; }
    else if (bytes == 1) { res = bytes + " byte"; }
    else { res = "0 bytes"; }
    return res;
}