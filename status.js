import { fal } from '@fal-ai/client';
function cors(res){res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Methods','GET,OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');}
export default async function handler(req,res){
  cors(res); if(req.method==='OPTIONS') return res.status(204).end();
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  if(!process.env.FAL_KEY) return res.status(500).json({error:'FAL_KEY غير مضبوط في Vercel.'});
  const requestId=String(req.query?.requestId||''),model=String(req.query?.model||''),type=String(req.query?.type||'');
  if(!requestId||!model) return res.status(400).json({error:'requestId و model مطلوبان.'});
  fal.config({credentials:process.env.FAL_KEY});
  try{
    const s=await fal.queue.status(model,{requestId,logs:false});
    if(s.status!=='COMPLETED') return res.status(200).json({status:s.status});
    const result=await fal.queue.result(model,{requestId}); const d=result.data||{}; const out={status:'COMPLETED',type,model};
    if(type==='text-video'||type==='image-video') out.videoUrl=d.video?.url||d.video_url;
    else if(type==='image'||type==='image-edit') out.imageUrl=d.images?.[0]?.url||d.image?.url;
    else if(type==='tts') out.audioUrl=d.audio?.url||d.audio_url;
    else if(type==='stt') out.text=d.text||d.output||'';
    return res.status(200).json(out);
  }catch(e){console.error(e);return res.status(500).json({error:e?.message||'تعذر فحص النتيجة.'});}
}
