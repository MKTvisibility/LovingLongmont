import './business-events-loader.mjs?v=20261018-research3';
import {renderProfile} from './profile-view.mjs?v=20261018-research3';
const PUBLIC_BASE='https://gvmwkltwrlqwbqegieum.supabase.co';
const PUBLIC_KEY='sb_publishable_SFIrQ_kqkLQJdBNMnaRr3g_w6XWKaBJ';
const normalizeBusinessName=value=>String(value||'').toLowerCase().replace(/[^a-z0-9]/g,'');
export function choosePublication(rows,routes,page,name){
 const mappedId=Object.keys(routes).find(id=>routes[id]===page);
 if(mappedId)return {connected:true,row:rows.find(row=>row.business_id===mappedId)};
 const direct=rows.filter(row=>row.route===page);
 if(direct.length===1)return {connected:true,row:direct[0]};
 const named=rows.filter(row=>normalizeBusinessName(row.public_content?.name)===normalizeBusinessName(name));
 return named.length===1?{connected:true,row:named[0]}:{connected:false};
}
let connected=false;
const staticRoot=document.querySelector('main'),staticName=staticRoot?.querySelector('h1')?.textContent.trim();
if(staticRoot&&staticName){
 try{
  const [publicationResponse,routeResponse,verifiedResponse]=await Promise.all([
   fetch(PUBLIC_BASE+'/rest/v1/cc_ll_live_publications?select=business_id,route,public_content,active,sites',{headers:{apikey:PUBLIC_KEY},cache:'no-store'}),
   fetch(new URL('./business-routes.json',import.meta.url),{cache:'no-store'}),
   fetch(new URL('./verified-profiles.json',import.meta.url),{cache:'no-store'}).catch(()=>null)
  ]);
  if(!publicationResponse.ok)throw Error('Published updates unavailable');
  const rows=(await publicationResponse.json()).filter(row=>(row.sites||['Loving Longmont']).includes('Loving Longmont'));
  const routes=routeResponse.ok?await routeResponse.json():{};
  const page=location.pathname.split('/').pop(),verified=verifiedResponse?.ok?(await verifiedResponse.json())[page]:null;
  const selected=choosePublication(rows,routes,page,staticName);
  // Existing public legacy pages can use the reviewed snapshot until connected in Command Center.
  // An explicit inactive publication always wins; a snapshot cannot republish it.
  if(selected.connected||verified){
   connected=true;staticRoot.id='business-profile';staticRoot.classList.add('bp-main');
   if(selected.row?.business_id||verified?.id)staticRoot.dataset.llProfile=selected.row?.business_id||verified.id;
   let catalog={};try{const response=await fetch(new URL('../visual-catalog.json',import.meta.url));if(response.ok)catalog=await response.json()}catch{}
   const content=selected.row?(selected.row.active?selected.row.public_content:null):verified;
   const metadata=verified?Object.fromEntries(['contact_url','events_url','service_area','phone_contact_mode','logo_background','logo_alt','tagline'].filter(k=>verified[k]).map(k=>[k,verified[k]])):{};
   const existingCalendar=staticRoot.querySelector('#business-events');
   renderProfile(staticRoot,content?{...metadata,...content}:null,catalog);
   if(content&&existingCalendar)staticRoot.append(existingCalendar);
   if(content){staticRoot.dataset.llProfileReady='true';if(metadata.events_url||content.events_url)staticRoot.dataset.llEventsUrl=content.events_url||metadata.events_url;}
   document.dispatchEvent(new Event('ll-businesses-updated'));
  }
 }catch{staticRoot.replaceChildren();const message=document.createElement('p');message.setAttribute('role','status');message.textContent='Business updates are temporarily unavailable. Please refresh to try again.';staticRoot.append(message);connected=true;}
}
import {profileVisuals} from './profile-images.mjs?v=20261018-research3';
const article=document.querySelector('main article'),title=article?.querySelector('h1');
if(!connected&&article&&title){let catalog={};try{const r=await fetch(new URL('../visual-catalog.json',import.meta.url));if(r.ok)catalog=await r.json()}catch{}
const name=title.textContent.trim(),oldImage=article.querySelector('img'),description=article.querySelector('p')?.textContent||'',visuals=profileVisuals({name,image_url:oldImage?.dataset.llOriginalSrc||oldImage?.getAttribute('src'),description},catalog);
const identity=document.createElement('div');identity.className='bp-identity';const media=document.createElement('figure');media.className='bp-primary-image';
const placeholder=()=>{media.replaceChildren();const text=document.createElement('span');text.className='bp-name-placeholder';text.textContent=name;media.append(text);};
const source=!visuals.illustration&&!/\/assets\/art\/|category-.*art/.test(visuals.image||'')?visuals.image:'';
if(source){const img=document.createElement('img');img.src=source;img.alt='Photo of '+name;img.addEventListener('error',placeholder,{once:true});media.append(img);}else placeholder();
const heading=document.createElement('div');heading.className='bp-heading';if(visuals.logo){const logo=document.createElement('div');logo.className='bp-logo';const image=document.createElement('img');image.src=visuals.logo;image.alt=name+' logo';logo.append(image);heading.append(logo)}
oldImage?.closest('.ll-visual-image,.business-image,.card-image')?.remove();if(oldImage?.isConnected)oldImage.remove();article.querySelectorAll('.card-image,.business-placeholder,.resource-label,.card-label,.card-type').forEach(e=>e.remove());
while(article.firstChild)heading.append(article.firstChild);identity.append(media,heading);article.append(identity);article.className='bp-profile';document.querySelector('main').classList.add('bp-main');}

// Notify independently managed public calendars after a static profile renders.
document.dispatchEvent(new Event('ll-businesses-updated'));
