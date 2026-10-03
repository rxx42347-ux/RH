const $=s=>document.querySelector(s);
const conversation=$("#conversation"),input=$("#input"),chatsKey="rio_chats";
let chats=JSON.parse(localStorage.getItem(chatsKey)||"[]"),current=null;
function save(){localStorage.setItem(chatsKey,JSON.stringify(chats))}
function addMessage(role,text){$("#welcome")?.remove();const r=document.createElement("div");r.className="message-row "+role;const b=document.createElement("div");b.className="bubble";b.textContent=text;r.appendChild(b);conversation.appendChild(r);conversation.scrollTop=conversation.scrollHeight}
function renderChats(){const box=$("#chatList");box.innerHTML="";chats.slice().reverse().forEach(c=>{const x=document.createElement("div");x.className="chat-item";x.textContent=c.title;x.onclick=()=>load(c.id);box.appendChild(x)})}
function load(id){const c=chats.find(x=>x.id===id);if(!c)return;current=id;conversation.innerHTML="";c.messages.forEach(m=>addMessage(m.role,m.text));closeSide()}
function newChat(){current=null;conversation.innerHTML=`<div class="welcome" id="welcome"><div class="logo-mark" dir="ltr"><span class="ar-brand">رِيُو</span><span class="latin-brand">Ai</span></div><h1>كيف يمكنني مساعدتك؟</h1><p>اكتب ما تريد إلى رِيُو.</p><div class="suggestions"><button data-prompt="اشرح لي هذا الموضوع بطريقة بسيطة">اشرح لي موضوعًا</button><button data-prompt="حلل لي صورة عندما أرفعها">حلل صورة</button><button data-prompt="لخص لي ملفًا عندما أرفعه">لخص ملفًا</button><button data-prompt="ساعدني في الكتابة">ساعدني في الكتابة</button></div></div>`;bind();closeSide()}
function send(){const text=input.value.trim();if(!text)return;addMessage("user",text);input.value="";input.style.height="auto";if(!current){current=crypto.randomUUID();chats.push({id:current,title:text.slice(0,35),messages:[]})}const c=chats.find(x=>x.id===current);c.messages.push({role:"user",text});const reply="تم استلام رسالتك. هذه نسخة الواجهة V1.0.0؛ سيتم في الخطوة التالية ربط محرك الذكاء الاصطناعي الحقيقي.";setTimeout(()=>{addMessage("assistant",reply);c.messages.push({role:"assistant",text:reply});save();renderChats()},300);save();renderChats()}
function bind(){document.querySelectorAll("[data-prompt]").forEach(b=>b.onclick=()=>{input.value=b.dataset.prompt;send()})}
function closeSide(){$("#sidebar").classList.remove("open");$("#backdrop").classList.remove("open")}
$("#sendBtn").onclick=send;$("#newChat").onclick=newChat;$("#newChatTop").onclick=newChat;
$("#menuBtn").onclick=()=>{$("#sidebar").classList.add("open");$("#backdrop").classList.add("open")};$("#backdrop").onclick=closeSide;
$("#attachBtn").onclick=()=>$("#attachmentMenu").classList.toggle("open");
$("#voiceBtn").onclick=()=>{const t=document.createElement("div");t.className="toast";t.textContent="الصوت سيكون متاحًا عند ربط المحرك الصوتي.";document.body.appendChild(t);requestAnimationFrame(()=>t.classList.add("show"));setTimeout(()=>{t.classList.remove("show");setTimeout(()=>t.remove(),180)},2200)};
$("#attachmentMenu").onclick=e=>{const b=e.target.closest("[data-tool]");if(!b)return;$("#attachmentMenu").classList.remove("open");if(b.dataset.tool==="voice")return;$("#fileInput").click()};
$("#fileInput").onchange=e=>{if(e.target.files.length)addMessage("user","أرفقت: "+[...e.target.files].map(f=>f.name).join("، "))};
input.oninput=()=>{input.style.height="auto";input.style.height=Math.min(input.scrollHeight,150)+"px"};
input.onkeydown=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}};
bind();renderChats();