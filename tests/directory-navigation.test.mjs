import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {directoryEntries} from '../assets/directory-data.mjs';
import {directoryPhotos,directoryPhoto} from '../assets/live/profile-view.mjs';
const catalog=JSON.parse(fs.readFileSync(new URL('../assets/category-listings.json',import.meta.url)));
test('a live placement overrides a stale catalog and inactive listings stay hidden',()=>{
 const cat=[{business_id:'one',name:'One',pages:['food-drink.html'],route:'one.html'},{business_id:'off',name:'Off',pages:['shopping-specialty-stores.html'],route:'off.html'}];
 const live=[{business_id:'one',active:true,sites:['Loving Longmont'],public_content:{name:'One',gallery:[{url:'https://official.test/new.jpg'}]},site_placements:{'Loving Longmont':['shopping-specialty-stores.html']}},{business_id:'off',active:false,sites:['Loving Longmont'],public_content:{name:'Off'}}];
 assert.equal(directoryEntries(cat,live,'food-drink.html').length,0);const selected=directoryEntries(cat,live,'shopping-specialty-stores.html');assert.deepEqual(selected.map(x=>x.business_id),['one']);assert.equal(selected[0].public_content.gallery[0].url,'https://official.test/new.jpg');
});
test('new publications appear without rebuilding the catalog, and section anchors match the parent page',()=>{
 const r=directoryEntries([],[{business_id:'future',active:true,public_content:{name:'Future'},site_placements:{'Loving Longmont':['jobs.html#government']}}],'jobs.html',{future:'future.html'});assert.equal(r[0].pageRoute,'future.html');
});
test('directory uses the selected first enabled profile photo, never a logo',()=>{
 const b={id:'example',image_url:'https://official.test/logo.png',gallery:[{url:'https://official.test/disabled.jpg',enabled:false},{url:'https://official.test/left.jpg'},{url:'https://official.test/extra.jpg'}]};assert.equal(directoryPhoto(b).url,'https://official.test/left.jpg');assert.equal(directoryPhotos(b).length,2);assert.equal(directoryPhoto({id:'example',image_url:b.image_url}),null);
});
test('legacy photo hosts are normalized and unsafe image schemes are rejected',()=>{
 assert.equal(directoryPhoto({id:'x',gallery:[{url:'https://lovinglongmont.github.io/loving-longmont-website/assets/photo.webp'}]}).url,'https://mktvisibility.github.io/LovingLongmont/assets/photo.webp');assert.equal(directoryPhoto({id:'x',gallery:[{url:'javascript:alert(1)'}]}),null);
});
test('every catalog listing has an actual existing category destination',()=>{
 const categories=new Set(['food-drink.html','farms-local-essentials.html','shopping-specialty-stores.html','arts-crafts-makers.html','music-entertainment.html','professional-business-services.html','health-wellness.html','animals.html','books-comics-games.html','home-garden-gifts.html','sports-fitness-equipment.html','outdoor-recreation-adventure.html','classes-learning.html','history.html','museums-historic-sites.html','kids-family-activities.html','event-venues-group-experiences.html','farm-visits-seasonal-fun.html','recovery-peer-support.html','senior-services.html','bakeries-cottage-food.html','vintage-secondhand-creative-reuse.html','faith-spirituality.html','food-assistance-basic-needs.html','find-a-local-volunteer-opportunity.html','jobs.html']);
 for(const row of catalog){assert.ok(row.pages.some(p=>categories.has(p.split('#')[0])),row.name+' has no category');for(const p of row.pages)assert.ok(fs.existsSync(new URL('../'+p.split('#')[0],import.meta.url)),row.name+': '+p);}
});
test('researched corrections are represented in the public category snapshot',()=>{
 const item=name=>catalog.find(r=>r.name===name);assert.ok(item('Bella La Crema').pages.includes('food-drink.html'));assert.ok(!item('Bella La Crema').pages.includes('home-garden-gifts.html'));assert.ok(item('Drifters').pages.includes('shopping-specialty-stores.html'));assert.ok(item('Longmont Museum').pages.includes('museums-historic-sites.html'));assert.ok(item('City of Longmont Careers').pages.includes('jobs.html#government'));
});
