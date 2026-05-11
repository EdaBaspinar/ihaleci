import { embedText, geminiExtractStructured, geminiReason } from '../packages/agents/src/llm-adapters/gemini';

async function main() {
  console.log('Gemini Testi Başlıyor...\n');

  // 1. Embedding Testi
  console.log('--- 1. Embedding Testi ---');
  const v = await embedText('inşaat firması Aksaray');
  console.log('Embedding boyutu:', v.length); 

  // 2. Yapısal Çıkarım Testi
  console.log('\n--- 2. Yapısal Çıkarım Testi ---');
  const out = await geminiExtractStructured<{ city: string; topic: string }>({
    systemPrompt: 'Sen bir bilgi çıkarma asistanısın.',
    userText: 'Aksaray Üniversitesine yeni bir AI laboratuvarı yapılacak.',
    schemaHint: '{"city": "string", "topic": "string"}',
  });
  console.log('Gemini JSON Çıktısı:', out);

  // 3. Akıl Yürütme Testi
  console.log('\n--- 3. Akıl Yürütme Testi ---');
  const reply = await geminiReason<string>({
    system: 'Kısa ve net cevap ver.',
    user: 'Türkiye\'nin başkenti neresidir?',
  });
  console.log('Gemini Metin Çıktısı:', reply);
}

main().catch(console.error);