import {CATEGORY_ROUTES,tags,groups,inCategory,filterBusinesses,publicationRecords,spotlightRecords} from './business-model.mjs';
const BASE='https://gvmwkltwrlqwbqegieum.supabase.co';
const KEY='sb_publishable_SFIrQ_kqkLQJdBNMnaRr3g_w6XWKaBJ';
const page=location.pathname.split('/').pop()||'index.html';
const normalize=s=>String(s||'').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
const url=value=>{try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password?u.href:''}catch{return ''}};
const el=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text)node.textContent=text;return node};
const route=b=>'business.html?id='+encodeURIComponent(b.id);
function image(src,name,className){const img=el('img',className);img.src=url(src);img.alt=name;img.loading='lazy';img.addEventListener('error',()=>{img.remove();});return img}
function card(b){const article=el('article','ll-business-card');article.dataset.businessId=b.id;if(url(b.image_url)){const a=el('a','ll-card-image');a.href=route(b);a.setAttribute('aria-label',b.name);const img=image(b.image_url,b.name);img.addEventListener('error',()=>a.remove());a.append(img);article.append(a)}const title=el('h3');const a=el('a','',b.name);a.href=route(b);title.append(a);article.append(title);if(b.description)article.append(el('p','',b.description));if(b.categories?.length)article.append(el('div','ll-card-category',b.categories.join(' · ')));const read=el('a','ll-read','View business →');read.href=route(b);article.append(read);return article}
function directory(records,title='Browse businesses',query=''){
 const section=el('section','ll-directory');section.append(el('h2','',title));const tools=el('div','ll-directory-tools');
 function field(text,node){const label=el('label','',text);label.append(node);tools.append(label);return node}
 const search=field('Find a business',el('input'));search.type='search';search.placeholder='Name, place, or category';search.value=query;
 const select=field('Category',el('select'));select.append(new Option('All categories',''));const available=[...new Set(records.flatMap(groups))].sort();available.forEach(c=>select.append(new Option(c,c)));
 const chosen=new URLSearchParams(location.search).get('category');if(chosen){if(!available.includes(chosen)&&records.some(b=>b.categories?.includes(chosen)))select.append(new Option(chosen,chosen));select.value=chosen;}
 const sub=field('Subcategory',el('select'));const sort=field('Sort by',el('select'));[['Name: A–Z','az'],['Name: Z–A','za'],['Recently published','recent']].forEach(([n,v])=>sort.append(new Option(n,v)));
 const count=el('span');count.setAttribute('role','status');const grid=el('div','ll-card-grid');tools.append(count);section.append(tools,grid);
 function updateTags(){const value=sub.value;sub.replaceChildren(new Option('All subcategories',''));const scoped=filterBusinesses(records,{category:select.value});[...new Set(scoped.flatMap(tags))].sort().forEach(c=>sub.append(new Option(c,c)));if([...sub.options].some(o=>o.value===value))sub.value=value;}
 function render(){const matches=filterBusinesses(records,{query:search.value,category:select.value,subcategory:sub.value,sort:sort.value});count.textContent=matches.length+' businesses';grid.replaceChildren(...matches.map(card));if(!matches.length)grid.append(el('p','ll-empty','No matching businesses. Try another search or category.'));}
 search.addEventListener('input',render);select.addEventListener('change',()=>{updateTags();render()});sub.addEventListener('change',render);sort.addEventListener('change',render);updateTags();render();return section;
}
function post(b){const main=document.getElementById('business-post');main.replaceChildren();if(!b){main.append(el('h1','','Business unavailable'),el('p','','This business page is not currently available.'));return}document.title=b.name+' | Loving Longmont';const back=el('a','ll-back','← Browse all businesses');back.href='businesses.html';main.append(back,el('h1','',b.name));if(url(b.image_url))main.append(image(b.image_url,b.name,'ll-post-photo'));if(b.description)main.append(el('p','',b.description));const details=el('div','ll-post-details');if(b.address)details.append(el('span','',b.address));if(b.phone){const a=el('a','',b.phone);a.href='tel:'+b.phone.replace(/[^+\d]/g,'');details.append(a)}if(url(b.website)){const a=el('a','','Visit official website ↗');a.href=url(b.website);a.target='_blank';a.rel='noopener noreferrer';a.className='ll-visit';details.append(a)}for(const social of b.social_urls||[]){if(url(social)){const a=el('a','',new URL(social).hostname.replace(/^www\./,''));a.href=url(social);a.target='_blank';a.rel='noopener noreferrer';details.append(a)}}main.append(details);if(b.categories?.length){const nav=el('nav','page-toc');nav.setAttribute('aria-label','Browse related categories');for(const c of b.categories){const a=el('a','',c);a.href='businesses.html?category='+encodeURIComponent(c);nav.append(a)}main.append(nav)}if(b.story)main.append(el('h2','','Their story'),el('p','ll-story',b.story));if(b.gallery_images?.length){const gallery=el('div','ll-gallery');for(const src of b.gallery_images){if(url(src))gallery.append(image(src,b.name))}main.append(gallery)}}
async function run(){const r=await fetch(BASE+'/rest/v1/cc_ll_draft_publications?select=business_id,public_content,directory,pages,spotlight_pages,spotlight_order,active,published_at',{headers:{apikey:KEY},cache:'no-store'});if(!r.ok)throw Error('Published businesses unavailable');const published=await r.json();const records=publicationRecords(published);
if(page==='business.html'){const business=records.find(b=>b.id===new URLSearchParams(location.search).get('id'));post(business);if(business){const related=records.filter(b=>b.id!==business.id&&b.directory!==false&&b.categories?.some(c=>business.categories?.includes(c))).slice(0,3);if(related.length){const section=el('section','ll-directory');section.append(el('h2','','More to discover'));const grid=el('div','ll-card-grid');grid.append(...related.map(card));section.append(grid);document.getElementById('business-post').append(section)}}return}
const seen=new Set();document.querySelectorAll('[data-ll-business]').forEach(node=>{const b=records.find(b=>b.id===node.dataset.llBusiness);if(!b||b.directory===false||!(b.pages||[]).includes(page)){node.remove();return}node.replaceWith(card(b));seen.add(b.id)});
const categoryRoot=document.getElementById('ll-category-directory');if(categoryRoot){const matches=records.filter(b=>b.directory!==false&&inCategory(b,page));categoryRoot.append(directory(matches,'Explore local businesses'))}
if(page==='businesses.html'||page==='search.html'||page==='spotlight.html'){
 const all=records.filter(b=>b.directory!==false);
 const root=document.getElementById('directory-root');
 if(root)root.append(directory(all,page==='spotlight.html'?'Local business stories':'All businesses',new URLSearchParams(location.search).get('q')||''));
}else if(!categoryRoot&&page!=='index.html'){
 const extras=records.filter(b=>b.directory!==false&&(b.pages||[]).includes(page)&&!seen.has(b.id));
 if(extras.length){const section=el('section','ll-directory');section.append(directory(extras,'Discover local businesses'));document.querySelector('main').append(section)}
}
if(page==='index.html'){
 const selected=spotlightRecords(records,page);
 
 const display=selected;
 const grid=document.getElementById('home-business-grid');grid?.append(...display.map(card));
 if(!display.length)document.getElementById('home-spotlights')?.remove();
}

const spotlights=spotlightRecords(records,page);if(spotlights.length&&page!=='index.html'){const section=el('section','ll-spotlight');section.append(el('h2','','Business spotlights'));const grid=el('div','ll-card-grid');grid.append(...spotlights.map(card));section.append(grid);const main=document.querySelector('main');let before=main.querySelector('#directory-root,#ll-category-directory,.ll-directory');while(before&&before.parentElement!==main)before=before.parentElement;main.insertBefore(section,before)}
}
run().catch(()=>{const target=document.getElementById('business-post');if(target){target.replaceChildren(el('p','ll-empty','This business could not load. Please refresh or browse the directory.'))}else{document.querySelector('main')?.append(el('p','ll-empty','Business updates could not load. Please refresh.'))}});
