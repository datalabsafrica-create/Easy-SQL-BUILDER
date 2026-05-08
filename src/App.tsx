import React, { useState, useEffect } from 'react';
import { DatabaseZap } from 'lucide-react';
import { AppState, TableSchema, SavedQuery } from './types';
import { generateSql } from './lib/sqlGenerator';
import { SchemaManager } from './components/SchemaManager';
import { QueryBuilder } from './components/QueryBuilder';
import { LivePreview } from './components/LivePreview';
import { AiBuilder } from './components/AiBuilder';
import { Templates } from './components/Templates';
import { SavedQueries } from './components/SavedQueries';
import { CourseModule } from './components/CourseModule';

export default function App() {
  const [state, setState] = useState<AppState>({
    schema: [],
    activeTableId: null,
    queryType: 'SELECT',
    selectedColumns: [],
    conditions: [],
    sorting: null,
    limit: '',
  });

  const [customSql, setCustomSql] = useState<string>('');
  const [isLoadedQuery, setIsLoadedQuery] = useState(false);
  
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>(() => {
    try {
      const stored = localStorage.getItem('easySql_savedQueries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('easySql_savedQueries', JSON.stringify(savedQueries));
  }, [savedQueries]);

  const rawSql = generateSql(state);

  // Clear custom AI SQL when user changes builder state, unless it was just loaded
  useEffect(() => {
    if (isLoadedQuery) {
      setIsLoadedQuery(false);
      return;
    }
    setCustomSql('');
  }, [state]);

  const handleSchemaChange = (newSchema: TableSchema[]) => {
    setState((s) => {
      // If active table was deleted, reset it
      const activeKept = newSchema.find((t) => t.id === s.activeTableId);
      return {
        ...s,
        schema: newSchema,
        activeTableId: activeKept ? s.activeTableId : null,
      };
    });
  };

  const handleTemplateSelect = (schema: TableSchema[], templateState: Partial<AppState>) => {
    setState((s) => ({
      ...s,
      ...templateState,
      schema,
    }));
  };

  const handleSaveQuery = (name: string, description: string) => {
    const newQuery: SavedQuery = {
      id: Math.random().toString(36).substring(7),
      name,
      description,
      state,
      customSql: customSql || rawSql,
      createdAt: Date.now()
    };
    setSavedQueries(prev => [newQuery, ...prev]);
  };

  const handleLoadQuery = (query: SavedQuery) => {
    setIsLoadedQuery(true);
    setState(query.state);
    setCustomSql(query.customSql);
  };

  const handleDeleteQuery = (id: string) => {
    setSavedQueries(prev => prev.filter(q => q.id !== id));
  };


  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-hidden">
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            <DatabaseZap className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            EasySQL <span className="text-indigo-600">Builder</span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-sm font-medium text-slate-500 hover:text-indigo-600">Templates</button>
          <div className="h-4 w-px bg-slate-200"></div>
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full">
            <button className="px-4 py-1.5 text-xs font-semibold rounded-full bg-white shadow-sm text-slate-800">Light</button>
            <button className="px-4 py-1.5 text-xs font-semibold rounded-full text-slate-500">Dark</button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden p-6 gap-6 max-w-[1400px] mx-auto w-full">
        {/* Left Sidebar: Query Builder */}
        <div className="w-full lg:w-[450px] flex flex-col gap-4 overflow-y-auto pr-2 pb-10">
          <AiBuilder 
            schema={state.schema} 
            onSqlGenerated={(sql) => setCustomSql(sql)} 
          />
          <SavedQueries queries={savedQueries} onLoad={handleLoadQuery} onDelete={handleDeleteQuery} />
          <Templates onSelectTemplate={handleTemplateSelect} />
          <SchemaManager schema={state.schema} onSchemaChange={handleSchemaChange} />
          <QueryBuilder state={state} setState={setState} rawSql={rawSql} />
        </div>

        {/* Right Side: Preview & Learning */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pb-10">
          <LivePreview sql={rawSql} customSql={customSql} onSave={handleSaveQuery} />
          <CourseModule />
        </div>
      </main>
    </div>
  );
}


