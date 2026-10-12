const filename=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.sb-nav a,.sb-mobile-links a').forEach(a=>{if(a.getAttribute('href')===filename)a.setAttribute('aria-current','page')});
const main=document.querySelector('main');
if(filename!=='index.html'&&filename!=='business.html'){
 const crumb=document.createElement('nav');crumb.className='breadcrumb';crumb.setAttribute('aria-label','Breadcrumb');const a=document.createElement('a');a.href='index.html';a.textContent='Home';crumb.append(a,document.createTextNode(' / '+(document.querySelector('h1')?.textContent||document.title.split('|')[0])));main.prepend(crumb);
 const sections=[...main.querySelectorAll('section')].filter(s=>s.querySelector('h2')&&s.textContent.length>200);
 if(sections.length>3){const toc=document.createElement('nav');toc.className='page-toc';toc.setAttribute('aria-label','On this page');sections.forEach((s,i)=>{s.id=s.id||'section-'+i;const link=document.createElement('a');link.href='#'+s.id;link.textContent=s.querySelector('h2').textContent;toc.append(link)});main.querySelector('h1')?.parentElement.after(toc)}
}
if(filename==='search.html'){
 let index=[];let current=new URLSearchParams(location.search).get('q')||'';
 const root=document.getElementById('site-search-results');
 function renderPages(){root.replaceChildren();const heading=document.createElement('h2');heading.textContent='Activities, events & resources';root.append(heading);if(!current.trim()){const p=document.createElement('p');p.textContent='Enter a search above to find pages across the community guide.';root.append(p);return}
 const terms=current.toLowerCase().trim().split(/\s+/);const matches=index.filter(p=>terms.every(t=>(p.title+' '+p.text).toLowerCase().includes(t)));
 const status=document.createElement('p');status.textContent=matches.length+' matching pages';root.append(status);
 for(const page of matches){const a=document.createElement('a');a.href=page.href;const title=document.createElement('strong');title.textContent=page.title;const copy=document.createElement('small');const pos=page.text.toLowerCase().indexOf(terms[0]);copy.textContent=page.text.slice(Math.max(0,pos-50),Math.max(0,pos-50)+220)+'…';a.append(title,copy);root.append(a)}}
 fetch('assets/search-index.json').then(r=>r.json()).then(data=>{index=data;renderPages()}).catch(()=>{root.textContent='Page search is unavailable. Please use the site map.'});
 document.addEventListener('input',e=>{if(e.target.closest('.ll-directory-tools')&&e.target.type==='search'){current=e.target.value;renderPages()}});
}
