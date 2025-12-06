import * as XLSX from 'xlsx';
import { File, Paths } from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import { fetchOperator } from '@/models/operators';
import { Item, Operator } from '@/types/types';

export async function exportInventoryToExcel(inventoryData: Item[]) {
    try {
        const operators = await fetchOperator();

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
                'POSIÇÃO FÍSICA': item.reportedLocation || "",
                'DATA DA CONTAGEM': item.countTime || '',
                'MATRICULA RESP. CONTAGEM': getOperatorCode(operators, item.operator) || '',
                'NOME RESP. CONTAGEM': getOperatorName(operators, item.operator) || '',
                'OBSERVAÇÕES': item.observation || '',
            }));

        // 2 Cria a planilha
        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Inventário");

        // 3 Gera o arquivo como array de bytes
        const wbout = XLSX.write(wb, {
            bookType: 'xlsx',
            type: 'array' // Gera um ArrayBuffer para escrita binária
        });

        // 4 Converte ArrayBuffer para Uint8Array
        const binaryData = new Uint8Array(wbout);

        // 5 Salva o arquivo no diretório de documentos
        const fileName = `${inventoryData[0].inventoryDocument}.xlsx`;
        const file = new File(Paths.document, fileName);
        
        // Verifica se o arquivo existe e o deleta para evitar conflitos
        if (file.exists) {
            file.delete();
        }
        
        // Cria o arquivo com opção de sobrescrever
        file.create({ overwrite: true });
        // Escreve o conteúdo binário no arquivo
        file.write(binaryData);

        // 6 Verifica se o arquivo foi criado corretamente
        const fileInfo = file.info();
        if (!fileInfo.exists || fileInfo.size === 0) {
            throw new Error('Falha ao criar o arquivo: arquivo vazio ou não criado');
        }

        // 7 Compartilha o arquivo
        await shareAsync(file.uri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"',
            dialogTitle: 'Exportar Inventário'
        });

        return true;
    } catch (error) {
        console.error('Erro ao exportar inventário:', error);
        return false;
    }
}

export async function exportSurplusMaterialToExcel(inventoryData: Item[], inventoryDocument: string) {
    try {
        const operators = await fetchOperator();

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

        // 3 Gera o arquivo como array de bytes
        const wbout = XLSX.write(wb, {
            bookType: 'xlsx',
            type: 'array' // Gera um ArrayBuffer para escrita binária
        });

        // 4 Converte ArrayBuffer para Uint8Array
        const binaryData = new Uint8Array(wbout);

        // 5 Salva o arquivo no diretório de documentos
        const fileName = `excedente_inventario_${inventoryData[0].inventoryDocument}.xlsx`;
        const file = new File(Paths.document, fileName);
        
        // Verifica se o arquivo existe e o deleta para evitar conflitos
        if (file.exists) {
            file.delete();
        }
        
        // Cria o arquivo com opção de sobrescrever
        file.create({ overwrite: true });
        // Escreve o conteúdo binário no arquivo
        file.write(binaryData);

        // 6 Verifica se o arquivo foi criado corretamente
        const fileInfo = file.info();
        if (!fileInfo.exists || fileInfo.size === 0) {
            throw new Error('Falha ao criar o arquivo: arquivo vazio ou não criado');
        }

        // 7 Compartilha o arquivo
        await shareAsync(file.uri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: 'Exportar Inventário'
        });

        return true;
    } catch (error) {
        console.error('Erro ao exportar inventário:', error);
        return false;
    }
}

export function getOperatorName(operators: Operator[], id: string) {
    try {
        const op = operators.filter(o => o.id === Number(id));
        return op[0].name;
    } catch {
        return "";
    }
}

export function getOperatorCode(operators: Operator[], id: string) {
    try {
        const op = operators.filter(o => o.id === Number(id));
        return op[0].code;
    } catch {
        return "";
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
        ];

        // 1 Cria a planilha
        const ws = XLSX.utils.json_to_sheet(modelSheet);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Planilha Modelo");

        // 2 Gera o arquivo como array de bytes
        const wbout = XLSX.write(wb, {
            bookType: 'xlsx',
            type: 'array' // Gera um ArrayBuffer para escrita binária
        });

        // 3 Converte ArrayBuffer para Uint8Array
        const binaryData = new Uint8Array(wbout);

        // 4 Salva o arquivo no diretório de documentos
        const file = new File(Paths.document, 'planilha_modelo.xlsx');
        
        // Verifica se o arquivo existe e o deleta para evitar conflitos
        if (file.exists) {
            await file.delete();
        }
        
        // Cria o arquivo com opção de sobrescrever
        await file.create({ overwrite: true });
        // Escreve o conteúdo binário no arquivo
        await file.write(binaryData);

        // 5 Verifica se o arquivo foi criado corretamente
        const fileInfo = await file.info();
        if (!fileInfo.exists || fileInfo.size === 0) {
            throw new Error('Falha ao criar o arquivo: arquivo vazio ou não criado');
        }

        // 6 Compartilha o arquivo
        await shareAsync(file.uri, {
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