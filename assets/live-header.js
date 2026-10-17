document.addEventListener('DOMContentLoaded',()=>{
 const root=document.querySelector('.lln-header');if(!root)return;
 const toggle=root.querySelector('.lln-toggle'),nav=root.querySelector('.lln-main');
 toggle.hidden=false;root.classList.add('lln-enhanced');
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('lln-open',open)});
 // Keep the sponsorship call to action visible in the primary navigation sitewide.
 if(nav&&!nav.querySelector('.lln-sponsor-nav-link')){
   const sponsor=document.createElement('a');
   sponsor.className='lln-sponsor-nav-link';
   sponsor.href='pricing.html#contribute';
   sponsor.textContent='Become a Sponsor';
   sponsor.setAttribute('aria-label','Become a Loving Longmont sponsor');
   nav.appendChild(sponsor);
   if(!document.getElementById('lln-sponsor-nav-style')){
     const style=document.createElement('style');
     style.id='lln-sponsor-nav-style';
     style.textContent='.lln-main .lln-sponsor-nav-link{display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;background:#c9001a!important;color:#fff!important;font-weight:700!important;border-radius:6px;padding:10px 15px;margin:5px 10px;text-decoration:none}.lln-main .lln-sponsor-nav-link:hover,.lln-main .lln-sponsor-nav-link:focus-visible{background:#a90016!important;outline:2px solid #fff;outline-offset:2px}@media(max-width:900px){.lln-main .lln-sponsor-nav-link{margin:8px 0;width:100%;box-sizing:border-box}}';
     document.head.appendChild(style);
   }
 }
 const groups=[...root.querySelectorAll('.lln-drop')];
 groups.forEach(group=>group.addEventListener('toggle',()=>{if(group.open)groups.filter(other=>other!==group).forEach(other=>other.open=false)}));
 document.addEventListener('click',e=>groups.forEach(group=>{if(group.open&&!group.contains(e.target))group.open=false}));
 root.addEventListener('keydown',e=>{if(e.key==='Escape'){const open=groups.find(group=>group.open);if(open){open.open=false;open.querySelector('summary').focus()}else if(nav.classList.contains('lln-open')){nav.classList.remove('lln-open');toggle.setAttribute('aria-expanded','false');toggle.focus()}}});
 const page=location.pathname.split('/').pop()||'index.html';root.querySelectorAll('a').forEach(link=>{const url=new URL(link.href);if(url.origin===location.origin&&url.pathname.split('/').pop()===page&&!url.hash){link.setAttribute('aria-current','page');const group=link.closest('details');if(group)group.classList.add('lln-current')}});
});
// Apply the approved missing-image style on every page using the shared header.
import('./placeholders.mjs?v=20261016').catch(()=>{});

// Shared analytics also covers future business pages generated from the template.
import('./business-analytics.mjs?v=20261017').catch(()=>{});
