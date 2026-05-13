import { Wand2, LayoutTemplate, X, BookOpen } from 'lucide-react';
import React, { useState } from 'react';
import { TableSchema } from '../types';
import { getGuidance } from '../services/geminiService';
import Markdown from 'react-markdown';

interface AiBuilderProps {
  schema: TableSchema[];
}

export function AiBuilder({ schema }: AiBuilderProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [guidance, setGuidance] = useState('');

  const generateWithAi = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError('');
    setGuidance('');
    try {
      const result = await getGuidance(prompt, schema);
      setGuidance(result);
      setPrompt('');
    } catch (err: any) {
      setError(err.message || 'Failed to generate guidance');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-indigo-600 rounded-2xl p-5 shadow-lg shadow-indigo-100 flex-shrink-0">
      <label className="text-white text-sm font-bold tracking-wide opacity-90 mb-2 flex items-center gap-2">
        <Wand2 className="w-4 h-4" />
        Ask AI for Guidance
      </label>
      <div className="relative">
        <textarea
          placeholder="Describe your goal in plain English (e.g. 'How do I find all active users from Paris?')..."
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 resize-none min-h-[80px]"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={generateWithAi}
          disabled={isGenerating || !prompt.trim()}
          className="absolute right-2 bottom-3 bg-white text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-70 transition-colors"
        >
          {isGenerating ? 'Analyzing...' : 'Get Help'}
        </button>
      </div>
      
      {guidance && (
        <div className="mt-4 bg-white rounded-xl p-4 relative group">
          <button 
            onClick={() => setGuidance('')}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h4 className="font-bold text-sm text-slate-800">AI Mentor Guidance</h4>
          </div>
          <div className="text-sm text-slate-700 prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-50 prose-pre:text-slate-800">
            <Markdown>{guidance}</Markdown>
          </div>
        </div>
      )}

      {!guidance && (
        <div className="mt-3 text-xs text-indigo-200">
          <p className="font-semibold mb-1 opacity-90">Tips for better guidance:</p>
          <ul className="list-disc pl-4 space-y-1 opacity-80">
            <li>Describe what you want to <strong>highlight (select)</strong> or calculate.</li>
            <li>Mention specific <strong>table names</strong> or <strong>columns</strong>.</li>
            <li>Explain your <strong>conditions</strong> clearly.</li>
          </ul>
        </div>
      )}
      {error && <p className="text-xs text-white/90 mt-3 bg-red-500/20 px-3 py-2 rounded">{error}</p>}
    </div>
  );
}
