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
  status: number; // 0-Aberto, 1-Em Andamento, 2-Finalizado
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
  unit: string;
  lock: string;
  completeDescription: string;
  code: string;
  description: string;
  expectedLocation: string;
  expectedQuantity: number;
};

export type ErrorModalProps = {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export type scanTypes = "C" | "L" //C- Código Material; L- Localização