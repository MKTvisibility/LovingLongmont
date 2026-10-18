import './live/business-events-loader.mjs?v=20261018-visits';
const gridClasses=['ll-connected-grid','quick-grid','resource-grid','category-grid','business-grid','project-grid','photo-grid','involved-grid','site-grid','gig-grid','option-grid','help-grid','event-grid','directory-grid','future-grid','idea-grid','community-life-grid','share-grid','support-grid','tip-grid','emergency-grid','grid'];
const iconSelector='.image-pending,.image-placeholder,.business-icon,.tip-icon,.idea-icon,.project-icon,.involved-icon,.image-pending-icon,.resource-icon,.card-icon,.quick-icon,.site-icon,.gig-icon,.category-icon,.future-icon,.page-icon,.icon,.support-icon,.life-icon,.share-icon,.help-icon,.option-icon,.event-icon,.emergency-icon,.ll-category-icon';
export const normalizeName=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
export function cardTitle(card){return (card.querySelector('h2,h3,h4')?.textContent||card.querySelector('strong')?.textContent||card.textContent.trim().split('\n').filter(s=>s.trim()).slice(0,2).join(' ')).trim()}
export function artFamily(title,text=''){
 const name=String(title).toLowerCase(),all=(name+' '+text).toLowerCase();
 if(/discover longmont|free things|free in longmont|parks.*trail|family fun|kids.*famil/.test(name))return 'outside';
 if(/visit animals/.test(name))return 'farm';
 if(/photo|portrait|camera|image editing/.test(name))return 'photography';
 if(/wildlife|reptile|raptor/.test(all))return 'wildlife';
 if(/farm|orchard|horse|market.*food|local food|growing/.test(name))return 'farm';
 if(/animal|pet|veterinar|dog|cat |kennel|paws|groom|boarding/.test(all))return 'pets';
 if(/church|temple|buddhist|faith|presbyterian|baptist/.test(all))return 'faith';
 if(/food bank|food rescue|food assistance|basic needs|meal.*wheel|pantry|our center|recovery|senior|volunteer|community help|shelter|housing|transportation|community resources/.test(all))return 'community';
 if(/yoga|fitness|wellness|exercise|sport|swim|climb|dance|health/.test(all))return 'wellness';
 if(/book|librar|learn|education|training|school|resume|résumé|workshop|tutor|skill|reading/.test(name))return 'learning';
 if(/temporary|staffing|trade|construction|repair|contractor|home services|handyman/.test(all))return 'trades';
 if(/remote|job|career|employment|freelance|indeed|linkedin|ziprecruiter|glassdoor|computer|digital/.test(all))return 'remote';
 if(/food|drink|restaurant|coffee|bakery|brew|dining|ice cream|cafe|café/.test(all))return 'eat';
 if(/park|trail|outdoor|lake|nature|free|recreation|family fun|kids|playground/.test(all))return 'outside';
 if(/history|historic|heritage|landmark/.test(all))return 'history';
 if(/event|festival|calendar|holiday|santa|celebrat|fiesta|open house|turkey trot/.test(all))return 'events';
 if(/art|craft|pottery|studio|culture|music|theat|museum|record|paint|creative/.test(all))return 'arts';
 if(/community|neighbor|support|contact|share|people|local life|seniors/.test(name))return 'community';
 return 'shop';
}
function safeImage(src){try{const url=new URL(src,'https://lovinglongmont.github.io/loving-longmont-website/');return ['https:','http:'].includes(url.protocol)&&!url.username&&!url.password}catch{return false}}
function resolveAsset(src){return /^https?:/.test(src)||src.startsWith('../')?src:new URL('../'+src,import.meta.url).href}
export function selectImage(card,catalog){
 const title=cardTitle(card),id=card.dataset.llLiveBusiness||card.dataset.llVisualBusiness;
 const known=catalog.byName?.[normalizeName(title)]||catalog.byId?.[id];
 const existing=card.querySelector('img');if(existing&&!existing.dataset.llOriginalSrc)existing.dataset.llOriginalSrc=existing.getAttribute('src')||'';
 if(existing)return {src:existing.getAttribute('src'),kind:known?.kind||(/logo/i.test(existing.alt+' '+existing.getAttribute('src'))?'logo':'existing'),tone:known?.tone||'light',existing};
 // Connected records deliberately omit unchecked image fields from public snapshots.
 if(card.dataset.llLiveBusiness)return null;
 if(known?.src&&safeImage(known.src))return known;
 return {src:catalog.art[artFamily(title,card.textContent)],kind:'art',tone:'light'};
}
function cleanIcons(card){for(const element of card.querySelectorAll('div,span,i'))if(!element.children.length&&element.textContent.trim()&&/^[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Regional_Indicator}\u200d\ufe0f\s]+$/u.test(element.textContent.trim()))element.remove();for(const icon of card.querySelectorAll(iconSelector))if(!icon.querySelector('img'))icon.remove();for(const h of card.querySelectorAll('h2,h3,h4,strong'))for(const child of h.childNodes)if(child.nodeType===3)child.textContent=child.textContent.replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Regional_Indicator}\u200d\ufe0f]/gu,'').trim()}
export function enhanceVisualCards(root,catalog){
 const document=root.ownerDocument||root;let count=0;
 for(const grid of root.querySelectorAll(gridClasses.map(c=>'.'+c).join(',')+',#results')){
  if(grid.hasAttribute('data-ll-preserve-layout') || (grid.classList.contains('business-grid') && grid.closest('.business-section')))continue;
  const cards=[...grid.children];if(cards.length<1)continue;
  grid.dataset.llVisualGrid='';
  for(const card of cards){if(card.classList.contains('ll-compact-card'))continue;if(card.matches('h1,h2,h3,h4,h5,h6')||card.classList.contains('directory-type-heading')||card.classList.contains('empty'))continue;if(card.dataset.llVisualCard!==undefined)continue;if(!cardTitle(card)||card.querySelector('[role="status"]'))continue;
   const chosen=selectImage(card,catalog);cleanIcons(card);card.dataset.llVisualCard='';
   if(chosen?.src&&safeImage(chosen.src)){
    const image=chosen.existing||document.createElement('img');const old=image.parentElement;
    const oldContainer=image.closest('.business-image,.business-photo,.business-icon,.card-image,.card-photo,.resource-icon,.real-photo-image,.ll-staffing-image,.ll-connected-image');
    const oldLink=image.closest('a');const primary=card.matches('a[href]')?null:(card.querySelector('h2 a,h3 a,h4 a')||card.querySelector('a[href]:not([href^="tel:"]):not([href^="mailto:"])'));
    const wrapper=document.createElement('div');wrapper.className='ll-visual-image';wrapper.dataset.imageKind=chosen.kind||'existing';wrapper.dataset.imageTone=chosen.tone||'light';
    if(!chosen.existing){image.src=resolveAsset(chosen.src);image.alt=(chosen.kind==='art'?'Illustration for ':'')+cardTitle(card);image.loading='lazy';image.decoding='async';}
    if(!card.matches('a')&&(oldLink||primary)){const anchor=document.createElement('a');for(const a of (oldLink||primary).attributes)anchor.setAttribute(a.name,a.value);anchor.setAttribute('aria-label',cardTitle(card));anchor.append(image);wrapper.append(anchor)}else wrapper.append(image);
    const fallback=()=>{if(image.dataset.llFallbackUsed)return;const src=resolveAsset(catalog.art[artFamily(cardTitle(card),card.textContent)]);if(image.src===src)return;image.dataset.llFallbackUsed='true';image.hidden=false;image.src=src;image.alt='Illustration for '+cardTitle(card);wrapper.dataset.imageKind='art';wrapper.dataset.imageTone='light'};
    image.addEventListener('error',fallback,{once:true});
    card.prepend(wrapper);
    if(image.complete&&image.naturalWidth===0)fallback();
    // Moving a linked image leaves its original anchor and container empty.
    if(oldLink&&oldLink!==card&&!oldLink.textContent.trim()&&!oldLink.children.length)oldLink.remove();
    if(oldContainer&&oldContainer!==card&&!oldContainer.textContent.trim()&&!oldContainer.querySelector('img'))oldContainer.remove();
    if(old&&old!==card&&!old.textContent.trim()&&!old.querySelector('img')&&old.matches('.business-image,.business-photo,.business-icon,.card-image,.card-photo,.resource-icon,.real-photo-image,.ll-staffing-image,.ll-connected-image'))old.remove();
   }
   count++;
  }
 }
 for(const icon of root.querySelectorAll('.ll-category-icon'))icon.remove();
 const profile=document.getElementById('business-profile'),primary=profile?.querySelector('.bp-logo'),primaryImage=primary?.querySelector('img'),info=catalog.byId?.[profile?.dataset.llProfile];
 if(primary&&primaryImage&&info?.kind==='logo'&&resolveAsset(info.src)===primaryImage.src)primary.dataset.llImageTone=info.tone||'light';
 return count;
}
if(typeof window!=='undefined'&&typeof document!=='undefined'){
 const catalogPromise=fetch(new URL('./visual-catalog.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Catalog unavailable');return r.json()});
 const update=()=>catalogPromise.then(c=>enhanceVisualCards(document,c)).catch(()=>{});
 update();document.addEventListener('ll-businesses-updated',update);
}

