import { Wand2, LayoutTemplate } from 'lucide-react';
import React, { useState } from 'react';
import { TableSchema, AppState } from '../types';
import { textToSql } from '../services/geminiService';

interface AiBuilderProps {
  schema: TableSchema[];
  onSqlGenerated: (sql: string) => void;
}

export function AiBuilder({ schema, onSqlGenerated }: AiBuilderProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const generateWithAi = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError('');
    try {
      const sql = await textToSql(prompt, schema);
      onSqlGenerated(sql);
      setPrompt('');
    } catch (err: any) {
      setError(err.message || 'Failed to generate query');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-indigo-600 rounded-2xl p-5 shadow-lg shadow-indigo-100 flex-shrink-0">
      <label className="text-white text-xs font-semibold uppercase tracking-wider opacity-80 mb-2 block flex items-center gap-2">
        <Wand2 className="w-4 h-4" />
        Ask AI to write for you
      </label>
      <div className="relative">
        <textarea
          placeholder="Show all active users from Paris..."
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 resize-none min-h-[80px]"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={generateWithAi}
          disabled={isGenerating || !prompt.trim()}
          className="absolute right-2 bottom-3 bg-white text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-70"
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </div>
      {error && <p className="text-xs text-white/90 mt-2 bg-red-500/20 px-3 py-1 rounded">{error}</p>}
    </div>
  );
}
