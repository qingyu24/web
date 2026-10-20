'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const localDate=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const monday=d=>{const x=new Date(d);x.setDate(x.getDate()-(x.getDay()+6)%7);return localDate(x);};
let plan=[],mode=60,state={checks:{},review:''},storageOK=true;
function read(key){try{return localStorage.getItem(key);}catch{return null;}}
function write(key,value){try{localStorage.setItem(key,value);storageOK=true;}catch{storageOK=false;}}
function date(){return $('date').value;}
function weekKey(){return 'english-garden-v1-'+monday(new Date(date()+'T12:00:00'));}
function loadDay(){state={checks:{},review:''};try{const old=JSON.parse(read(weekKey())||'null');if(old?.checks&&typeof old.checks==='object')state.checks=old.checks;const notes=JSON.parse(read('english-garden-daily-notes-v3')||'{}');state.review=typeof notes[date()]==='string'?notes[date()]:'';}catch{storageOK=false;}$('review').value=state.review;notice();}
function saveChecks(){let existing={};try{existing=JSON.parse(read(weekKey())||'{}');}catch{}write(weekKey(),JSON.stringify({...existing,checks:state.checks}));notice();}
function notice(){if($('saveState'))$('saveState').textContent=storageOK?'记录仅保存在当前浏览器，不同步到其他设备或Outlook。旧版每周笔记保留在浏览器存储中。':'浏览器存储不可用，请另存记录，刷新后可能丢失。';}
function tasks(d){const long=mode===90;return [['game','01 · 游戏与活动',long?30:20,d.game],['song','02 · 动画与英文熏陶',long?30:20,d.song],['pen','03 · 英文百科探索／阅读',long?15:10,d.pen],['book','04 · 英文主读／童谣共读',long?15:10,d.book]];}
function renderDay(){const idx=(new Date(date()+'T12:00:00').getDay()+6)%7,d=plan[idx];document.querySelectorAll('[data-mode]').forEach(b=>{b.setAttribute('aria-pressed',String(Number(b.dataset.mode)===mode));b.disabled=d.rest;});if(d.rest){$('dayPanel').innerHTML='<section class="rest-day"><div class="rest-symbol" aria-hidden="true">☀</div><span class="tag">周日 · 休息日</span><h2>今天没有任务。</h2><p>不安排英文、阅读、点读或打卡。<br>自由玩、户外、听想听的故事都可以，不补课。</p><a href="week.html">看看下一周的方向 →</a></section>';return;}
const t=tasks(d),count=t.filter(([id])=>state.checks[`${idx}-${id}`]).length;
$('dayPanel').innerHTML=`<div class="day-head"><div><span class="tag">${esc(d.day)} · 英文阅读为主</span><h2>${esc(d.title)}</h2><p>按顺序参考，也可拆开穿插；没有固定钟点。</p></div><div class="total"><strong>${mode}</strong><span>分钟 · 四个环节</span></div></div><p class="progress" role="status">今天已记录 ${count}／4 个环节。累时缩短，不需要集满。</p><div class="task-grid">${t.map(([id,title,mins,body])=>`<label class="task"><input type="checkbox" data-key="${idx}-${id}" ${state.checks[`${idx}-${id}`]?'checked':''}><div><span class="duration">${mins}分钟</span><h3>${esc(title)}</h3><p>${esc(body)}</p></div></label>`).join('')}</div><div class="phrase">大人顺手说，不要求跟读 <b>${esc(d.phrase)}</b></div>`;
}
function renderWeek(){$('weeklyPlan').innerHTML=plan.map((d,i)=>d.rest?`<article class="week-card rest"><div class="week-day">周日<span>REST DAY</span></div><div><h3>休息，不排任务</h3><p class="caption">没有英文最低任务，不打卡、不补课。自由玩和陪伴即可。</p></div></article>`:`<article class="week-card"><div class="week-day">${esc(d.day)}<span>60 / 90 MIN</span></div><div><h3>${esc(d.title)}</h3><dl><dt>游戏20／30分</dt><dd>${esc(d.game)}</dd><dt>动画20／30分</dt><dd>${esc(d.song)}</dd><dt>百科10／15分</dt><dd>${esc(d.pen)}</dd><dt>共读10／15分</dt><dd>${esc(d.book)}</dd></dl><a href="index.html?day=${i}">打开这一天的清单 →</a></div></article>`).join('');}

function renderPrintWeek(){
 const start=new Date($('printWeekDate').value+'T12:00:00');
 if(Number.isNaN(start.getTime()))return;
 const selectedMode=Number($('printMode').value),long=selectedMode===90;
 const totalEnd=new Date(start);totalEnd.setDate(start.getDate()+6);
 const short=s=>String(s).split('。')[0]+'。';
 const labels=[['game','游戏与活动',long?30:20],['song','动画与英文熏陶',long?30:20],['pen','英文百科',long?15:10],['book','英文共读',long?15:10]];
 $('printSheet').innerHTML=`<div class="print-sheet-title"><h1>小小英语花园 · 一周计划</h1><p>${esc(localDate(start))} — ${esc(localDate(totalEnd))}　每日${selectedMode}分钟 · 不固定钟点 · 周日休息</p></div><table class="print-plan-table"><thead><tr><th>日期／主题</th>${labels.map(([,title,minutes])=>`<th>${esc(title)}<br>${minutes}分钟</th>`).join('')}</tr></thead><tbody>${plan.map((d,i)=>{const current=new Date(start);current.setDate(start.getDate()+i);return d.rest?`<tr class="print-rest"><th>${esc(d.day)} · ${current.getMonth()+1}/${current.getDate()}</th><td colspan="4">休息日：自由活动和陪伴，不排任务、不打卡、不补课。</td></tr>`:`<tr><th>${esc(d.day)} · ${current.getMonth()+1}/${current.getDate()}<span>${esc(d.title)}</span></th>${labels.map(([key])=>`<td><span class="paper-check" aria-hidden="true">□</span> ${esc(short(d[key]))}</td>`).join('')}</tr>`;}).join('')}</tbody></table><p class="print-footnote">动画总时长含英文约10分钟；阅读以英文为主。英文百科可读可玩，同一次活动只计一次。累时缩短，周日休息。打印为精简菜单，完整玩法见网页。</p><p class="print-source">完整计划：https://qingyu24.github.io/web/english-garden/week.html</p>`;
}
function setupWeeklyPrint(){
 $('printWeekDate').value=monday(new Date());
 $('printMode').value=read('english-garden-mode-v3')==='90'?'90':'60';
 $('printWeekDate').addEventListener('change',()=>{const candidate=new Date($('printWeekDate').value+'T12:00:00');$('printWeekDate').value=Number.isNaN(candidate.getTime())?monday(new Date()):monday(candidate);renderPrintWeek();});
 $('printMode').addEventListener('change',renderPrintWeek);
 renderPrintWeek();
 $('print').disabled=false;
 $('printStatus').textContent='打印内容已就绪。点击后可选择打印机，或在目标打印机中选择“另存为PDF”。';
 $('print').addEventListener('click',()=>{renderPrintWeek();window.print();});
 window.addEventListener('beforeprint',renderPrintWeek);
}

async function init(){const page=document.body.dataset.page;if(page!=='index'&&page!=='week')return;try{const r=await fetch('plan.json');if(!r.ok)throw Error('load');plan=await r.json();if(plan.length!==7||!plan[6].rest)throw Error('invalid plan');if(page==='week'){renderWeek();setupWeeklyPrint();return;}
mode=read('english-garden-mode-v3')==='90'?90:60;let selected=new Date();const query=new URLSearchParams(location.search).get('day');if(query!==null&&/^[0-6]$/.test(query)){selected=new Date(monday(selected)+'T12:00:00');selected.setDate(selected.getDate()+Number(query));}$('date').value=localDate(selected);
$('date').addEventListener('change',()=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(date()))$('date').value=localDate(new Date());loadDay();renderDay();});$('today').addEventListener('click',()=>{$('date').value=localDate(new Date());loadDay();renderDay();});document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=Number(b.dataset.mode);write('english-garden-mode-v3',String(mode));renderDay();}));$('dayPanel').addEventListener('change',e=>{if(e.target.matches('[data-key]')){state.checks[e.target.dataset.key]=e.target.checked;saveChecks();const count=tasks(plan[(new Date(date()+'T12:00:00').getDay()+6)%7]).filter(([id])=>state.checks[`${(new Date(date()+'T12:00:00').getDay()+6)%7}-${id}`]).length;const p=document.querySelector('.progress');if(p)p.textContent=`今天已记录 ${count}／4 个环节。累时缩短，不需要集满。`;}});
$('review').addEventListener('input',()=>{let notes={};try{notes=JSON.parse(read('english-garden-daily-notes-v3')||'{}');}catch{}notes[date()]=$('review').value;write('english-garden-daily-notes-v3',JSON.stringify(notes));notice();});loadDay();renderDay();}catch(e){const el=$('dayPanel')||$('weeklyPlan');el.textContent='计划暂时无法载入，请刷新重试。周日休息；其他日子可先读几页熟悉的英文书。';}}
init();
