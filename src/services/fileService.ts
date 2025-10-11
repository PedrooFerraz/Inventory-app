import { File } from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Papa from 'papaparse';
import { DocumentPickerAsset } from 'expo-document-picker';

interface CSVPreviewResult {
  totalRows: number;
  uniqueLocations: number;
}

interface FileInfo {
  fileUri: string;
  fileName: string;
}

// Salva o nome e URI do arquivo selecionado no AsyncStorage
export const saveSelectedFileInfo = async (fileUri: string, fileName: string): Promise<void> => {
  try {
    const info: FileInfo = { fileUri, fileName };
    await AsyncStorage.setItem('selectedFile', JSON.stringify(info));
  } catch (error) {
    throw new Error(`Erro ao salvar o arquivo selecionado: ${error}`);
  }
};

// Recupera o nome e URI do arquivo selecionado do AsyncStorage
export const getSelectedFileInfo = async (): Promise<FileInfo | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem('selectedFile');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    throw new Error(`Erro ao carregar o arquivo selecionado: ${error}`);
  }
};

// Limpa o cache de arquivos do AsyncStorage
export const clearFileCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('selectedFile');
  } catch (error) {
    throw new Error(`Erro ao limpar cache do arquivo: ${error}`);
  }
};

// Gera a pré-visualização de um arquivo CSV
export const generateCSVPreview = async (selectedDocument: DocumentPickerAsset): Promise<CSVPreviewResult> => {
  // Valida URI e tipo do arquivo
  if (!selectedDocument.uri) {
    throw new Error('URI do arquivo não fornecido');
  }
  if (!selectedDocument.name?.toLowerCase().endsWith('.csv')) {
    throw new Error('Arquivo selecionado não é um CSV');
  }

  // Limpa cache antes de processar novo arquivo
  await clearFileCache();

  // Lê o conteúdo do arquivo CSV
  let fileContent: string;
  try {
    const file = new File(selectedDocument.uri);
    if (!file.exists) {
      throw new Error('Arquivo não encontrado ou inacessível');
    }
    fileContent = await file.text();
  } catch (error) {
    throw new Error(`Erro ao ler o arquivo CSV: ${error}`);
  }

  let totalRows = 0;
  const locationSet = new Set<string>();

  return new Promise<CSVPreviewResult>((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      step: (row) => {
        const data = row.data as Record<string, any>;

        // Pula linhas inválidas ou cabeçalhos
        if (data['MATERIAL'] && data['MATERIAL'] !== 'MATERIAL') {
          totalRows++;
        }

        const location = data['POSIÇÃO NO DEPÓSITO'] || '';
        if (location && location !== 'POSIÇÃO NO DEPÓSITO') {
          locationSet.add(location.trim());
        }
      },
      complete: async () => {
        try {
          console.log(`CSV processado: ${totalRows} linhas, ${locationSet.size} localizações únicas.`);
          // Salva informações do arquivo processado
          await saveSelectedFileInfo(
            selectedDocument.uri,
            selectedDocument.name ?? 'arquivo.csv'
          );
          resolve({
            totalRows,
            uniqueLocations: locationSet.size,
          });
        } catch (error) {
          reject(new Error(`Erro ao salvar informações do arquivo: ${error}`));
        }
      },
      error: (error: any) => reject(new Error(`Erro ao processar o CSV: ${error.message}`)),
    });
  });
};

// Carrega a pré-visualização dos dados de múltiplos arquivos CSV
export const loadCSVPreview = async (assets: DocumentPickerAsset[]): Promise<{
  qty: number;
  localizations: number;
  fileQuantity: number;
}> => {
  try {
    const results = await Promise.all(assets.map(asset => generateCSVPreview(asset)));
    const totalRows = results.reduce((sum, res) => sum + res.totalRows, 0);
    const uniqueLocs = results.reduce((sum, res) => sum + res.uniqueLocations, 0);
    return { qty: totalRows, localizations: uniqueLocs, fileQuantity: assets.length };
  } catch (error) {
    throw new Error(`Erro ao carregar visualização dos CSVs: ${error}`);
  }
};

// Formata o tamanho do arquivo em unidades legíveis
export const formatSizeUnits = (bytes: number): string => {
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(2)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes > 1) return `${bytes} bytes`;
  if (bytes === 1) return `${bytes} byte`;
  return '0 bytes';
};