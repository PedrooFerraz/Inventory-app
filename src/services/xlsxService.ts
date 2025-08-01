import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import { fetchOperator } from '@/models/operators';
import { Inventory, Item, Operator } from '@/types/types';

export async function exportInventoryToExcel(inventoryData: Item[]) {
    try {

        const operators = await fetchOperator()

        // 1 Formata os dados para exportação
        const formattedData = inventoryData
            .filter(item => item.status !== 5)
            .map(item => ({
                'INVENTÁRIO': item.inventoryDocument || '',
                'ANO': item.year || '',
                'CENTRO': item.center || '',
                'DEPÓSITO': item.storage || '',
                'LOTE': item.batch || '',
                'ITEM': item.inventoryItem || '',
                'MATERIAL': item.code,
                'ESTOQUE SAP': item.expectedQuantity || "",
                'POSIÇÃO SAP': item.expectedLocation || "",
                'ESTOQUE FÍSICO': item.reportedQuantity || 0,
                'POSIÇÃO FÍSICA': item.reportedLocation || item.expectedLocation || "",
                'DATA DA CONTAGEM': item.countTime || '',
                'MATRICULA RESP. CONTAGEM': getOperatorCode(operators, item.operator) || '',
                'NOME RESP. CONTAGEM': getOperatorName(operators, item.operator) || '',
                'OBSERVAÇÕES': item.observation || '',
            }));

        // 2 Cria a planilha
        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Inventário");

        // 3 Gera o arquivo
        const wbout = XLSX.write(wb, {
            type: 'base64',  // Usa base64 diretamente
            bookType: 'xlsx'
        });

        // 4 Salva o arquivo
        const fileName = `${inventoryData[0].inventoryDocument}.xlsx`;
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, wbout, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // 5 Compartilha
        await shareAsync(fileUri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: 'Exportar Inventário',
            UTI: 'com.microsoft.excel.xlsx'
        });

        return true;
    } catch (error) {
        console.error('Erro ao exportar inventário:', error);
        return false;
    }
}

export async function exportSurplusMaterialToExcel(inventoryData: Item[]) {
    try {

        const operators = await fetchOperator()

        // 1 Formata os dados para exportação
        const formattedData = inventoryData
            .filter(item => item.status === 5)
            .map(item => ({
                'INVENTÁRIO': item.inventoryDocument || '',
                'ANO': item.year || '',
                'CENTRO': item.center || '',
                'DEPÓSITO': item.storage || '',
                'LOTE': item.batch || '',
                'ITEM': item.inventoryItem || '',
                'MATERIAL': item.code,
                'ESTOQUE SAP': item.expectedQuantity || "",
                'POSIÇÃO SAP': item.expectedLocation || "",
                'ESTOQUE FÍSICO': item.reportedQuantity || 0,
                'POSIÇÃO FÍSICA': (item.reportedLocation || item.expectedLocation || "").toUpperCase(),
                'DATA DA CONTAGEM': item.countTime || '',
                'MATRICULA RESP. CONTAGEM': getOperatorCode(operators, item.operator) || '',
                'NOME RESP. CONTAGEM': getOperatorName(operators, item.operator) || '',
                'OBSERVAÇÕES': item.observation || '',
            }));

        // 2 Cria a planilha
        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Inventário");

        // 3 Gera o arquivo
        const wbout = XLSX.write(wb, {
            type: 'base64',  // Usa base64 diretamente
            bookType: 'xlsx'
        });

        // 5 Compartilha
       const fileName = `excedente_inventario_${inventoryData[0].inventoryDocument}.xlsx`;
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, wbout, {
            encoding: FileSystem.EncodingType.Base64,
        });

        await shareAsync(fileUri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: 'Exportar Inventário',
            UTI: 'com.microsoft.excel.xlsx'
        });

        return true;
    } catch (error) {
        console.error('Erro ao exportar inventário:', error);
        return false;
    }
}

export function getOperatorName(operators: Operator[], id: string) {
    try {
        const op = operators.filter(o => o.id === Number(id))
        return op[0].name
    } catch {
        return ""
    }
}

export function getOperatorCode(operators: Operator[], id: string) {
    try {
        const op = operators.filter(o => o.id === Number(id))
        return op[0].code
    } catch {
        return ""
    }
}

export async function exportModelSheet() {
    try {
        const modelSheet = [
            { "INVENTÁRIO": "" },
            { "ANO": "" },
            { "CENTRO": "" },
            { "DEPÓSITO": "" },
            { "LOTE": "" },
            { "ITEM": "" },
            { "MATERIAL": "" },
            { "DESCRIÇÃO": "" },
            { "ESTOQUE": "" },
            { "UN": "" },
            { "PREÇO MÉDIO": "" },
            { "POSIÇÃO NO DEPÓSITO": "" },
        ]
        // 2 Cria a planilha
        const ws = XLSX.utils.json_to_sheet(modelSheet);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Planilha Modelo",);

        // 3 Gera o arquivo
        const wbout = XLSX.write(wb, {
            type: 'base64',  // Usa base64 diretamente
            bookType: 'xlsx'
        });

        // 5 Compartilha
       const fileName = `planilha_modelo.xlsx`;
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, wbout, {
            encoding: FileSystem.EncodingType.Base64,
        });

        await shareAsync(fileUri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: 'Exportar Inventário',
            UTI: 'com.microsoft.excel.xlsx'
        });

        return true;
    } catch (error) {
        console.error('Erro ao exportar planilha modelo:', error);
        return false;
    }
}