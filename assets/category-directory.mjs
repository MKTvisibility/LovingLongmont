import {renderBusinessCard} from './live/profile-view.mjs?v=20261018-navigation-v2';
import {directoryEntries} from './directory-data.mjs?v=20261018-navigation-v2';
export const alphabetical=(a,b)=>String(a.public_content?.name||a.name||'').localeCompare(String(b.public_content?.name||b.name||''),'en',{sensitivity:'base',numeric:true});
export async function loadCategoryDirectory(doc=document,fetcher=fetch){
 const root=doc.querySelector('[data-category-directory]');if(!root)return;
 const page=doc.defaultView.location.pathname.split('/').pop()||'index.html';
 const results=await Promise.allSettled([
  fetcher(new URL('./category-listings.json',import.meta.url),{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Directory unavailable');return r.json()}),
  fetcher('https://gvmwkltwrlqwbqegieum.supabase.co/rest/v1/cc_ll_live_publications?select=business_id,route,public_content,directory,spotlight_pages,active,sites,site_placements',{headers:{apikey:'sb_publishable_SFIrQ_kqkLQJdBNMnaRr3g_w6XWKaBJ'},cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Live updates unavailable');return r.json()}),
  fetcher(new URL('./live/business-routes.json',import.meta.url),{cache:'no-store'}).then(r=>r.ok?r.json():{})
 ]);
 if(results[0].status==='rejected'){return} // Keep server-rendered cards available during a connection failure.
 const catalog=results[0].value,publications=results[1].status==='fulfilled'?results[1].value:[],routes=results[2].status==='fulfilled'?results[2].value:{};
 const rows=directoryEntries(catalog,publications,page,routes);
 const ids=new Set(catalog.map(row=>row.business_id));
 // Retire only duplicate legacy business cards; keep editorial guide text and event calendars.
 for(const node of doc.querySelectorAll('[data-ll-live-business],.ll-connected-spotlights')){
  if(root.contains(node)||node.closest('.home-story-spotlights,.ll-business-calendar,.event-card'))continue;
  if(ids.has(node.dataset.llLiveBusiness)||node.classList.contains('ll-connected-spotlights'))node.remove();
 }
 const knownRoutes=new Set(catalog.map(r=>String(r.route||routes[r.business_id]||'').split('#')[0]).filter(Boolean));
 for(const card of doc.querySelectorAll('article')){
  if(root.contains(card)||card.closest('.home-story-spotlights,.ll-business-calendar')||card.classList.contains('event-card'))continue;
  const link=card.querySelector('h3 a,h2 a');if(!link)continue;
  const destination=new URL(link.getAttribute('href'),doc.baseURI).pathname.split('/').pop();
  if(knownRoutes.has(destination))card.remove();
 }
 const status=doc.createElement('p');status.className='ll-directory-status';status.textContent=rows.length+' '+(rows.length===1?'listing':'listings')+' · Alphabetical';
 const grid=doc.createElement('div');grid.className='ll-connected-grid ll-compact-grid';grid.dataset.llPreserveLayout='';
 if(page==='jobs.html'){
 const groups=[['job-search','Local Job Resources'],['government','Government & Public-Sector Jobs'],['temp-work','Staffing & Recruiting'],['side-gigs','Side Gigs & Employment Platforms'],['training','Training & Career Development']];
 for(const [id,label] of groups){const items=rows.filter(r=>(r.pages||[]).includes('jobs.html#'+id));if(!items.length)continue;const section=doc.createElement('section');section.id=id;const h=doc.createElement('h2');h.textContent=label;const cards=doc.createElement('div');cards.className='ll-connected-grid ll-compact-grid';items.forEach(r=>cards.append(renderBusinessCard(doc,r,'spotlight')));section.append(h,cards);grid.append(section);}grid.className='ll-job-groups';
 }else for(const row of rows)grid.append(renderBusinessCard(doc,row,'spotlight'));
 root.replaceChildren(status,grid);doc.dispatchEvent(new Event('ll-directory-updated'));
}
if(typeof document!=='undefined'){
 const run=()=>loadCategoryDirectory().catch(()=>{});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
}
