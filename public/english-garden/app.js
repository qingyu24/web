'use strict';
const daysEl=document.getElementById('days'), panel=document.getElementById('dayPanel'), dateInput=document.getElementById('weekDate'), review=document.getElementById('review');
let data=[], selected=(new Date().getDay()+6)%7, state={checks:{},review:''}, storageOK=true;
function localDate(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function monday(d){const x=new Date(d);x.setDate(x.getDate()-(x.getDay()+6)%7);return localDate(x);}
function key(){return 'english-garden-v1-'+dateInput.value;}
function esc(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function notice(){document.getElementById('saveState').textContent=storageOK?'已保存在当前浏览器；不跨设备同步，也不会写回GitHub。':'浏览器存储不可用，本次勾选和周记刷新后可能丢失，请另存。';}
function save(){try{localStorage.setItem(key(),JSON.stringify(state));storageOK=true;}catch(e){storageOK=false;}notice();progress();}
function load(){state={checks:{},review:''};try{const value=JSON.parse(localStorage.getItem(key())||'null');if(value&&value.checks&&typeof value.checks==='object'&&typeof value.review==='string')state=value;}catch(e){storageOK=false;}review.value=state.review;notice();}
function progress(){const count=Object.values(state.checks).filter(x=>x===true).length;document.getElementById('progress').textContent=`本周已记录 ${count} 个小环节。记录帮助回顾，不需要集满；疲惫日只做一首歌也可以。`;}
function render(){daysEl.innerHTML=data.map((d,i)=>`<button id="tab-${i}" role="tab" aria-selected="${i===selected}" aria-controls="dayPanel" tabindex="${i===selected?0:-1}" data-day="${i}">${d.day}</button>`).join('');const d=data[selected];panel.setAttribute('aria-labelledby',`tab-${selected}`);const tasks=[['song','听／看一点 · 5—10分钟',d.song],['game','一起玩 · 3—5分钟',d.game],['book','翻几页 · 约5分钟',d.book]];panel.innerHTML=`<article class="day-content"><div class="day-header"><div><p class="eyebrow">${esc(d.day)} · 今日菜单</p><h3>${esc(d.title)}</h3></div><span class="badge">开心就重复，累了就缩短</span></div><div class="tasks">${tasks.map(([id,title,body])=>`<label class="task"><input type="checkbox" data-check="${selected}-${id}" ${state.checks[`${selected}-${id}`]?'checked':''}><div><b>${esc(title)}</b><span>${esc(body)}</span></div></label>`).join('')}</div><div class="phrase">大人顺手说，不要求宝宝跟读<b>${esc(d.phrase)}</b></div></article>`;progress();}
daysEl.addEventListener('click',e=>{const b=e.target.closest('[data-day]');if(b){selected=Number(b.dataset.day);render();document.getElementById(`tab-${selected}`).focus();}});
daysEl.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();selected=e.key==='Home'?0:e.key==='End'?6:(selected+(e.key==='ArrowRight'?1:6))%7;render();document.getElementById(`tab-${selected}`).focus();});
panel.addEventListener('change',e=>{if(e.target.matches('[data-check]')){state.checks[e.target.dataset.check]=e.target.checked;save();}});
review.addEventListener('input',()=>{state.review=review.value;save();});
dateInput.value=monday(new Date());dateInput.addEventListener('change',()=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(dateInput.value))dateInput.value=monday(new Date());else dateInput.value=monday(new Date(dateInput.value+'T12:00:00'));load();render();});
document.getElementById('today').addEventListener('click',()=>{dateInput.value=monday(new Date());selected=(new Date().getDay()+6)%7;load();render();});
document.getElementById('print').addEventListener('click',()=>window.print());
fetch('plan.json').then(r=>{if(!r.ok)throw Error('load');return r.json();}).then(d=>{data=d;load();render();document.getElementById('printWeek').innerHTML=`<p>周一日期：${esc(dateInput.value)}。每天英文接触；全部视频合计20—30分钟，不必用满。游戏与共读累时二选一。</p>`+data.map(x=>`<article class="print-day"><h3>${esc(x.day)} · ${esc(x.title)}</h3><p>儿歌：${esc(x.song)}</p><p>游戏：${esc(x.game)}</p><p>表达：${esc(x.phrase)}</p><p>绘本：${esc(x.book)}</p></article>`).join('');}).catch(()=>{panel.textContent='周计划暂时无法载入，请刷新重试。可先唱一首熟悉的歌，配两个动作。';});
window.addEventListener('beforeprint',()=>{const p=document.querySelector('#printWeek>p');if(p)p.textContent=`周一日期：${dateInput.value}。每天英文接触；全部视频合计20—30分钟，不必用满。游戏与共读累时二选一。`;});
