import { fal } from '@fal-ai/client';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.FAL_KEY) return res.status(500).json({ error: 'FAL_KEY غير مضبوط في Vercel.' });
  fal.config({ credentials: process.env.FAL_KEY });

  const requestId = String(req.query?.requestId || '');
  const model = String(req.query?.model || '');
  const type = String(req.query?.type || '');
  if (!requestId || !model) return res.status(400).json({ error: 'requestId و model مطلوبان.' });

  try {
    const status = await fal.queue.status(model, { requestId, logs: false });
    if (status.status !== 'COMPLETED' && !['FAILED','ERROR','CANCELLED'].includes(status.status)) {
      return res.status(200).json({ status: status.status });
    }
    if (['FAILED','ERROR','CANCELLED'].includes(status.status)) {
      return res.status(200).json({ status: status.status, error: status.error || 'فشل الطلب.' });
    }

    const result = await fal.queue.result(model, { requestId });
    const d = result.data || {};
    const out = { status: 'COMPLETED', type, model, usage: d.usage || null };

    if (type === 'text-video' || type === 'image-video') out.videoUrl = d.video?.url || d.video_url || null;
    else if (type === 'image') out.imageUrl = d.images?.[0]?.url || d.image?.url || null;
    else if (type === 'tts') out.audioUrl = d.audio?.url || d.audio_url || null;
    else if (type === 'stt') out.text = d.text || d.output || '';
    else if (type === 'text' || type === 'vision') out.text = d.output || d.text || '';

    return res.status(200).json(out);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e?.message || 'تعذر فحص النتيجة.' });
  }
}
