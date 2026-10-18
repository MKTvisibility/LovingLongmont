// One public profile can have several researched category placements.
export const RETIRED_IDS=new Set(['b8d00942-eb87-5cb3-bb6b-1e34daa74b9b']);
export const pageName=value=>String(value||'').split(/[?#]/)[0];
export function directoryEntries(catalog,publications,page,routes={}){
 const published=new Map(publications.map(row=>[row.business_id,row]));const entries=[];
 for(const item of catalog){
  if(RETIRED_IDS.has(item.business_id))continue;
  const live=published.get(item.business_id);
  if(live&&(!live.active||!(live.sites||['Loving Longmont']).includes('Loving Longmont')))continue;
  const pages=live?(live.site_placements?.['Loving Longmont']||live.spotlight_pages||[]):item.pages||[];
  if(page!=='businesses.html'&&!pages.some(p=>pageName(p)===page))continue;
  const content=live?.public_content||item.public_content||{name:item.name,description:item.description,gallery:item.gallery||[]};
  entries.push({...item,...live,public_content:content,pageRoute:routes[item.business_id]||item.route||item.source||live?.route||('business.html?id='+encodeURIComponent(item.business_id))});
 }
 // Future published businesses need no catalog rebuild to appear in selected categories.
 const known=new Set(catalog.map(row=>row.business_id));
 for(const row of publications){
  if(known.has(row.business_id)||RETIRED_IDS.has(row.business_id)||!row.active||!(row.sites||['Loving Longmont']).includes('Loving Longmont'))continue;
  const pages=row.site_placements?.['Loving Longmont']||row.spotlight_pages||[];
  if(page!=='businesses.html'&&!pages.some(p=>pageName(p)===page))continue;
  entries.push({...row,pageRoute:routes[row.business_id]||row.route||('business.html?id='+encodeURIComponent(row.business_id))});
 }
 return entries.sort((a,b)=>String(a.public_content.name).localeCompare(String(b.public_content.name),'en',{sensitivity:'base',numeric:true}));
}
