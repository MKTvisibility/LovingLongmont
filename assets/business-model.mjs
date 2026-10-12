export const CATEGORY_ROUTES={
 'Eat & Drink':{route:'eat-drink.html',pattern:/\b(food|foods|drink|restaurant|bakery|chocolate|cafe|bar|brews|sweet|coffee|desserts|ice cream|taproom|snacks|bread)\b/i},
 'Shop Local':{route:'shop-local.html',pattern:/\b(shop|shopping|gifts?|retail|bookstore|market|candles|apparel|store|boutique|makers|comics|rugs|jewelry)\b/i},
 'Arts & Culture':{route:'arts-culture.html',pattern:/\b(art|arts|creative|music|pottery|studio|museum|gallery|watercolor|craft|textiles|glass)\b/i},
 'Get Outside':{route:'get-outside.html',pattern:/\b(nature|park|farm|outdoor|recreation|skydiving|trail|bike|bicycle|garden)\b/i}
};
export const tags=b=>(b.categories||[]).flatMap(c=>String(c).split(/\s*[•|]\s*/)).map(c=>c.trim()).filter(Boolean);
export function inCategory(b,route){const rule=Object.values(CATEGORY_ROUTES).find(c=>c.route===route);return (b.pages||[]).includes(route)||!!rule?.pattern.test((b.categories||[]).join(' '))}
export const groups=b=>Object.entries(CATEGORY_ROUTES).filter(([,c])=>inCategory(b,c.route)).map(([n])=>n);
export function filterBusinesses(records,{query='',category='',subcategory='',sort='az'}={}){
 const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
 return records.filter(b=>(!category||groups(b).includes(category)||(b.categories||[]).includes(category))&&(!subcategory||tags(b).includes(subcategory))&&terms.every(t=>[b.name,b.description,b.address,...b.categories||[]].join(' ').toLowerCase().includes(t))).sort((a,b)=>sort==='recent'?String(b.published_at||'').localeCompare(String(a.published_at||''))||a.name.localeCompare(b.name):sort==='za'?b.name.localeCompare(a.name):a.name.localeCompare(b.name));
}
export function publicationRecords(rows){return rows.filter(r=>r.active).map(r=>({...r.public_content,id:r.public_content.id||r.business_id,pages:r.pages||[],directory:r.directory,spotlight_pages:r.spotlight_pages||[],spotlight_order:r.spotlight_order||0,published_at:r.published_at}))}
export const spotlightRecords=(records,page)=>records.filter(b=>b.spotlight_pages.includes(page)).sort((a,b)=>a.spotlight_order-b.spotlight_order||a.name.localeCompare(b.name));
