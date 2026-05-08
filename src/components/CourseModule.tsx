import { BookOpen, CheckCircle2, Circle } from 'lucide-react';
import React, { useState } from 'react';

interface Lesson {
  id: string;
  title: string;
  content: string;
  action?: string;
}

const LESSONS: Lesson[] = [
  {
    id: 'intro',
    title: '1. What is SQL?',
    content: 'SQL (Structured Query Language) is the standard language for dealing with Relational Databases. It can be used to insert, search, update, and delete database records. Use the builder on the left to start seeing how queries are formed!'
  },
  {
    id: 'select-basics',
    title: '2. Basics of SELECT',
    content: 'The SELECT statement is used to retrieve data from a database. To get all columns, use `SELECT *`. To get specific columns, list them out separated by commas like `SELECT id, name FROM users`.'
  },
  {
    id: 'filtering-where',
    title: '3. Filtering with WHERE',
    content: 'The WHERE clause extracts only those records that fulfill a specified condition. For example, `SELECT * FROM users WHERE age > 18` limits results to adult users.'
  },
  {
    id: 'sorting-order-by',
    title: '4. Sorting with ORDER BY',
    content: 'The ORDER BY keyword sorts the result set. You can sort in ascending (ASC) or descending (DESC) order. Example: `SELECT * FROM users ORDER BY created_at DESC`.'
  },
  {
    id: 'inserting-data',
    title: '5. Adding Data (INSERT)',
    content: 'Use INSERT INTO to add new rows of data to a table. Example: `INSERT INTO users (name, email) VALUES (\'John\', \'john@example.com\')`.'
  },
  {
    id: 'updating-data',
    title: '6. Modifying Data (UPDATE)',
    content: 'The UPDATE statement changes existing records. Always remember to use a WHERE clause, otherwise you might update EVERY row! Example: `UPDATE users SET status = \'active\' WHERE id = 1`.'
  },
  {
    id: 'deleting-data',
    title: '7. Removing Data (DELETE)',
    content: 'The DELETE statement is used to remove existing records. Like UPDATE, you almost always want a WHERE clause here. Example: `DELETE FROM users WHERE status = \'spam\'`.'
  },
  {
    id: 'create-drop',
    title: '8. CREATE & DROP Tables',
    content: 'CREATE TABLE defines a new table and its columns in your database. DROP TABLE completely destroys a table and all its data. Try these out using the "What do you want to do?" options on the left!'
  }
];

export function CourseModule() {
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('easySql_courseCompleted');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [activeLesson, setActiveLesson] = useState<string>(LESSONS[0].id);

  const toggleComplete = (id: string) => {
    let newCompleted;
    if (completed.includes(id)) {
      newCompleted = completed.filter(l => l !== id);
    } else {
      newCompleted = [...completed, id];
    }
    setCompleted(newCompleted);
    localStorage.setItem('easySql_courseCompleted', JSON.stringify(newCompleted));
  };

  const progress = Math.round((completed.length / LESSONS.length) * 100);

  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 flex flex-col gap-6 border border-slate-200 flex-shrink-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">SQL Crash Course</h2>
            <p className="text-sm text-slate-500">Master queries step-by-step</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 min-w-[150px]">
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        <div className="flex flex-col gap-1.5 md:max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {LESSONS.map(lesson => {
            const isActive = activeLesson === lesson.id;
            const isDone = completed.includes(lesson.id);
            return (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson.id)}
                className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all group ${
                  isActive ? 'bg-blue-50 border-blue-200 border text-blue-800 font-bold shadow-sm' : 'bg-transparent border border-transparent hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    toggleComplete(lesson.id); 
                  }}
                  className="flex-shrink-0"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Circle className={`w-5 h-5 text-slate-300 ${isActive ? 'group-hover:text-blue-400' : 'group-hover:text-slate-400'}`} />
                  )}
                </div>
                <span className="text-sm line-clamp-1">{lesson.title}</span>
              </button>
            )
          })}
        </div>
        <div className="md:col-span-2 bg-slate-50 border border-slate-100 rounded-2xl p-6 md:p-8 flex flex-col justify-between">
          {LESSONS.filter(l => l.id === activeLesson).map(lesson => (
            <div key={lesson.id} className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-bold text-slate-800 mb-4">{lesson.title}</h3>
              <div className="text-slate-600 leading-relaxed text-sm space-y-4">
                {lesson.content.split('\n').map((paragraph, i) => (
                  <p key={i}>
                    {paragraph.split(/(`[^`]+`)/).map((part, j) => {
                      if (part.startsWith('`') && part.endsWith('`')) {
                        return <code key={j} className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
                      }
                      return part;
                    })}
                  </p>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-200/60">
                <button 
                  onClick={() => toggleComplete(lesson.id)}
                  className={`py-2.5 px-5 font-bold text-sm rounded-xl transition-all shadow-sm ${
                    completed.includes(lesson.id) 
                      ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                  }`}
                >
                  {completed.includes(lesson.id) ? 'Mark as Incomplete' : 'Complete Lesson'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
