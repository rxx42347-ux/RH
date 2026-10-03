import { fal } from '@fal-ai/client';

const MODELS = {
  'text-video': 'fal-ai/veo3.1',
  'image-video': 'fal-ai/veo3.1/image-to-video',
  image: 'fal-ai/flux/dev',
  tts: 'fal-ai/elevenlabs/tts/eleven-v3',
  stt: 'fal-ai/elevenlabs/speech-to-text',
  text: 'openrouter/router',
  vision: 'openrouter/router/vision'
};

const json = (res, status, data) => res.status(status).json(data);
function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
function bodyOf(req) {
  if (!req.body) return {};
  if (typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body); } catch { return {}; }
}
function requireKey() {
  if (!process.env.FAL_KEY) throw new Error('FAL_KEY غير مضبوط في Vercel.');
  fal.config({ credentials: process.env.FAL_KEY });
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  try {
    requireKey();
    const b = bodyOf(req);
    const type = String(b.type || '');
    if (!MODELS[type]) return json(res, 400, { error: 'نوع العملية غير معروف.' });

    let model = MODELS[type];
    let input = {};

    if (type === 'text-video') {
      if (!b.prompt) return json(res, 400, { error: 'اكتب وصف الفيديو أولاً.' });
      input = {
        prompt: String(b.prompt),
        aspect_ratio: b.aspectRatio || '9:16',
        resolution: b.resolution || '720p',
        duration: b.duration || '8s',
        generate_audio: b.generateAudio !== false
      };
    }

    if (type === 'image-video') {
      if (!b.prompt || !b.imageData) return json(res, 400, { error: 'الوصف والصورة مطلوبان.' });
      input = {
        prompt: String(b.prompt),
        image_url: b.imageData,
        aspect_ratio: b.aspectRatio || '9:16',
        resolution: b.resolution || '720p',
        duration: b.duration || '8s',
        generate_audio: b.generateAudio !== false
      };
    }

    if (type === 'image') {
      if (!b.prompt) return json(res, 400, { error: 'اكتب وصف الصورة أولاً.' });
      input = {
        prompt: String(b.prompt),
        image_size: b.aspectRatio === '16:9' ? 'landscape_16_9' : b.aspectRatio === '1:1' ? 'square_hd' : 'portrait_16_9',
        num_images: 1
      };
    }

    if (type === 'tts') {
      if (!b.text) return json(res, 400, { error: 'اكتب النص أولاً.' });
      input = {
        text: String(b.text),
        voice: b.voice || 'Rachel',
        language_code: b.languageCode || 'ar',
        timestamps: true
      };
    }

    if (type === 'stt') {
      if (!b.audioData) return json(res, 400, { error: 'ملف الصوت مطلوب.' });
      input = { audio_url: b.audioData, language_code: b.languageCode || undefined, diarize: true, tag_audio_events: true };
    }

    if (type === 'text') {
      if (!b.prompt) return json(res, 400, { error: 'النص المطلوب غير موجود.' });
      input = {
        prompt: String(b.prompt),
        system_prompt: String(b.systemPrompt || 'أنت مساعد إبداعي داخل Rio AI Studio. اكتب إجابة عملية وواضحة بالعربية ما لم يطلب المستخدم لغة أخرى.'),
        model: String(b.model || process.env.RIO_LLM_MODEL || 'google/gemini-2.5-flash'),
        temperature: Number.isFinite(Number(b.temperature)) ? Number(b.temperature) : 0.7,
        max_tokens: Number(b.maxTokens || 1800)
      };
    }

    if (type === 'vision') {
      if (!b.prompt || !b.imageData) return json(res, 400, { error: 'الصورة والوصف مطلوبان.' });
      input = {
        prompt: String(b.prompt),
        image_urls: [b.imageData],
        model: String(b.model || process.env.RIO_VISION_MODEL || 'google/gemini-2.5-flash'),
        temperature: 0.4,
        max_tokens: Number(b.maxTokens || 2200)
      };
    }

    const q = await fal.queue.submit(model, { input });
    return json(res, 200, { requestId: q.request_id, model, type });
  } catch (e) {
    console.error(e);
    return json(res, 500, { error: e?.message || 'تعذر إرسال الطلب إلى محرك الذكاء الاصطناعي.' });
  }
}
