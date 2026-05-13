import { Filter, Database, FileSpreadsheet, ArrowDownAZ, List, Code2 } from 'lucide-react';
import React from 'react';
import { AppState, TableSchema } from '../types';
import { Tooltip } from './Tooltip';

interface QueryBuilderProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  rawSql?: string;
}

export function QueryBuilder({ state, setState, rawSql = '' }: QueryBuilderProps) {
  const activeTable = state.schema.find(t => t.id === state.activeTableId);

  // Remove unused handleQueryTypeChange
  const handleTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setState(s => ({ ...s, activeTableId: e.target.value, selectedColumns: [], columnValues: {}, conditions: [], sorting: null }));
  };

  const toggleColumn = (col: string) => {
    setState(s => {
      const selected = s.selectedColumns.includes(col)
        ? s.selectedColumns.filter(c => c !== col)
        : [...s.selectedColumns, col];
      return { ...s, selectedColumns: selected };
    });
  };

  const addCondition = () => {
    if (!activeTable) return;
    setState(s => ({
      ...s,
      conditions: [
        ...s.conditions,
        { id: Math.random().toString(), column: activeTable.columns[0] || '', operator: '=', value: '' }
      ]
    }));
  };

  const updateCondition = (id: string, field: string, value: string) => {
    setState(s => ({
      ...s,
      conditions: s.conditions.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };
  
  const removeCondition = (id: string) => {
    setState(s => ({ ...s, conditions: s.conditions.filter(c => c.id !== id) }));
  };

  const enableSorting = () => {
    if (!activeTable) return;
    setState(s => ({ ...s, sorting: { column: activeTable.columns[0] || '', direction: 'ASC' } }));
  }

  const [confirmDialog, setConfirmDialog] = React.useState<{isOpen: boolean, action: string | null}>({ isOpen: false, action: null });

  const handleQueryTypeChangeClick = (type: string) => {
    if (['DELETE', 'DROP TABLE', 'TRUNCATE TABLE'].includes(type) && state.schema.length > 0) {
      setConfirmDialog({ isOpen: true, action: type });
    } else {
      setState(s => ({ ...s, queryType: type as any }));
    }
  };

  const confirmAction = () => {
    if (confirmDialog.action) {
      setState(s => ({ ...s, queryType: confirmDialog.action as any }));
    }
    setConfirmDialog({ isOpen: false, action: null });
  };

  const cancelAction = () => {
    setConfirmDialog({ isOpen: false, action: null });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6 flex-shrink-0 relative">
      {confirmDialog.isOpen && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-2">Destructive Action Warning</h4>
          <p className="text-sm text-slate-600 mb-6">
            You are about to switch to a <strong>{confirmDialog.action}</strong> query. This is a destructive operation that could result in data loss if executed on your database. Keep in mind that this tool only generates SQL and doesn't run it. Are you sure you want to proceed?
          </p>
          <div className="flex gap-3 w-full">
            <button 
              onClick={cancelAction}
              className="flex-1 py-2 px-4 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-bold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={confirmAction}
              className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-sm shadow-red-200"
            >
              Confirm {confirmDialog.action}
            </button>
          </div>
        </div>
      )}

      {state.schema.length === 0 ? (
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-500 text-center">
          Please add a table below first.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action Type */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">1. What do you want to do?</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              <button 
                onClick={() => handleQueryTypeChangeClick('SELECT')}
                type="button"
                className={`py-3 px-2 border-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col items-center gap-1 transition-all ${
                  state.queryType === 'SELECT' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'
                }`}
              >
                <span>Get Data</span>
                <Tooltip text="SELECT: Retrieves data from one or more tables."><span className="text-[10px] font-normal">SELECT</span></Tooltip>
              </button>
              <button 
                onClick={() => handleQueryTypeChangeClick('INSERT')}
                type="button"
                className={`py-3 px-2 border-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col items-center gap-1 transition-all ${
                  state.queryType === 'INSERT' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'
                }`}
              >
                <span>Add Data</span>
                <Tooltip text="INSERT: Adds new rows of data into a table."><span className="text-[10px] font-normal">INSERT</span></Tooltip>
              </button>
              <button 
                onClick={() => handleQueryTypeChangeClick('UPDATE')}
                type="button"
                className={`py-3 px-2 border-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col items-center gap-1 transition-all ${
                  state.queryType === 'UPDATE' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'
                }`}
              >
                <span>Change Data</span>
                <Tooltip text="UPDATE: Modifies existing data in a table."><span className="text-[10px] font-normal">UPDATE</span></Tooltip>
              </button>
              <button 
                onClick={() => handleQueryTypeChangeClick('DELETE')}
                type="button"
                className={`py-3 px-2 border-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col items-center gap-1 transition-all ${
                  state.queryType === 'DELETE' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'
                }`}
              >
                <span>Remove Rows</span>
                <Tooltip text="DELETE: Removes existing rows from a table."><span className="text-[10px] font-normal">DELETE</span></Tooltip>
              </button>
              <button 
                onClick={() => handleQueryTypeChangeClick('CREATE TABLE')}
                type="button"
                className={`py-3 px-2 border-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col items-center gap-1 transition-all ${
                  state.queryType === 'CREATE TABLE' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'
                }`}
              >
                <span>Make Table</span>
                <Tooltip text="CREATE TABLE: Creates a new table in the database."><span className="text-[10px] font-normal">CREATE TABLE</span></Tooltip>
              </button>
              <button 
                onClick={() => handleQueryTypeChangeClick('DROP TABLE')}
                type="button"
                className={`py-3 px-2 border-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col items-center gap-1 transition-all ${
                  state.queryType === 'DROP TABLE' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'
                }`}
              >
                <span>Delete Table</span>
                <Tooltip text="DROP TABLE: Completely removes a table and all its data."><span className="text-[10px] font-normal">DROP TABLE</span></Tooltip>
              </button>
              <button 
                onClick={() => handleQueryTypeChangeClick('TRUNCATE TABLE')}
                type="button"
                className={`py-3 px-2 border-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col items-center gap-1 transition-all ${
                  state.queryType === 'TRUNCATE TABLE' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'
                }`}
              >
                <span>Clear Table</span>
                <Tooltip text="TRUNCATE TABLE: Empties a table without deleting the table itself."><span className="text-[10px] font-normal">TRUNCATE</span></Tooltip>
              </button>
            </div>
          </section>

          {/* Table Select */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex gap-1 items-center">
              2. Pick a data table 
              <span className="lowercase normal-case"><Tooltip text="FROM: Specifies which table to fetch or modify data in."><span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">FROM</span></Tooltip></span>
            </h3>
            <select 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 text-slate-700"
              value={state.activeTableId || ''} 
              onChange={handleTableChange}
            >
              <option value="" disabled>Select a table...</option>
              {state.schema.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </section>

          {activeTable && state.queryType !== 'CREATE TABLE' && state.queryType !== 'DROP TABLE' && state.queryType !== 'TRUNCATE TABLE' && (
            <>
              {/* Columns */}
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  3. Select information to {state.queryType === 'SELECT' ? 'show' : 'change'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span
                    onClick={() => setState(s => ({ ...s, selectedColumns: [], columnValues: {} }))}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${
                      state.selectedColumns.length === 0 
                        ? 'bg-indigo-100 text-indigo-700 border-indigo-200' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    All Columns (*)
                  </span>
                  {activeTable.columns.map(c => (
                    <span
                      key={c}
                      onClick={() => toggleColumn(c)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${
                        state.selectedColumns.includes(c)
                          ? 'bg-indigo-100 text-indigo-700 border-indigo-200' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </section>

              {/* Set Values */}
              {(state.queryType === 'INSERT' || state.queryType === 'UPDATE') && (
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex gap-1 items-center">
                    Set Values for {state.selectedColumns.length > 0 ? 'Selected' : 'All'} Columns
                  </h3>
                  <div className="flex flex-col gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {(state.selectedColumns.length > 0 ? state.selectedColumns : activeTable.columns).map(c => (
                      <div key={c} className="flex flex-col sm:flex-row gap-2 items-center">
                        <span className="text-sm font-medium text-slate-700 min-w-[120px]">{c} =</span>
                        <input 
                          type="text" 
                          placeholder="value" 
                          className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                          value={state.columnValues[c] || ''}
                          onChange={(e) => setState(s => ({ ...s, columnValues: { ...s.columnValues, [c]: e.target.value } }))}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Filtering */}
              {(state.queryType === 'SELECT' || state.queryType === 'UPDATE' || state.queryType === 'DELETE') && (
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex gap-1 items-center">
                    4. Filter rows that match...
                    <span className="lowercase normal-case"><Tooltip text="WHERE: Filters rows based on a specified condition."><span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">WHERE</span></Tooltip></span>
                  </h3>
                  <div className="flex flex-col gap-3">
                    {state.conditions.map(c => (
                      <div key={c.id} className="flex flex-col sm:flex-row gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <span className="text-xs font-bold text-slate-400 uppercase px-2">Where</span>
                        <Tooltip text="Column: The field in the data table you want to check." noUnderline className="flex-1">
                          <select 
                            className="w-full min-w-[100px] p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none" 
                            value={c.column} 
                            onChange={(e) => updateCondition(c.id, 'column', e.target.value)}
                          >
                            {activeTable.columns.map(col => <option key={col} value={col}>{col}</option>)}
                          </select>
                        </Tooltip>
                        <Tooltip text={`Operator: ${c.operator === '=' ? "'=' means 'is exactly'" : c.operator === '!=' ? "'!=' means 'is not'" : c.operator === '>' ? "'>' means 'greater than'" : c.operator === '<' ? "'<' means 'less than'" : c.operator === 'LIKE' ? "'LIKE' means 'contains'" : "'IN' means 'is one of'"}.`} noUnderline className="flex-1">
                          <select 
                            className="w-full min-w-[90px] p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none" 
                            value={c.operator}
                            onChange={(e) => updateCondition(c.id, 'operator', e.target.value)}  
                          >
                            <option value="=" title="'=' means 'is exactly'">is exactly</option>
                            <option value="!=" title="'!=' means 'is not'">is not</option>
                            <option value=">" title="'>' means 'greater than'">greater than</option>
                            <option value="<" title="'<' means 'less than'">less than</option>
                            <option value="LIKE" title="'LIKE' means 'contains'">contains</option>
                            <option value="IN" title="'IN' means 'is one of'">is one of</option>
                          </select>
                        </Tooltip>
                        <Tooltip text="Value: The specific data expected to match the column." noUnderline className="flex-1">
                          <input 
                            type="text" 
                            placeholder="Value" 
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                            value={c.value}
                            onChange={(e) => updateCondition(c.id, 'value', e.target.value)}
                          />
                        </Tooltip>
                        <button 
                          onClick={() => removeCondition(c.id)}
                          className="text-slate-400 hover:text-red-500 p-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button className="text-xs text-indigo-600 font-bold self-start hover:text-indigo-800 uppercase tracking-wide flex items-center gap-1" onClick={addCondition}>
                      + Add a condition
                    </button>
                  </div>
                </section>
              )}

              {/* Sorting and Limiting */}
              {state.queryType === 'SELECT' && (
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex gap-1 items-center">
                    5. Sort & Limit
                    <span className="lowercase normal-case"><Tooltip text="ORDER BY: Sorts the result set. LIMIT: Restricts the number of rows returned."><span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">ORDER BY / LIMIT</span></Tooltip></span>
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-xs font-medium text-slate-600">Sort results by</span>
                      {state.sorting ? (
                        <div className="flex gap-2 items-center">
                          <select 
                            className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                            value={state.sorting.column}
                            onChange={(e) => setState(s => ({ ...s, sorting: { ...s.sorting!, column: e.target.value } }))}
                          >
                            {activeTable.columns.map(col => <option key={col} value={col}>{col}</option>)}
                          </select>
                          <select
                            className="w-20 p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                            value={state.sorting.direction}
                            onChange={(e) => setState(s => ({ ...s, sorting: { ...s.sorting!, direction: e.target.value as any } }))}
                          >
                            <option value="ASC">A-Z</option>
                            <option value="DESC">Z-A</option>
                          </select>
                          <button onClick={() => setState(s => ({...s, sorting: null}))} className="text-slate-400 hover:text-red-500 px-1">✕</button>
                        </div>
                      ) : (
                        <button className="text-xs text-indigo-600 font-bold self-start hover:text-indigo-800 uppercase tracking-wide flex items-center gap-1" onClick={enableSorting}>
                          + Add sorting
                        </button>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                       <span className="text-xs font-medium text-slate-600">Max rows to show</span>
                      <input 
                        type="number" 
                        placeholder="e.g. 10 (blank for all)" 
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                        value={state.limit}
                        onChange={(e) => setState(s => ({ ...s, limit: e.target.value ? parseInt(e.target.value) : '' }))}
                      />
                    </div>
                  </div>
                </section>
              )}
            </>
          )}

          {rawSql && state.schema.length > 0 && activeTable && (
            <section className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex gap-1 items-center">
                <Code2 className="w-4 h-4 text-emerald-500" />
                Live SQL Output
              </h3>
              <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto min-h-[160px] flex items-start">
                <code className="text-sm md:text-base font-mono text-emerald-400 whitespace-pre leading-relaxed">
                  {rawSql}
                </code>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
