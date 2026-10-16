// One shared fallback style. Existing published photos and official logos stay authoritative.
const normalize=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
const base=new URL('../',import.meta.url);
const title=card=>(card.querySelector('h2,h3,h4')?.textContent||card.querySelector('strong')?.textContent||'').trim();
const isPlaceholder=src=>/(?:-title\.svg|placeholder|image-pending)/i.test(src||'');
const resourceCard='.resource-card,.site-card,.gig-card,.business-card,.ll-connected-card,.ll-staffing-card';
function replaceContent(frame,node){const anchor=frame.querySelector(':scope > a');if(anchor){anchor.replaceChildren(node);frame.replaceChildren(anchor)}else frame.replaceChildren(node)}
function fallback(frame,name){if(!frame||!name)return;frame.classList.add('ll-name-placeholder-frame');frame.dataset.imageKind='name';const label=document.createElement('span');label.className='ll-name-placeholder';label.textContent=name;replaceContent(frame,label)}
export function standardizePlaceholders(root,catalog={}){
 for(const card of root.querySelectorAll('[data-ll-visual-card],.ll-compact-card,'+resourceCard)){
  const name=title(card);if(!name)continue;
  const image=card.querySelector('img'),frame=image?.closest('.ll-visual-image,.ll-card-image,.business-image,.card-image')||card.querySelector('.ll-visual-image,.ll-card-image,.image-placeholder,.image-pending');
  if(!frame||card.querySelector('.ll-card-name-art')&&image)continue;
  const src=image?.getAttribute('src')||'',kind=frame.dataset.imageKind;
  const genericArt=card.matches(resourceCard)&&kind==='art'&&!/watercolor|official/.test(src);
  if(!isPlaceholder(src)&&!genericArt&&image){if(!image.dataset.llNameError){image.dataset.llNameError='true';image.addEventListener('error',()=>fallback(frame,name),{once:true})}continue}
  if(!image&&!frame.matches('.image-placeholder,.image-pending')&&!frame.querySelector('.ll-name-placeholder'))continue;
  const known=catalog.byName?.[normalize(name)];
  if(known?.src&&known.kind!=='art'&&!isPlaceholder(known.src)){
   const url=new URL(known.src,base).href;if(image&&image.src===url)continue;
   const img=document.createElement('img');img.src=url;img.alt=name;img.loading='lazy';frame.classList.remove('ll-name-placeholder-frame');frame.dataset.imageKind=known.kind||'existing';frame.dataset.imageTone=known.tone||'light';replaceContent(frame,img);img.addEventListener('error',()=>fallback(frame,name),{once:true});
  }else if(!frame.classList.contains('ll-name-placeholder-frame'))fallback(frame,name);
 }
}
const stylesheet=document.createElement('link');stylesheet.rel='stylesheet';stylesheet.href=new URL('./placeholders.css?v=20261016',import.meta.url);document.head.append(stylesheet);
const catalog=fetch(new URL('./visual-catalog.json',import.meta.url)).then(r=>r.ok?r.json():{}).catch(()=>({}));
let queued=false;const refresh=()=>{if(queued)return;queued=true;catalog.then(c=>{queued=false;standardizePlaceholders(document,c)})};
new MutationObserver(refresh).observe(document.body,{childList:true,subtree:true});document.addEventListener('ll-businesses-updated',refresh);refresh();
