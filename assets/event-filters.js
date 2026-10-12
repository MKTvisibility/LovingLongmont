(()=>{
 const search=document.getElementById('event-search'),category=document.getElementById('event-category'),dates=document.getElementById('event-dates'),status=document.getElementById('event-count');
 const cards=[...document.querySelectorAll('.event-card[data-date]')];
 const categories=[...new Set(cards.flatMap(c=>c.dataset.category.split('•').map(s=>s.trim())))].sort();
 categories.forEach(c=>category.append(new Option(c,c)));
 function localDate(){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Denver',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const get=t=>parts.find(p=>p.type===t).value;return `${get('year')}-${get('month')}-${get('day')}`}
 function add(date,n){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)}
 function render(){const today=localDate(),day=new Date(today+'T12:00:00Z').getUTCDay(),fri=add(today,day===0?-2:day===6?-1:(5-day+7)%7),sun=add(fri,2),q=search.value.trim().toLowerCase();let count=0;
 cards.forEach(c=>{const d=c.dataset.date;const dateMatch=dates.value==='all'||d>=today&&(dates.value==='upcoming'||dates.value==='month'&&d.slice(0,7)===today.slice(0,7)||dates.value==='weekend'&&d>=fri&&d<=sun);const match=dateMatch&&(!category.value||c.dataset.category.split('•').map(s=>s.trim()).includes(category.value))&&(!q||c.textContent.toLowerCase().includes(q));c.hidden=!match;if(match)count++});
 document.querySelectorAll('.event-month').forEach(s=>s.hidden=![...s.querySelectorAll('.event-card')].some(c=>!c.hidden));status.textContent=count?`${count} matching events`:'No matching events. Try another category or date range.';
 }
 search.addEventListener('input',render);category.addEventListener('change',render);dates.addEventListener('change',render);render();
})();
