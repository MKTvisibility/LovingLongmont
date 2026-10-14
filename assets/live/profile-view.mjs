import {profileVisuals} from './profile-images.mjs?v=20261013-layout';
// Shared by the public site and the Command Center preview. No HTML from records is evaluated.
export function safeWebUrl(value){try{const u=new URL(value);return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password?u.href:''}catch{return ''}}
function builder(root){const d=root.ownerDocument;return (tag,cls,text)=>{const n=d.createElement(tag);if(cls)n.className=cls;if(text!==undefined&&text!==null)n.textContent=String(text);return n}}
function addLink(make,parent,url,label,cls=''){if(!url)return null;const a=make('a',cls,label);a.href=url;if(/^https?:/.test(url)){a.target='_blank';a.rel='noopener noreferrer'}parent.append(a);return a}
function photo(make,parent,url,alt,cls=''){url=safeWebUrl(url);if(!url)return;const img=make('img',cls);img.src=url;img.alt=alt||'';img.loading='lazy';img.addEventListener('error',()=>{img.hidden=true});parent.append(img);return img}
export function renderProfile(root,b,catalog={}){const make=builder(root);root.replaceChildren();if(!b){root.append(make('h1','','Business page unavailable'),make('p','','This business page is not currently published.'));return}
 const article=make('article','bp-profile'),identity=make('div','bp-identity'),heading=make('div','bp-heading');
 const visuals=profileVisuals(b,catalog,root.dataset.llProfile),media=make('figure','bp-primary-image');const primary=photo(make,media,visuals.image,(visuals.illustration?'Illustration representing ':'Photo of ')+b.name);if(visuals.illustration){media.dataset.imageKind='art';media.append(make('figcaption','','Illustration'))}if(primary&&visuals.art)primary.addEventListener('error',()=>{if(primary.src!==visuals.art){primary.hidden=false;primary.src=visuals.art;primary.alt='Illustration representing '+b.name;media.dataset.imageKind='art'}},{once:true});if(visuals.image)identity.append(media);else identity.classList.add('bp-no-feature');
 if(visuals.logo){const logo=make('div','bp-logo');photo(make,logo,visuals.logo,b.name+' logo');heading.append(logo)}
 if(b.categories?.length)heading.append(make('p','bp-eyebrow',b.categories.join(' · ')));
 heading.append(make('h1','',b.name));if(b.tagline)heading.append(make('p','bp-tagline',b.tagline));if(b.description)heading.append(make('p','bp-intro',b.description));
 const actions=make('div','bp-actions');addLink(make,actions,safeWebUrl(b.website),'Visit Website ↗','bp-button');if(b.phone)addLink(make,actions,'tel:'+b.phone.replace(/[^+\d]/g,''),'Call '+b.phone,'bp-button bp-outline');if(b.email)addLink(make,actions,'mailto:'+encodeURIComponent(b.email),'Email '+(b.photographer?.split(' ')[0]||'Business'),'bp-button bp-outline');if(actions.childNodes.length)heading.append(actions);identity.append(heading);article.append(identity);
 const gallery=(b.gallery||[]).filter(p=>safeWebUrl(p.url));
 const remainingGallery=visuals.usedGallery?gallery.slice(1):gallery;
 const grid=make('div','bp-content-grid'),story=make('div','bp-story');
 if(b.story){const section=make('section');section.append(make('p','bp-eyebrow','THE STORY BEHIND THE BUSINESS'),make('h2','','About '+b.name));for(const p of b.story.split(/\n\s*\n/).filter(Boolean))section.append(make('p','',p));story.append(section)}
 if(b.services?.length){const section=make('section');section.append(make('h2','','Services'));const list=make('ul','bp-service-list');b.services.forEach(s=>list.append(make('li','',s)));section.append(list);story.append(section)}
 if(story.childNodes.length)grid.append(story);
 const contact=make('aside','bp-contact'),dl=make('dl');const detail=(title,value,url)=>{if(!value)return;const row=make('div');row.append(make('dt','',title));const dd=make('dd');if(url)addLink(make,dd,url,value);else dd.textContent=value;row.append(dd);dl.append(row)};
 detail('Contact',b.photographer);detail('Service area',b.service_area);detail('Address',b.address);detail('Phone',b.phone,b.phone?'tel:'+b.phone.replace(/[^+\d]/g,''):'');detail('Email',b.email,b.email?'mailto:'+encodeURIComponent(b.email):'');const website=safeWebUrl(b.website);detail('Website',website?new URL(website).hostname:'',website);
 for(const url of b.social_urls||[]){const u=safeWebUrl(url);if(u)detail('Social',new URL(u).hostname,u)}
 if(dl.childNodes.length){contact.append(make('p','bp-eyebrow','CONNECT WITH THE BUSINESS'),make('h2','','Get in touch'),dl);grid.append(contact)}
 if(grid.childNodes.length){if(grid.childNodes.length===1)grid.classList.add('bp-single-column');article.append(grid)}
 if(remainingGallery.length){const section=make('section','bp-gallery');section.append(make('p','bp-eyebrow','A LOOK AT THE WORK'),make('h2','','Gallery'));const photos=make('div','bp-gallery-grid');remainingGallery.forEach(p=>{const f=make('figure');photo(make,f,p.url,p.alt||b.name);if(p.caption)f.append(make('figcaption','',p.caption));photos.append(f)});section.append(photos);article.append(section)}
 const bottom=make('div','bp-bottom');addLink(make,bottom,'businesses.html','← Browse local businesses');article.append(bottom);root.append(article);return article;
}
export function renderBusinessCard(document,row,variant='directory'){const root=document.createElement('article'),make=builder(root),b=row.public_content;root.className=variant==='staffing'?'ll-staffing-card':variant==='spotlight'?'ll-connected-card':'business-card';root.dataset.ccBusiness=row.business_id;root.dataset.llLiveBusiness=row.business_id;const route=row.pageRoute||((row.route.startsWith('business-')||document.documentElement.dataset.businessSite==='MKT Colorado'||row.route==='7-anubis-farms.html')?'business.html#id='+encodeURIComponent(row.business_id):row.route);
 if(safeWebUrl(b.image_url)){const image=make('div',variant==='staffing'?'ll-staffing-image':variant==='spotlight'?'ll-connected-image':'business-image'),a=make('a');a.href=route;a.setAttribute('aria-label',b.name);photo(make,a,b.image_url,b.name);image.append(a);root.append(image)}
 root.dataset.businessCategory=(b.categories||[]).join(' · ');
 const body=make('div','business-body'),title=make('h3');addLink(make,title,route,b.name);body.append(title);if(b.description)body.append(make('p','business-description',b.description));
 const links=make('div','business-links');addLink(make,links,route,'View Business Page →','business-button');body.append(links);root.append(body);return root;
}
