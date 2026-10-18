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

export function profileVisuals(b,catalog={},id=''){
 const asset=src=>{try{return new URL(src,new URL('../../',import.meta.url)).href}catch{return ''}};
 const known=catalog.byId?.[id]||catalog.byName?.[normalizeName(b.name)];
 const image=(b.image_url||'').replace('https://lovinglongmont.github.io/loving-longmont-website/','https://mktvisibility.github.io/LovingLongmont/');
 const isLogo=Boolean(image&&(known?.kind==='logo'||/logo/i.test(image)));
 const logo=b.logo_url||(isLogo?image:'');
 const photos=(b.gallery||[]).filter(p=>p?.url&&p.enabled!==false);
 // Published records use the explicitly labelled logo and photo controls.
 if(b.id){const illustration=/\/assets\/art\/|category-.*art|illustration/i.test(image);const legacyPhoto=(known?.kind==='photo'||/stvrainhistory[.]org\/s\/cc_images\/cache_/i.test(image))&&!/logo/i.test(image);return {logo:image&&!illustration&&!legacyPhoto?asset(image):'',logoBackground:b.logo_background||(known?.tone==='dark'?'dark':''),image:photos[0]?.url?asset(photos[0].url):legacyPhoto?asset(image):'',art:'',illustration:false,usedGallery:Boolean(photos.length)};}
 const photo=photos[0]?.url||(!isLogo?image:'');
 const art=catalog.art?.[artFamily(b.name,(b.categories||[]).join(' ')+' '+(b.description||''))]||'assets/category-shop-local-art-small.webp';
 return {logo:logo?asset(logo):'',image:photo?asset(photo):asset(art),art:asset(art),illustration:!photo,usedGallery:photos[0]?.url===photo};
}
