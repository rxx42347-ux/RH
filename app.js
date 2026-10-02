const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const defaultProjects=[{id:1,name:"رحلة أبها",meta:"00:15 · 1080p",tag:"ABHA"},{id:2,name:"إعلان عطر",meta:"00:20 · 1080p",tag:"AD"},{id:3,name:"مقطع رياضي",meta:"00:30 · 4K",tag:"SPORT"}];
const templates=[
 {name:"فلوق المدينة",cat:"trend",meta:"15 ثانية · 1080p",cls:"t1",tag:"CITY"},
 {name:"إعلان منتج",cat:"business",meta:"20 ثانية · 1080p",cls:"t2",tag:"PRODUCT"},
 {name:"مغامرة وسفر",cat:"travel",meta:"18 ثانية · 1080p",cls:"t3",tag:"TRAVEL"},
 {name:"مطاعم ومأكولات",cat:"food",meta:"21 ثانية · 1080p",cls:"t4",tag:"FOOD"},
 {name:"مقطع رياضي",cat:"trend",meta:"12 ثانية · 1080p",cls:"t5",tag:"SPORT"},
 {name:"قصة قصيرة",cat:"trend",meta:"30 ثانية · 1080p",cls:"t6",tag:"STORY"}];

let projects=JSON.parse(localStorage.getItem("rioProjects")||"null")||defaultProjects;
let mediaURL=null, mediaType=null, activeFilter="none", ratio="9/16";

function save(){localStorage.setItem("rioProjects",JSON.stringify(projects))}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function showScreen(name){
  $$(".screen").forEach(x=>x.classList.remove("active"));
  if(name==="editor"){$("#editor").classList.add("active");$(".bottom-nav").style.display="none";return}
  $("#"+name)?.classList.add("active");$(".bottom-nav").style.display="flex";
  $$(".nav").forEach(n=>n.classList.toggle("active",n.dataset.screen===name));
  window.scrollTo({top:0,behavior:"smooth"});
}
function renderProjects(){
  $("#recentProjects").innerHTML=projects.slice(0,5).map(p=>`<button class="project-card" data-action="editor"><div class="project-thumb">${p.tag}</div><b>${p.name}</b><small>${p.meta}</small></button>`).join("");
  $("#projectList").innerHTML=projects.map(p=>`<button class="project-row" data-action="editor"><div class="mini">${p.tag}</div><div><b>${p.name}</b><small>${p.meta}</small></div><span>›</span></button>`).join("");
}
function renderTemplates(cat="all"){
  $("#templateGrid").innerHTML=templates.filter(t=>cat==="all"||t.cat===cat).map(t=>`<button class="template" data-template="${t.name}"><div class="thumb ${t.cls}">${t.tag}</div><b>${t.name}</b><small>${t.meta}</small></button>`).join("");
}
function modal(html){$("#modalBody").innerHTML=html;$("#modal").classList.remove("hidden")}
function plans(){
 modal(`<h2>خطط ريو</h2><p style="color:#888;font-size:12px">نظام اشتراك مع رصيد AI شهري. الأسعار في هذه النسخة تجريبية.</p><div class="plans">
 <div class="plan"><div class="plan-head"><b>Starter</b><strong>19 ر.س / شهر</strong></div><p>500 نقطة AI · أدوات أساسية · إزالة العلامة</p></div>
 <div class="plan featured"><div class="plan-head"><b>Creator</b><strong>49 ر.س / شهر</strong></div><p>2,000 نقطة AI · فيديو وصور وصوت · أدوات منشئي المحتوى</p></div>
 <div class="plan"><div class="plan-head"><b>Pro</b><strong>99 ر.س / شهر</strong></div><p>5,000 نقطة AI · أدوات متقدمة · دبلجة ومحتوى احترافي</p></div>
 <div class="plan"><div class="plan-head"><b>Studio</b><strong>249 ر.س / شهر</strong></div><p>15,000 نقطة AI · مشاريع تجارية · أولوية المعالجة</p></div></div>
 <button class="modal-action" onclick="toast('الدفع سيتم ربطه في مرحلة الاشتراكات')">اختيار الخطة</button>`);
}
function aiModal(kind){
 const title=kind==="video"?"فيديو بالذكاء الاصطناعي":"صورة بالذكاء الاصطناعي";
 modal(`<h2>${title}</h2><p style="color:#888;font-size:11px">اكتب فكرتك. في هذه النسخة يتم حفظ الطلب وتجهيز واجهة المحرك، بدون ادعاء توليد AI حقيقي قبل ربط المزود.</p>
 <textarea id="aiPrompt" class="prompt" placeholder="مثال: إعلان فاخر لعطر رجالي، 15 ثانية، أسلوب سينمائي..."></textarea>
 <div class="field"><label>المقاس</label><div class="selects"><button class="select">9:16</button><button class="select">16:9</button><button class="select">1:1</button></div></div>
 <button class="modal-action" id="aiSubmit">تجهيز الطلب</button>`);
 $("#aiSubmit").onclick=()=>{const p=$("#aiPrompt").value.trim();if(!p)return toast("اكتب وصفاً أولاً");projects.unshift({id:Date.now(),name:title,meta:"طلب محفوظ · بانتظار محرك AI",tag:"AI"});save();renderProjects();$("#modal").classList.add("hidden");toast("تم حفظ مشروعك");};
}
function initEditor(){
 showScreen("editor");
 $("#toolPanel").innerHTML=`<div class="panel-title">الوسائط</div><div class="tool-buttons"><button class="tool-choice" id="addMedia">＋ استيراد</button><button class="tool-choice" id="addPhoto">▧ صورة</button></div>`;
}
function importMedia(){ $("#mediaInput").click() }
$("#importBtn").onclick=importMedia;
$("#addMedia")?.addEventListener("click",importMedia);
$("#mediaInput").addEventListener("change",e=>{
 const file=e.target.files[0]; if(!file)return;
 if(mediaURL)URL.revokeObjectURL(mediaURL); mediaURL=URL.createObjectURL(file); mediaType=file.type.startsWith("video")?"video":"image";
 $("#mediaName").textContent=file.name;
 $(".empty-preview").style.display="none";
 $("#video").style.display=mediaType==="video"?"block":"none"; $("#image").style.display=mediaType==="image"?"block":"none"; $("#playBtn").style.display=mediaType==="video"?"block":"none";
 if(mediaType==="video"){ $("#video").src=mediaURL; $("#video").load(); $("#timeline").innerHTML=`<div class="timeline-track"><div class="timeline-clip">المقطع الأصلي</div><div class="timeline-clip">المشهد</div><div class="timeline-clip">الصوت</div></div>`; }
 else { $("#image").src=mediaURL; $("#timeline").innerHTML=`<div class="timeline-track"><div class="timeline-clip">الصورة</div></div>`; }
 toast("تم استيراد الملف");
});
$("#playBtn").onclick=()=>{const v=$("#video");if(v.paused){v.play();$("#playBtn").textContent="❚❚"}else{v.pause();$("#playBtn").textContent="▶"}};
$("#video").addEventListener("timeupdate",()=>{const v=$("#video");if(v.duration){$("#seek").value=v.currentTime/v.duration*100;$("#timeLabel").textContent=`${fmt(v.currentTime)} / ${fmt(v.duration)}`}});
$("#seek").addEventListener("input",()=>{const v=$("#video");if(v.duration)v.currentTime=v.duration*$("#seek").value/100});
function fmt(s){if(!s||!isFinite(s))return"00:00";return String(Math.floor(s/60)).padStart(2,"0")+":"+String(Math.floor(s%60)).padStart(2,"0")}
function panel(type){
 const panels={
 media:`<div class="panel-title">الوسائط</div><div class="tool-buttons"><button class="tool-choice" onclick="importMedia()">＋ استيراد</button><button class="tool-choice">▧ صورة</button><button class="tool-choice">☁ ملفات</button></div>`,
 text:`<div class="panel-title">النص</div><div class="tool-buttons"><button class="tool-choice" onclick="addText('عنوان جديد')">T عنوان</button><button class="tool-choice" onclick="addText('إعلانك هنا')">T إعلان</button><button class="tool-choice" onclick="addText('نص متحرك')">T متحرك</button></div>`,
 filter:`<div class="panel-title">الفلاتر</div><div class="tool-buttons"><button class="tool-choice active" onclick="applyFilter('none',this)">أصلي</button><button class="tool-choice" onclick="applyFilter('warm',this)">دافئ</button><button class="tool-choice" onclick="applyFilter('mono',this)">أبيض وأسود</button><button class="tool-choice" onclick="applyFilter('cinema',this)">سينمائي</button></div>`,
 ratio:`<div class="panel-title">المقاس</div><div class="tool-buttons"><button class="tool-choice active" onclick="setRatio('9/16',this)">9:16<br>تيك توك</button><button class="tool-choice" onclick="setRatio('16/9',this)">16:9<br>يوتيوب</button><button class="tool-choice" onclick="setRatio('1/1',this)">1:1<br>منشور</button></div>`,
 audio:`<div class="panel-title">الصوت</div><div class="tool-buttons"><button class="tool-choice" onclick="toast('اختر ملفاً صوتياً عند توفره')">＋ إضافة صوت</button><button class="tool-choice">♫ موسيقى</button><button class="tool-choice">🎙 تعليق صوتي</button></div>`};
 $("#toolPanel").innerHTML=panels[type];
}
function addText(text){$("#textOverlay").textContent=text;$("#textOverlay").style.display="block";toast("تمت إضافة النص")}
function applyFilter(f,el){activeFilter=f;$$(".tool-choice").forEach(x=>x.classList.remove("active"));el.classList.add("active");const p=f==="warm"?"sepia(.25) saturate(1.25)":f==="mono"?"grayscale(1)":f==="cinema"?"contrast(1.12) saturate(.85)":"none";$("#video").style.filter=p;$("#image").style.filter=p;toast("تم تطبيق الفلتر")}
function setRatio(r,el){ratio=r;$(".preview-wrap").style.aspectRatio=r;$$(".tool-choice").forEach(x=>x.classList.remove("active"));el.classList.add("active");toast("تم تغيير المقاس")}
$("#exportBtn").onclick=()=>toast(mediaURL?"التصدير يحتاج محرك تصدير فعلي في المرحلة التالية":"أضف ملفاً أولاً");
$("#undoBtn").onclick=()=>toast("لا توجد عملية يمكن التراجع عنها بعد");
$$(".tool").forEach(t=>t.onclick=()=>{$$(".tool").forEach(x=>x.classList.remove("active"));t.classList.add("active");panel(t.dataset.tool)});
document.addEventListener("click",e=>{
 const nav=e.target.closest("[data-screen]");if(nav){showScreen(nav.dataset.screen);return}
 const a=e.target.closest("[data-action]");if(!a)return;
 const x=a.dataset.action;
 if(x==="create")showScreen("create");else if(x==="editor")initEditor();else if(x==="templates")showScreen("templates");else if(x==="projects")showScreen("projects");else if(x==="account")showScreen("account");else if(x==="plans")plans();else if(x==="ai-video")aiModal("video");else if(x==="ai-image")aiModal("image");else if(x==="text-video")aiModal("video");else if(x==="template-search")toast("اكتب البحث في النسخة التالية");else if(x==="search")toast("البحث قادم");else if(x==="settings")toast("الإعدادات قادمة");
 const tp=e.target.closest("[data-template]");if(tp){const t=templates.find(x=>x.name===tp.dataset.template);projects.unshift({id:Date.now(),name:t.name,meta:"قالب · "+t.meta,tag:t.tag});save();renderProjects();toast("تمت إضافة القالب إلى مشاريعك")}
});
$$(".chip").forEach(c=>c.onclick=()=>{$$(".chip").forEach(x=>x.classList.remove("active"));c.classList.add("active");renderTemplates(c.dataset.cat)});
$("#closeModal").onclick=()=>$("#modal").classList.add("hidden");
renderProjects();renderTemplates();panel("media");