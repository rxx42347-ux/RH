import { fal } from '@fal-ai/client';

const MODELS={
  'text-video':'fal-ai/veo3.1',
  'image-video':'fal-ai/veo3.1/image-to-video',
  image:'fal-ai/flux/dev',
  'image-edit':'fal-ai/flux/dev/image-to-image',
  tts:'fal-ai/elevenlabs/tts/eleven-v3',
  stt:'fal-ai/speech-to-text'
};

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  if(!process.env.FAL_KEY) return res.status(500).json({error:'FAL_KEY غير مضبوط في Vercel.'});
  fal.config({credentials:process.env.FAL_KEY});
  const b=req.body&&typeof req.body==='object'?req.body:{};
  const type=String(b.type||''),model=MODELS[type];
  if(!model) return res.status(400).json({error:'نوع عملية غير معروف.'});
  try{
    let input={};
    if(type==='text-video') input={prompt:String(b.prompt||''),aspect_ratio:b.aspectRatio||'9:16',resolution:b.resolution||'720p',duration:b.duration||'8s',generate_audio:b.generateAudio!==false};
    else if(type==='image-video') input={prompt:String(b.prompt||''),image_url:b.imageData,aspect_ratio:b.aspectRatio||'9:16',resolution:b.resolution||'720p',duration:b.duration||'8s',generate_audio:b.generateAudio!==false};
    else if(type==='image') input={prompt:String(b.prompt||''),image_size:b.aspectRatio==='16:9'?'landscape_16_9':b.aspectRatio==='1:1'?'square_hd':'portrait_16_9',num_images:1};
    else if(type==='image-edit') input={prompt:String(b.prompt||''),image_url:b.imageData,num_images:1};
    else if(type==='tts') input={text:String(b.text||''),voice:b.voice||'Rachel',language_code:b.languageCode||'ar',output_format:'mp3_44100_128'};
    else if(type==='stt') input={audio_url:b.audioData};
    if(!input.prompt&&['text-video','image-video','image','image-edit'].includes(type)) return res.status(400).json({error:'الوصف مطلوب.'});
    if((type==='image-video'||type==='image-edit')&&!input.image_url) return res.status(400).json({error:'الصورة مطلوبة.'});
    if(type==='tts'&&!input.text) return res.status(400).json({error:'النص مطلوب.'});
    if(type==='stt'&&!input.audio_url) return res.status(400).json({error:'ملف الصوت مطلوب.'});
    const q=await fal.queue.submit(model,{input});
    return res.status(200).json({requestId:q.request_id,model,type});
  }catch(e){
    console.error(e);
    return res.status(500).json({error:e?.message||'تعذر إرسال الطلب إلى محرك الذكاء الاصطناعي.'});
  }
}