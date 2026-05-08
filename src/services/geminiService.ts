import { GoogleGenAI, Type } from '@google/genai';
import { TableSchema } from '../types';

let aiInstance: GoogleGenAI | null = null;

function getAi() {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.error('GEMINI_API_KEY is missing from environment. VITE_GEMINI_API_KEY or GEMINI_API_KEY needed.');
      throw new Error('AI features are currently unavailable (missing API key).');
    }
    aiInstance = new GoogleGenAI({ apiKey: key });
  }
  return aiInstance;
}

export async function explainSql(sql: string): Promise<string> {
  try {
    const ai = getAi();
    const prompt = `You are an expert SQL teacher. Break down the following SQL query for a complete beginner. 
Avoid jargon. Explain line by line what the query is doing.

Query:
${sql}

Format the explanation nicely in Markdown. Structure it with bullet points if helpful. Keep it concise, friendly, and easy to understand.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
    });
    return response.text || 'Could not generate explanation.';
  } catch (error: any) {
    console.error('Error generating explanation:', error);
    return 'Error: ' + error.message;
  }
}

export async function textToSql(text: string, schema: TableSchema[]): Promise<string> {
  try {
    const ai = getAi();
    const schemaText = schema.map(t => `Table: ${t.name}\nColumns: ${t.columns.join(', ')}`).join('\n\n');
    
    const prompt = `You are a helpful SQL assistant. A user wants a SQL query based on an English description.
Below is the database schema:

${schemaText || '(No tables defined yet)'}

User's Request: "${text}"

Based on the schema, write the exact SQL query they need. 
Return ONLY the raw SQL query string, without markdown formatting like \`\`\`sql. 
Make sure it is simple.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
    });
    let sql = response.text || '';
    sql = sql.replace(/```sql\n?/ig, '').replace(/```\n?/ig, '').trim();
    return sql;
  } catch (error: any) {
    console.error('Error generating SQL from text:', error);
    throw new Error(error.message);
  }
}
