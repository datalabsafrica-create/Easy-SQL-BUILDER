import { Save, Play, Trash2 } from 'lucide-react';
import React from 'react';
import { SavedQuery } from '../types';

interface SavedQueriesProps {
  queries: SavedQuery[];
  onLoad: (query: SavedQuery) => void;
  onDelete: (id: string) => void;
}

export function SavedQueries({ queries, onLoad, onDelete }: SavedQueriesProps) {
  if (queries.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 flex-shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <Save className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800">Saved Queries</h2>
          <p className="text-xs text-slate-500">Your collection of queries</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {queries.map(q => (
          <div key={q.id} className="group relative bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col gap-1 hover:border-emerald-500/30 transition-all">
            <h3 className="text-sm font-bold text-slate-700">{q.name}</h3>
            {q.description && <p className="text-xs text-slate-500 line-clamp-1">{q.description}</p>}
            <p className="text-[10px] text-slate-400 font-mono line-clamp-1 mt-1">{q.customSql || "..."}</p>
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white shadow-sm border border-slate-100 rounded-lg p-1">
              <button 
                onClick={() => onLoad(q)}
                title="Load Query"
                className="w-7 h-7 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-md"
              >
                <Play className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => onDelete(q.id)}
                title="Delete Query"
                className="w-7 h-7 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-md"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
