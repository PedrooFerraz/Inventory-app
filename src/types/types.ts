export type Operator = {
  id: number;
  name: string;
  code: string;
};

export type Inventory = {
  id: number;
  fileName: string;
  fileUri : string;
  importDate: string;
  status: number; // 0-Aberto, 1-Em Andamento, 2-Finalizado
  totalItems : number;
  countedItems : number;
};

export type CSVParseResult = {
  data: any[];
  errors: any[];
  meta: any;
};

export type Item = {
  id: number,
  inventory_id: number,
  code: string,
  description: string,
  expectedLocation: string,
  reportedLocation: string,
  expectedQuantity: number,
  reportedQuantity: number,
  status: number,
  observation: string,
  operator: string,
  countTime: string
}