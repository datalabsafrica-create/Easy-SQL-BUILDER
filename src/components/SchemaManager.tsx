import { Plus, Trash2, FileType2 } from 'lucide-react';
import React, { useState } from 'react';
import { TableSchema } from '../types';

interface SchemaManagerProps {
  schema: TableSchema[];
  onSchemaChange: (newSchema: TableSchema[]) => void;
}

export function SchemaManager({ schema, onSchemaChange }: SchemaManagerProps) {
  const [newTableName, setNewTableName] = useState('');
  const [newColumns, setNewColumns] = useState('');

  const addTable = () => {
    if (!newTableName.trim()) return;
    const cols = newColumns.split(',').map((c) => c.trim()).filter((c) => c !== '');
    if (cols.length === 0) cols.push('id'); // Provide default

    const newSchema = [
      ...schema,
      {
        id: Math.random().toString(36).substring(7),
        name: newTableName.trim(),
        columns: cols,
      },
    ];
    onSchemaChange(newSchema);
    setNewTableName('');
    setNewColumns('');
  };

  const removeTable = (id: string) => {
    onSchemaChange(schema.filter((t) => t.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 flex-shrink-0">
      <div className="flex items-center gap-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <FileType2 className="w-4 h-4" /> My Tables
        </h3>
      </div>
      <p className="text-xs text-slate-500 font-medium">Tell the app about your data structure.</p>

      {schema.length > 0 && (
        <div className="flex flex-col gap-3">
          {schema.map((t) => (
            <div key={t.id} className="flex flex-col p-4 rounded-xl border border-slate-200 bg-slate-50 gap-3 relative">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-sm">{t.name}</span>
                <button title="Remove table" onClick={() => removeTable(t.id)} className="text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {t.columns.map((c, i) => (
                  <span key={i} className="text-[10px] uppercase tracking-wide font-bold px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-500">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 pt-2">
         <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Add Manually</h4>
          <input
            type="text"
            placeholder="Table name (e.g. users)"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Columns (comma separated)"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
            value={newColumns}
            onChange={(e) => setNewColumns(e.target.value)}
          />
          <button className="py-2.5 px-4 border-2 border-slate-200 hover:border-slate-300 text-slate-700 bg-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors" onClick={addTable}>
            <Plus className="w-4 h-4" /> Add Table
          </button>
         </div>
      </div>
    </div>
  );
}
