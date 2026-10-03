import { fal } from '@fal-ai/client';
function json(res,status,body){res.status(status).json(body)}
export default async function handler(req,res){
  if(req.method!=='GET') return json(res,405,{error:'Method not allowed'});
  if(!process.env.FAL_KEY) return json(res,500,{error:'FAL_KEY غير مضبوط في Vercel.'});
  const requestId=String(req.query?.requestId||''); const model=String(req.query?.model||''); const type=String(req.query?.type||'');
  if(!requestId||!model) return json(res,400,{error:'requestId و model مطلوبان.'});
  fal.config({credentials:process.env.FAL_KEY});
  try{
    const status=await fal.queue.status(model,{requestId,logs:false});
    if(status.status!=='COMPLETED') return json(res,200,{status:status.status});
    const result=await fal.queue.result(model,{requestId});
    const d=result.data||{};
    const out={status:'COMPLETED',type,model};
    if(type==='text-video'||type==='image-video') out.videoUrl=d.video?.url||d.video_url;
    else if(type==='image'||type==='image-edit') out.imageUrl=d.images?.[0]?.url||d.image?.url;
    else if(type==='tts') out.audioUrl=d.audio?.url||d.audio_url;
    else if(type==='stt') out.text=d.text||d.output||'';
    return json(res,200,out);
  }catch(e){console.error(e);return json(res,500,{error:e?.message||'تعذر فحص النتيجة.'})}
}
