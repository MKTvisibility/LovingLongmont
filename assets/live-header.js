document.addEventListener('DOMContentLoaded',()=>{
 const root=document.querySelector('.lln-header');if(!root)return;
 const toggle=root.querySelector('.lln-toggle'),nav=root.querySelector('.lln-main');
 toggle.hidden=false;root.classList.add('lln-enhanced');
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('lln-open',open)});
 const groups=[...root.querySelectorAll('.lln-drop')];
 groups.forEach(group=>group.addEventListener('toggle',()=>{if(group.open)groups.filter(other=>other!==group).forEach(other=>other.open=false)}));
 document.addEventListener('click',e=>groups.forEach(group=>{if(group.open&&!group.contains(e.target))group.open=false}));
 root.addEventListener('keydown',e=>{if(e.key==='Escape'){const open=groups.find(group=>group.open);if(open){open.open=false;open.querySelector('summary').focus()}else if(nav.classList.contains('lln-open')){nav.classList.remove('lln-open');toggle.setAttribute('aria-expanded','false');toggle.focus()}}});
 const page=location.pathname.split('/').pop()||'index.html';root.querySelectorAll('a').forEach(link=>{const url=new URL(link.href);if(url.origin===location.origin&&url.pathname.split('/').pop()===page&&!url.hash){link.setAttribute('aria-current','page');const group=link.closest('details');if(group)group.classList.add('lln-current')}});
});
