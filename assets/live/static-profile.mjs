import {renderProfile} from './profile-view.mjs?v=20261014-publication-sync';
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
  const [publicationResponse,routeResponse]=await Promise.all([
   fetch(PUBLIC_BASE+'/rest/v1/cc_ll_live_publications?select=business_id,route,public_content,active,sites',{headers:{apikey:PUBLIC_KEY},cache:'no-store'}),
   fetch(new URL('./business-routes.json',import.meta.url),{cache:'no-store'})
  ]);
  if(!publicationResponse.ok)throw Error('Published updates unavailable');
  const rows=(await publicationResponse.json()).filter(row=>(row.sites||['Loving Longmont']).includes('Loving Longmont'));
  const routes=routeResponse.ok?await routeResponse.json():{};
  const selected=choosePublication(rows,routes,location.pathname.split('/').pop(),staticName);
  if(selected.connected){
   connected=true;staticRoot.id='business-profile';staticRoot.classList.add('bp-main');
   if(selected.row)staticRoot.dataset.llProfile=selected.row.business_id;
   let catalog={};try{const response=await fetch(new URL('../visual-catalog.json',import.meta.url));if(response.ok)catalog=await response.json()}catch{}
   renderProfile(staticRoot,selected.row?.active?selected.row.public_content:null,catalog);
   document.dispatchEvent(new Event('ll-businesses-updated'));
  }
 }catch{staticRoot.replaceChildren();const message=document.createElement('p');message.setAttribute('role','status');message.textContent='Business updates are temporarily unavailable. Please refresh to try again.';staticRoot.append(message);connected=true;}
}
import {profileVisuals} from './profile-images.mjs?v=20261013-layout';
const article=document.querySelector('main article'),title=article?.querySelector('h1');
if(!connected&&article&&title){let catalog={};try{const r=await fetch(new URL('../visual-catalog.json',import.meta.url));if(r.ok)catalog=await r.json()}catch{}
const name=title.textContent.trim(),oldImage=article.querySelector('img'),description=article.querySelector('p')?.textContent||'',visuals=profileVisuals({name,image_url:oldImage?.getAttribute('src'),description},catalog);
const identity=document.createElement('div');identity.className='bp-identity';const media=document.createElement('figure');media.className='bp-primary-image';const img=document.createElement('img');img.src=visuals.image;img.alt=(visuals.illustration?'Illustration representing ':'Photo of ')+name;img.addEventListener('error',()=>{if(img.src!==visuals.art)img.src=visuals.art},{once:true});media.append(img);if(visuals.illustration){const caption=document.createElement('figcaption');caption.textContent='Illustration';media.append(caption)}
const heading=document.createElement('div');heading.className='bp-heading';if(visuals.logo){const logo=document.createElement('div');logo.className='bp-logo';const image=document.createElement('img');image.src=visuals.logo;image.alt=name+' logo';logo.append(image);heading.append(logo)}
oldImage?.closest('.ll-visual-image,.business-image,.card-image')?.remove();if(oldImage?.isConnected)oldImage.remove();article.querySelectorAll('.card-image,.business-placeholder,.resource-label,.card-label,.card-type').forEach(e=>e.remove());
while(article.firstChild)heading.append(article.firstChild);identity.append(media,heading);article.append(identity);article.className='bp-profile';document.querySelector('main').classList.add('bp-main');}
