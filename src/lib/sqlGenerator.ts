import { AppState, TableSchema } from '../types';

export function generateSql(state: AppState): string {
  const table = state.schema.find((t) => t.id === state.activeTableId);
  if (!table) return '-- Select a table to start building your query.';

  switch (state.queryType) {
    case 'SELECT':
      return generateSelect(state, table.name);
    case 'INSERT':
      return generateInsert(state, table);
    case 'UPDATE':
      return generateUpdate(state, table);
    case 'DELETE':
      return generateDelete(state, table.name);
    case 'CREATE TABLE':
      return generateCreateTable(table);
    case 'DROP TABLE':
      return `DROP TABLE ${table.name};`;
    case 'TRUNCATE TABLE':
      return `TRUNCATE TABLE ${table.name};`;
    default:
      return '';
  }
}

function generateSelect(state: AppState, tableName: string) {
  const cols = state.selectedColumns.length > 0 ? state.selectedColumns.join(', ') : '*';
  let sql = `SELECT ${cols}\nFROM ${tableName}`;

  const where = buildWhere(state.conditions);
  if (where) sql += `\nWHERE ${where}`;

  if (state.sorting && state.sorting.column) {
    sql += `\nORDER BY ${state.sorting.column} ${state.sorting.direction}`;
  }

  if (state.limit !== '') {
    sql += `\nLIMIT ${state.limit}`;
  }

  return sql + ';';
}

function generateInsert(state: AppState, table: TableSchema) {
  const cols = state.selectedColumns.length > 0 ? state.selectedColumns : table.columns;
  const vals = cols.map((c) => {
    const val = state.columnValues[c];
    if (val !== undefined && val !== '') {
      return !isNaN(Number(val)) ? val : `'${val}'`;
    }
    return "'some_value'";
  }).join(', ');
  return `INSERT INTO ${table.name} (${cols.join(', ')})\nVALUES (${vals});`;
}

function generateUpdate(state: AppState, table: TableSchema) {
  const colsToUpdate = state.selectedColumns.length > 0 ? state.selectedColumns : table.columns;
  const sets = colsToUpdate.map((c) => {
    const val = state.columnValues[c];
    const formatted = val !== undefined && val !== '' ? (!isNaN(Number(val)) ? val : `'${val}'`) : "'new_value'";
    return `${c} = ${formatted}`;
  }).join(', ');

  let sql = `UPDATE ${table.name}\nSET ${sets}`;

  const where = buildWhere(state.conditions);
  if (where) sql += `\nWHERE ${where}`;
  else sql += `\n-- WARNING: Missing WHERE clause! This will update all rows.`;

  return sql + ';';
}

function generateDelete(state: AppState, tableName: string) {
  let sql = `DELETE FROM ${tableName}`;

  const where = buildWhere(state.conditions);
  if (where) sql += `\nWHERE ${where}`;
  else sql += `\n-- WARNING: Missing WHERE clause! This will delete all rows.`;

  return sql + ';';
}

function generateCreateTable(table: TableSchema) {
  if (table.columns.length === 0) return `CREATE TABLE ${table.name} (\n  id INTEGER PRIMARY KEY\n);`;
  const cols = table.columns.map((c) => `  ${c} TEXT`).join(',\n');
  return `CREATE TABLE ${table.name} (\n${cols}\n);`;
}

function buildWhere(conditions: import('../types').Condition[]) {
  if (conditions.length === 0) return '';
  return conditions
    .map((c) => {
      // Very basic handling for numeric vs string, or IN clause
      let formattedValue = `'${c.value}'`;
      if (c.operator === 'IN') {
        formattedValue = `(${c.value.split(',').map(v => `'${v.trim()}'`).join(', ')})`;
      } else if (!isNaN(Number(c.value)) && c.value !== '') {
        // Option to not quote numbers
        formattedValue = c.value;
      }
      return `${c.column} ${c.operator} ${formattedValue}`;
    })
    .join(' AND ');
}
