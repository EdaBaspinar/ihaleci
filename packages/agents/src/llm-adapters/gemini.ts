import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

// 1. Embedding Fonksiyonu (OpenAI Yerine)
export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

  const results: number[][] = [];
  for (const text of texts) {
    const result = await model.embedContent(text);
    results.push(result.embedding.values);
  }
  return results;
}

export async function embedText(text: string): Promise<number[]> {
  const [v] = await embedTexts([text]);
  return v;
}

// 2. Yapısal Veri Çıkarma (PDF Analizi İçin)
export async function geminiExtractStructured<T>(opts: {
  systemPrompt: string;
  userText: string;
  schemaHint: string;
  modelName?: string;
}): Promise<T> {
  const model = genAI.getGenerativeModel({
    model: opts.modelName ?? 'gemini-2.5-flash',
    systemInstruction: opts.systemPrompt,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1,
    },
  });

  const prompt = `${opts.userText}\n\nLütfen aşağıdaki JSON şemasına uygun cevap ver:\n${opts.schemaHint}`;
  const res = await model.generateContent(prompt);
  const text = res.response.text();
  return JSON.parse(text) as T;
}

// 3. Akıl Yürütme ve Rerank (Claude Yerine)
export async function geminiReason<T>(opts: {
  system: string;
  user: string;
  modelName?: string;
  expectJson?: boolean;
}): Promise<T extends string ? string : T> {
  const model = genAI.getGenerativeModel({
    model: opts.modelName ?? 'gemini-2.5-flash',
    systemInstruction: opts.system,
    generationConfig: {
      responseMimeType: opts.expectJson ? 'application/json' : 'text/plain',
      temperature: 0.1,
    },
  });

  const res = await model.generateContent(opts.user);
  const text = res.response.text();

  if (opts.expectJson) {
    return JSON.parse(text) as any;
  }
  return text as any;
}