import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import { fetchOperator } from '@/models/operators';
import { Operator } from '@/types/types';

export async function exportInventoryToExcel(inventoryData: any[]) {
    try {

        const operators = await fetchOperator()

        // 1. Formata os dados para exportação
        const formattedData = inventoryData.map(item => ({
            'Documento Inventário': item.inventoryDocument || '',
            'Ano': item.year || '',
            'Centro': item.center || '',
            'Depósito': item.storage || '',
            'Lote': item.batch || '',
            'Item Inventário': item.inventoryItem || '',
            'Material': item.code,
            'Texto Breve': item.description || '',
            'Estoque Utilização Livre': item.expectedQuantity || '',
            'UN': item.unit || '',
            'Posição Depósito': item.expectedLocation || '',
            'Bloqueio': item.lock || '',
            'Descrição Completa': item.completeDescription || '',
            'Posição Informada': item.reportedLocation || '',
            'Quantidade Informada': item.reportedQuantity || '',
            'Status': getStatusDescription(item.status),
            'Observação': item.observation || '',
            'Operador': getOperatorName(operators, item.operator) || '',
            'Data/Hora Contagem': item.countTime || ''
        }));

        // 2. Cria a planilha
        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Inventário");

        // 3. Gera o arquivo
        const wbout = XLSX.write(wb, {
            type: 'base64',  // Usa base64 diretamente
            bookType: 'xlsx'
        });

        // 4. Salva o arquivo
        const fileUri = FileSystem.documentDirectory + `inventario_${Date.now()}.xlsx`;
        await FileSystem.writeAsStringAsync(fileUri, wbout, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // 5. Compartilha
        await shareAsync(fileUri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: 'Exportar Inventário'
        });

        return true;
    } catch (error) {
        console.error('Erro ao exportar inventário:', error);
        return false;
    }
}

function getStatusDescription(status: number) {
    const statusMap: Record<number, string> = {
        0: 'Não realizado',
        1: 'OK',
        2: 'Quantidade divergente',
        3: 'Localização Divergente',
        4: 'Quantidade e Localização Divergente',
        5: 'Item Novo'
    };
    return statusMap[status] || 'Desconhecido';
}

export function getOperatorName(operators: Operator[], id: string) {
    try{
        const op = operators.filter(o => o.id == Number(id))
        return op[0].name
    }catch{
        return ""
    }
}

//  Uso:
// const inventoryData = [/* seu JSON aqui */];
// exportInventoryToExcel(inventoryData)
//   .then(success => {
//     if (success) {
//       console.log('Exportação concluída com sucesso!');
//     }
//   });