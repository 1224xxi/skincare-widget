<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>스킨케어 로그</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&display=swap" rel="stylesheet">
<style>
  :root{
    --bg: #FAF7F2;
    --ink: #2A2622;
    --ink-soft: #6B655C;
    --line: #E4DDD3;
    --am-1: #FFE6C7;
    --am-2: #F4986B;
    --am-deep: #C96A3E;
    --pm-1: #3A3B5C;
    --pm-2: #17182A;
    --pm-text: #E8E6F5;
    --pm-soft: #A7A4C4;
    --pink: #E7A6B3;
    --red: #E2867A;
    --gray: #B9B2A6;
    --purple: #B79ADB;
    --card-radius: 14px;
  }
  *{box-sizing:border-box;}
  body{
    margin:0;
    background:var(--bg);
    color:var(--ink);
    font-family:'Pretendard Variable','Pretendard',-apple-system,sans-serif;
    -webkit-font-smoothing:antialiased;
  }
  .wrap{max-width:1100px;margin:0 auto;padding:28px 20px 60px;}
  .top{
    display:flex;
    align-items:baseline;
    justify-content:space-between;
    flex-wrap:wrap;
    gap:12px;
    margin-bottom:6px;
    border-bottom:1px solid var(--line);
    padding-bottom:16px;
  }
  .title{
    font-family:'Fraunces',serif;
    font-weight:600;
    font-size:30px;
    letter-spacing:-0.01em;
  }
  .subtitle{font-size:13px;color:var(--ink-soft);margin-top:4px;}
  .refresh-btn{
    border:1px solid var(--ink);
    background:var(--ink);
    color:var(--bg);
    font-family:inherit;
    font-size:13px;
    font-weight:600;
    padding:9px 16px;
    border-radius:999px;
    cursor:pointer;
    transition:opacity .15s ease, transform .1s ease;
  }
  .refresh-btn:hover{opacity:.85;}
  .refresh-btn:active{transform:scale(.97);}
  .refresh-btn:disabled{opacity:.5;cursor:default;}
  .status{font-size:12px;color:var(--ink-soft);margin:10px 2px 18px;min-height:16px;}
  .status.error{color:var(--red);}

  .weekday-row{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:8px;}
  .weekday{
    text-align:center;font-size:11px;font-weight:600;letter-spacing:.06em;
    color:var(--ink-soft);text-transform:uppercase;
  }
  .week{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:8px;}

  .day{
    border-radius:var(--card-radius);
    overflow:hidden;
    border:1px solid var(--line);
    background:#fff;
    display:flex;
    flex-direction:column;
    min-height:150px;
    cursor:pointer;
    transition:box-shadow .15s ease, transform .1s ease;
  }
  .day:hover{box-shadow:0 4px 16px rgba(0,0,0,.06);}
  .day.today{border-color:var(--am-deep);}
  .day.empty{opacity:.45;}

  .date-num{
    font-family:'Fraunces',serif;
    font-size:13px;
    font-weight:600;
    padding:6px 9px 2px;
    color:var(--ink-soft);
  }
  .day.today .date-num{color:var(--am-deep);}

  .half{padding:6px 9px 8px;flex:1;display:flex;flex-direction:column;gap:4px;min-height:0;}
  .am{background:linear-gradient(180deg,var(--am-1),#fff);}
  .seam{height:4px;background:linear-gradient(90deg,var(--am-2),var(--pm-1));}
  .pm{background:linear-gradient(180deg,var(--pm-1),var(--pm-2));color:var(--pm-text);}

  .half-label{font-size:9px;font-weight:700;letter-spacing:.08em;opacity:.55;text-transform:uppercase;}
  .tags{display:flex;flex-wrap:wrap;gap:3px;}
  .tag{
    font-size:10px;padding:1px 6px;border-radius:999px;font-weight:600;
    background:rgba(0,0,0,.06);
  }
  .tag.pink{background:color-mix(in srgb, var(--pink) 35%, white);color:#8a3d4a;}
  .tag.red{background:color-mix(in srgb, var(--red) 35%, white);color:#8a3226;}
  .tag.gray{background:color-mix(in srgb, var(--gray) 40%, white);color:#5c564a;}
  .pm .tag{background:rgba(255,255,255,.14);color:var(--pm-text);}
  .pm .tag.purple{background:color-mix(in srgb, var(--purple) 45%, transparent);}

  .products{font-size:11px;line-height:1.5;opacity:.9;}
  .memo{font-size:10.5px;line-height:1.4;opacity:.75;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;}

  .empty-hint{font-size:10px;opacity:.4;padding:2px 0;}

  /* modal */
  .modal-backdrop{
    position:fixed;inset:0;background:rgba(20,18,15,.45);
    display:none;align-items:center;justify-content:center;padding:20px;z-index:50;
  }
  .modal-backdrop.open{display:flex;}
  .modal{
    background:#fff;border-radius:18px;max-width:420px;width:100%;
    max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.25);
  }
  .modal-head{
    font-family:'Fraunces',serif;font-size:20px;font-weight:600;
    padding:20px 22px 4px;
  }
  .modal-sub{padding:0 22px 14px;font-size:12px;color:var(--ink-soft);border-bottom:1px solid var(--line);}
  .modal-section{padding:16px 22px;border-bottom:1px solid var(--line);}
  .modal-section:last-child{border-bottom:none;}
  .modal-section.pm{background:linear-gradient(180deg,var(--pm-1),var(--pm-2));color:var(--pm-text);}
  .modal-section-title{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.6;margin-bottom:8px;}
  .modal-row{font-size:13px;margin-bottom:6px;line-height:1.5;}
  .modal-row b{font-weight:600;opacity:.7;font-size:11px;display:block;margin-bottom:2px;}
  .close-x{
    position:sticky;top:0;float:right;margin:14px 14px 0 0;
    background:none;border:none;font-size:18px;cursor:pointer;color:var(--ink-soft);
  }

  @media (max-width:640px){
    .wrap{padding:18px 10px 40px;}
    .title{font-size:24px;}
    .week, .weekday-row{gap:5px;}
    .day{min-height:120px;}
    .products, .memo{font-size:9.5px;}
  }
  @media (prefers-reduced-motion: reduce){
    *{transition:none !important;}
  }
</style>
</head>
<body>
<div class="wrap">
  <div class="top">
    <div>
      <div class="title">스킨케어 로그</div>
      <div class="subtitle" id="rangeLabel">지난주 · 이번주 · 다음주</div>
    </div>
    <button class="refresh-btn" id="refreshBtn">새로고침</button>
  </div>
  <div class="status" id="status"></div>
  <div class="weekday-row" id="weekdayRow"></div>
  <div id="calendar"></div>
</div>

<div class="modal-backdrop" id="modalBackdrop">
  <div class="modal" id="modal"></div>
</div>

<script>
const DS_LOG = "3420494c-783c-80dd-bc26-000b685444d4";
const DS_PRODUCTS = "3420494c-783c-8057-8152-000b8ace496d";
const WEEKDAYS = ["일","월","화","수","목","금","토"];

function pad(n){ return String(n).padStart(2,"0"); }
function toISODate(d){ return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); }

function getMondayOfWeek(d){
  const day = d.getDay(); // 0 Sun .. 6 Sat
  const diff = (day===0? -6 : 1) - day; // shift to Monday
  const monday = new Date(d);
  monday.setDate(d.getDate()+diff);
  monday.setHours(0,0,0,0);
  return monday;
}

function buildRange(){
  const today = new Date();
  const thisMonday = getMondayOfWeek(today);
  const start = new Date(thisMonday); start.setDate(thisMonday.getDate()-7); // last week Monday
  const end = new Date(thisMonday); end.setDate(thisMonday.getDate()+13); // next week Sunday
  const days = [];
  for(let i=0;i<21;i++){
    const d = new Date(start); d.setDate(start.getDate()+i);
    days.push(d);
  }
  return {start, end, days, today};
}

let STATE = { data: {}, days: [] };

function setStatus(msg, isError){
  const el = document.getElementById('status');
  el.textContent = msg || '';
  el.className = 'status' + (isError ? ' error' : '');
}

function renderWeekdayRow(){
  const row = document.getElementById('weekdayRow');
  row.innerHTML = WEEKDAYS.slice(1).concat(WEEKDAYS[0]).map(w=>`<div class="weekday">${w}</div>`).join('');
}

function tagClass(name){
  if(name.includes('코') || name.includes('모공')) return 'pink';
  if(name.includes('볼') || name.includes('흔적')) return 'red';
  if(name.includes('이마')) return 'gray';
  if(['레티놀','비타민C','AHA/BHA','기타 액티브'].includes(name)) return 'purple';
  return '';
}

function renderTags(list){
  if(!list || !list.length) return '';
  return `<div class="tags">${list.map(t=>`<span class="tag ${tagClass(t)}">${t}</span>`).join('')}</div>`;
}

function dayCellHTML(d, entry){
  const iso = toISODate(d);
  const isToday = iso === toISODate(STATE.days.today);
  const hasData = !!entry;
  const morning = entry?.morning || {};
  const night = entry?.night || {};
  const amProducts = (morning.products||[]).slice(0,2).join(', ');
  const pmProducts = (night.products||[]).slice(0,2).join(', ');

  return `
  <div class="day ${isToday?'today':''} ${hasData?'':'empty'}" data-date="${iso}">
    <div class="date-num">${d.getDate()}</div>
    <div class="half am">
      <div class="half-label">AM</div>
      ${renderTags(morning.skin)}
      ${amProducts ? `<div class="products">${amProducts}</div>` : (hasData?'':'<div class="empty-hint">—</div>')}
    </div>
    <div class="seam"></div>
    <div class="half pm">
      <div class="half-label">PM</div>
      ${renderTags((night.skin||[]).concat(night.actives||[]).concat(night.care||[]))}
      ${pmProducts ? `<div class="products">${pmProducts}</div>` : (hasData?'':'<div class="empty-hint">—</div>')}
    </div>
  </div>`;
}

function renderCalendar(){
  const cal = document.getElementById('calendar');
  const days = STATE.days.days;
  let html = '';
  for(let w=0; w<3; w++){
    const weekDays = days.slice(w*7, w*7+7);
    html += `<div class="week">${weekDays.map(d=>dayCellHTML(d, STATE.data[toISODate(d)])).join('')}</div>`;
  }
  cal.innerHTML = html;

  document.getElementById('rangeLabel').textContent =
    `${toISODate(days[0])} ~ ${toISODate(days[20])}`;

  cal.querySelectorAll('.day').forEach(el=>{
    el.addEventListener('click', ()=>{
      const iso = el.getAttribute('data-date');
      openModal(iso, STATE.data[iso]);
    });
  });
}

function openModal(iso, entry){
  const modal = document.getElementById('modal');
  const morning = entry?.morning || {};
  const night = entry?.night || {};
  modal.innerHTML = `
    <button class="close-x" id="closeX">✕</button>
    <div class="modal-head">${iso}</div>
    <div class="modal-sub">${entry ? '기록 있음' : '기록 없음'}</div>
    <div class="modal-section">
      <div class="modal-section-title">아침</div>
      <div class="modal-row"><b>피부 상태</b>${(morning.skin||[]).join(', ') || '—'}</div>
      <div class="modal-row"><b>사용 제품</b>${(morning.products||[]).join(', ') || '—'}</div>
      <div class="modal-row"><b>메모</b>${morning.memo || '—'}</div>
    </div>
    <div class="modal-section pm">
      <div class="modal-section-title">저녁</div>
      <div class="modal-row"><b>피부 상태</b>${(night.skin||[]).join(', ') || '—'}</div>
      <div class="modal-row"><b>사용 제품</b>${(night.products||[]).join(', ') || '—'}</div>
      <div class="modal-row"><b>액티브 / 관리</b>${(night.actives||[]).concat(night.care||[]).join(', ') || '—'}</div>
      <div class="modal-row"><b>메모</b>${night.memo || '—'}</div>
    </div>
  `;
  document.getElementById('modalBackdrop').classList.add('open');
  document.getElementById('closeX').addEventListener('click', closeModal);
}
function closeModal(){ document.getElementById('modalBackdrop').classList.remove('open'); }
document.getElementById('modalBackdrop').addEventListener('click', (e)=>{
  if(e.target.id==='modalBackdrop') closeModal();
});

async function fetchData(){
  const btn = document.getElementById('refreshBtn');
  btn.disabled = true;
  setStatus('노션에서 불러오는 중…');
  try{
    const r = await fetch('https://skincare-widget-chi.vercel.app/api/skincare');
    const json = await r.json();
    if(!r.ok) throw new Error(json.error || ('HTTP ' + r.status));
    const map = {};
    (json.data||[]).forEach(e => { if(e && e.date) map[e.date] = e; });
    STATE.data = map;
    renderCalendar();
    setStatus(`불러옴 · ${new Date().toLocaleTimeString('ko-KR')} 기준`);
  }catch(err){
    console.error(err);
    setStatus('불러오기 실패: ' + (err.message||''), true);
  }finally{
    btn.disabled = false;
  }
}

function init(){
  STATE.days = buildRange();
  renderWeekdayRow();
  renderCalendar();
  document.getElementById('refreshBtn').addEventListener('click', fetchData);
  fetchData();
}
init();
</script>
</body>
</html>
