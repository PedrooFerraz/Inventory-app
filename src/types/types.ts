export type Operator = {
  id: number;
  name: string;
  code: string;
};

export type Inventory = {
  id: number;
  fileName: string;
  fileUri: string;
  importDate: string;
  inventoryYear: string;
  status: number; // 0-Aberto, 1-Em Andamento, 2-Finalizado
  totalItems: number;
  countedItems: number;
  inventoryDocument: string;
  countType: number; //1-Contagem Barra 2-Contagem Posição
};

export type InventoryLocation = {
  id: number;
  inventory_id: number;
  location: string;
  status: number;
  totalItems: number;
  countedItems: number;
};

export type CSVParseResult = {
  data: any[];
  errors: any[];
  meta: any;
};

export type Item = {
  id: number,
  inventory_id: number,
  inventoryDocument: string,
  year: string,
  center: string,
  storage: string,
  batch: string,
  inventoryItem: string,
  unit: string,
  lock: string,
  completeDescription: string,
  code: string,
  description: string,
  expectedLocation: string,
  reportedLocation: string,
  expectedQuantity: number,
  reportedQuantity: number,
  status: number, //0-Não realizado 1-Ok 2-Quantidade divergente 3-Localização Divergente 4-Quantidade e Localização Divergente 5- Item Novo
  observation: string,
  operator: string,
  countTime: string
}

export type ImportedInventoryItem = {
  inventoryDocument: string;
  year: string;
  center: string;
  storage: string;
  batch: string;
  inventoryItem: string;
  code: string;
  description: string;
  expectedQuantity: number;
  unit: string;
  averagePrice: string;
  currency: string;
  expectedLocation: string;
};

export type ErrorModalProps = {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export interface fileInfo {
  date: string,
  name: string,
  size: string,
  uri: string
}

export interface BatchOption {
  batch: string;
  id: number;
}

export type scanTypes = "C" | "P" //C- Código Material; P- Posição

export type InventoryItem = {
  id: number;
  inventory_id: number;
  inventoryDocument: string | null;
  year: string | null;
  center: string | null;
  storage: string | null;
  batch: string | null;
  inventoryItem: string | null;
  code: string;
  description: string | null;
  expectedQuantity: number | null;
  unit: string | null;
  averagePrice: string | null;
  expectedLocation: string | null;
  reportedLocation: string | null;
  reportedQuantity: number | null;
  status: number;
  observation: string | null;
  operator: string | null;
  countTime: string | null;
};