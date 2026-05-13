import { Copy, Download, Code2, Sparkles, Save, X } from 'lucide-react';
import React, { useState } from 'react';
import Markdown from 'react-markdown';

interface LivePreviewProps {
  sql: string;
  customSql?: string; // allow overrides from AI
  onSave?: (name: string, description: string) => void;
}

export function LivePreview({ sql, customSql, onSave }: LivePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDesc, setSaveDesc] = useState('');
  
  const displaySql = customSql || sql;

  const handleCopy = () => {
    navigator.clipboard.writeText(displaySql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([displaySql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (onSave && saveName) {
      onSave(saveName, saveDesc);
      setIsSaving(false);
      setSaveName('');
      setSaveDesc('');
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full relative">
      {isSaving && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 rounded-3xl flex items-center justify-center p-6 text-center shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
           <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative text-left">
              <button onClick={() => setIsSaving(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2"><Save className="w-5 h-5 text-emerald-500"/> Save Query</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Name</label>
                  <input type="text" value={saveName} onChange={e => setSaveName(e.target.value)} placeholder="My Awesome Query" className="w-full border border-slate-200 rounded-lg p-2 outline-none focus:border-emerald-500 text-sm" autoFocus />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description (Optional)</label>
                  <textarea value={saveDesc} onChange={e => setSaveDesc(e.target.value)} placeholder="What does this query do?" className="w-full border border-slate-200 rounded-lg p-2 outline-none focus:border-emerald-500 text-sm resize-none h-20" />
                </div>
                <button 
                  onClick={handleSave}
                  disabled={!saveName}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-sm shadow-emerald-200"
                >
                  Save to Collection
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Live Preview Area */}
      <div className="flex-1 bg-slate-900 rounded-3xl p-8 relative overflow-hidden flex flex-col min-h-[300px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            Live SQL Result
          </h2>
          <div className="flex gap-2">
            {onSave && (
              <button 
                onClick={() => setIsSaving(true)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg flex items-center gap-1 transition-colors"
                title="Save this query"
              >
                <Save className="w-3 h-3" />
                Save
              </button>
            )}
            <button 
              onClick={handleCopy}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copied ? 'Copied' : 'Copy Code'}
            </button>
            <button 
              onClick={handleDownload}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium rounded-lg flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Export .sql
            </button>
          </div>
        </div>
        
        <div className="flex-1 font-mono text-lg md:text-xl leading-relaxed text-indigo-100 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
          <code className="max-w-2xl whitespace-pre-wrap w-full">
            {displaySql.split('\n').map((line, i) => {
              // Basic syntax highlighting logic for aesthetic
              const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE TABLE', 'ORDER BY', 'LIMIT', 'ASC', 'DESC'];
              let formattedLine = line;
              let isKeyword = false;
              keywords.forEach(k => {
                if (line.trim().startsWith(k)) isKeyword = true;
                formattedLine = formattedLine.replace(new RegExp(`\\b${k}\\b`, 'g'), `<span class="text-indigo-400">${k}</span>`);
              });
              if (!isKeyword && !line.trim().startsWith('--')) {
                 formattedLine = `<span class="text-slate-100">${formattedLine}</span>`;
              } else if (line.trim().startsWith('--')) {
                 formattedLine = `<span class="text-slate-500">${formattedLine}</span>`;
              }
              return (
                <React.Fragment key={i}>
                  <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
                  <br />
                </React.Fragment>
              );
            })}
          </code>
        </div>
      </div>

      {/* Learning Mode Section */}
      <div className="min-h-64 bg-white rounded-3xl border border-slate-200 p-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-800 font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Beginner Translation
          </h2>
          <div className="flex items-center gap-4">
             {/* Explain feature removed */}
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-slate-400 font-bold text-xs uppercase mb-1 tracking-wide">Step 1</div>
                <div className="text-slate-700 font-medium text-sm">"Select columns, filters, and sorting."</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-slate-400 font-bold text-xs uppercase mb-1 tracking-wide">Step 2</div>
                <div className="text-slate-700 font-medium text-sm">"Observe the generated SQL query."</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-slate-400 font-bold text-xs uppercase mb-1 tracking-wide">Step 3</div>
                <div className="text-slate-700 font-medium text-sm">"Copy or run the query to learn!"</div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
