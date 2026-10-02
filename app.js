const projects=[
 {name:"رحلة أبها",meta:"00:15 · 1080p"},
 {name:"إعلان عطر",meta:"00:20 · 1080p"},
 {name:"مقطع رياضي",meta:"00:30 · 4K"}
];

const screens=["home","create","templates","projects","account","editor"];
function show(name){
  screens.forEach(s=>document.getElementById("screen-"+s)?.classList.toggle("active",s===name));
  document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.screen===name));
  document.querySelector(".bottom-nav").style.display=name==="editor"?"none":"flex";
  window.scrollTo({top:0,behavior:"smooth"});
}
function renderProjects(){
 const html=projects.map((p,i)=>`<div class="project-card"><div class="project-thumb">${i===0?"ABHA":i===1?"AD":"SPORT"}</div><b>${p.name}</b><small>${p.meta}</small></div>`).join("");
 document.getElementById("projects").innerHTML=html;
 document.getElementById("all-projects").innerHTML=projects.map((p,i)=>`<button class="project-row" data-action="editor"><div class="mini">${i===0?"ABHA":i===1?"AD":"SPORT"}</div><div><b>${p.name}</b><small>${p.meta}</small></div><span>›</span></button>`).join("");
}
function modalPlans(){
 document.getElementById("modal-content").innerHTML=`<h2>اختر خطتك</h2><p class="muted">خطط بسيطة، وكل خطة تعطيك رصيد AI شهرياً.</p><div class="plans">
 <div class="plan"><div class="plan-head"><b>Starter</b><strong>19 ر.س</strong></div><p>للإنشاء الخفيف · 500 نقطة AI</p></div>
 <div class="plan featured"><div class="plan-head"><b>Creator</b><strong>49 ر.س</strong></div><p>لصناع المحتوى · 2,000 نقطة AI</p></div>
 <div class="plan"><div class="plan-head"><b>Pro</b><strong>99 ر.س</strong></div><p>للعمل الاحترافي · 5,000 نقطة AI</p></div>
 <div class="plan"><div class="plan-head"><b>Studio</b><strong>249 ر.س</strong></div><p>للشركات والاستخدام الكثيف · 15,000 نقطة AI</p></div>
 </div><button class="modal-action">اختيار الخطة</button>`;
 document.getElementById("modal").classList.remove("hidden");
}
function openFeature(type){
 const titles={ "ai-video":"فيديو بالذكاء الاصطناعي","ai-image":"صورة بالذكاء الاصطناعي","text-video":"نص إلى فيديو","camera":"الكاميرا"};
 const title=titles[type]||"إنشاء";
 document.getElementById("modal-content").innerHTML=`<h2>${title}</h2><p class="muted">هذه شاشة تشغيل حقيقية للواجهة التجريبية. محرك التوليد سيتم ربطه لاحقاً بخدمة AI فعلية.</p><textarea id="prompt" placeholder="اكتب ما تريد إنشاءه..." style="width:100%;height:120px;margin-top:18px;border:1px solid #303038;border-radius:14px;background:#101014;color:#fff;padding:14px;resize:none;outline:none"></textarea><button class="modal-action" id="generate">إنشاء</button>`;
 document.getElementById("modal").classList.remove("hidden");
 document.getElementById("generate").onclick=()=>{document.getElementById("generate").textContent="تم تجهيز الطلب ✓";};
}
document.addEventListener("click",e=>{
 const el=e.target.closest("[data-action]");
 if(el){
   const a=el.dataset.action;
   if(a==="home")show("home");
   else if(a==="create")show("create");
   else if(a==="templates")show("templates");
   else if(a==="projects")show("projects");
   else if(a==="account")show("account");
   else if(a==="editor")show("editor");
   else if(a==="plans")modalPlans();
   else if(["ai-video","ai-image","text-video","camera"].includes(a))openFeature(a);
   else if(a==="export"){document.querySelector(".export").textContent="جاري التجهيز…";setTimeout(()=>document.querySelector(".export").textContent="تم التجهيز ✓",700);}
 }
 const nav=e.target.closest(".nav"); if(nav)show(nav.dataset.screen);
 if(e.target.closest(".modal-close"))document.getElementById("modal").classList.add("hidden");
});
renderProjects();