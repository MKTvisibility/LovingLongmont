document.addEventListener('DOMContentLoaded',()=>{
 const root=document.querySelector('.lln-header');if(!root)return;
 const toggle=root.querySelector('.lln-toggle'),nav=root.querySelector('.lln-main');
 if(!toggle||!nav)return;
 toggle.hidden=false;root.classList.add('lln-enhanced');
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('lln-open',open)});

 // Draft-only eight-category navigation; retain the existing header artwork and utilities.
 const draftLinks=[["Home","index.html"],["Eat & Drink","eat-drink.html"],["Shop Local","shop-local.html"],["Local Services","local-services.html"],["Health & Wellness","health-wellness.html"],["Things to Do","things-to-do.html"],["Events","events.html"],["Community","community.html"]];
 nav.replaceChildren(...draftLinks.map(([label,href])=>{const a=document.createElement('a');a.href=href;a.textContent=label;return a;}));
 const siteMap=document.createElement('a');siteMap.href='sitemap.html';siteMap.textContent='Site Map';siteMap.className='lln-secondary-nav';nav.append(siteMap);
 const social=document.createElement('a');social.href='social-media.html';social.textContent='Social Media';social.className='lln-secondary-nav';nav.append(social);
 const utility=root.querySelector('.lln-utility');
 const brandAction=root.querySelector('.lln-brandrow .lln-cta');
 if(brandAction&&utility)brandAction.replaceWith(utility);
 if(utility&&!utility.querySelector('.lln-visibility-cta')){
   const visibility=document.createElement('a');
   visibility.className='lln-visibility-cta';
   visibility.href='https://mktvisibility.com/visibility-check.html';
   visibility.textContent='Get Your Visibility Check';
   utility.append(visibility);
 }
 nav.querySelectorAll('a[href="pricing.html#contribute"]').forEach(link=>link.remove());
 if(!nav.querySelector('.lln-business-nav-link')){
   const business=document.createElement('a');
   business.className='lln-business-nav-link';
   business.href='request-free-profile.html';
   business.textContent='Claim or Add Your Business';
   nav.append(business);
 }
 toggle.textContent='☰';
 toggle.setAttribute('aria-label','Menu');
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
