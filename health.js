export default function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(204).end();
  return res.status(200).json({ok:true,service:'rio-ai-studio',version:'0.7.0',runtime:'node24',features:['video','image','image-video','tts','stt','text','vision']});
}
