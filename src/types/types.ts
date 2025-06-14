export type Operator = {
  id: number;
  name: string;
  code: string;
};

export type Inventory = {
  id: number;
  archiveName: string;
  uriArchive: string;
  importDate: string;
  status: number;
  qtyItems: number;
  qtyCountedItems: number;
};

export type CSVParseResult = {
  data: any[];
  errors: any[];
  meta: any;
};