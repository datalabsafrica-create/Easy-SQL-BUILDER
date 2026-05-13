export interface TableSchema {
  id: string;
  name: string;
  columns: string[];
}

export type QueryType = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'CREATE TABLE' | 'DROP TABLE' | 'TRUNCATE TABLE';

export interface Condition {
  id: string;
  column: string;
  operator: string;
  value: string;
}

export interface Sort {
  column: string;
  direction: 'ASC' | 'DESC';
}

export interface AppState {
  schema: TableSchema[];
  activeTableId: string | null;
  queryType: QueryType;
  selectedColumns: string[];
  columnValues: Record<string, string>;
  conditions: Condition[];
  sorting: Sort | null;
  limit: number | '';
}

export interface SavedQuery {
  id: string;
  name: string;
  description: string;
  state: AppState;
  customSql: string;
  createdAt: number;
}

