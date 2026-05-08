import React from 'react';
import { BookOpen } from 'lucide-react';
import { AppState } from '../types';

interface TemplatesProps {
  onSelectTemplate: (schema: any[], state: Partial<AppState>) => void;
}

export function Templates({ onSelectTemplate }: TemplatesProps) {
  
  const applyTemplate = (templateId: string) => {
    if (templateId === 'all_users') {
      const id = 't_users';
      onSelectTemplate(
        [{ id, name: 'users', columns: ['id', 'name', 'email', 'signup_date', 'plan'] }],
        { activeTableId: id, queryType: 'SELECT', selectedColumns: [], conditions: [], limit: '' }
      );
    } else if (templateId === 'products_under_price') {
      const id = 't_prods';
      onSelectTemplate(
        [{ id, name: 'products', columns: ['id', 'name', 'category', 'price', 'stock'] }],
        { 
          activeTableId: id, 
          queryType: 'SELECT', 
          selectedColumns: ['name', 'price'], 
          conditions: [{ id: '1', column: 'price', operator: '<', value: '50' }],
          sorting: { column: 'price', direction: 'ASC' },
          limit: ''
        }
      );
    } else if (templateId === 'update_email') {
      const id = 't_cust';
      onSelectTemplate(
        [{ id, name: 'customers', columns: ['id', 'name', 'email', 'phone'] }],
        {
          activeTableId: id,
          queryType: 'UPDATE',
          selectedColumns: ['email'],
          conditions: [{ id: '1', column: 'id', operator: '=', value: '42' }],
          limit: ''
        }
      );
    } else if (templateId === 'create_employee') {
      const id = 't_emp';
      onSelectTemplate(
        [{ id, name: 'employees', columns: ['id', 'first_name', 'last_name', 'role', 'salary', 'hire_date'] }],
        {
          activeTableId: id,
          queryType: 'CREATE TABLE',
          selectedColumns: [],
          conditions: [],
          limit: ''
        }
      );
    } else if (templateId === 'delete_duplicate') {
      const id = 't_users2';
      onSelectTemplate(
        [{ id, name: 'users', columns: ['id', 'name', 'email', 'is_duplicate', 'active'] }],
        {
          activeTableId: id,
          queryType: 'DELETE',
          selectedColumns: [],
          conditions: [{ id: '1', column: 'is_duplicate', operator: '=', value: 'true' }],
          limit: ''
        }
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 flex-shrink-0">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <BookOpen className="w-4 h-4" /> Ready-made Templates
      </h3>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => applyTemplate('all_users')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-lg border border-slate-200 transition-colors">
          Show all users
        </button>
        <button onClick={() => applyTemplate('products_under_price')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-lg border border-slate-200 transition-colors">
          Products &lt; $50
        </button>
        <button onClick={() => applyTemplate('update_email')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-lg border border-slate-200 transition-colors">
          Update email
        </button>
        <button onClick={() => applyTemplate('create_employee')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-lg border border-slate-200 transition-colors">
          Create table
        </button>
        <button onClick={() => applyTemplate('delete_duplicate')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-lg border border-slate-200 transition-colors">
          Delete duplicates
        </button>
      </div>
    </div>
  );
}
