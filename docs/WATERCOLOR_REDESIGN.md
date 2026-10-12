# Approved watercolor redesign — October 12, 2026

Target: existing owner-private Loving Longmont draft, project appgprj_6acc3726c99881919ca8665160c224cb. The live LovingLongmont.com repository, domain, deployment and database records are unchanged.

Rollback source: d554ffeb81e41c3be60259d419d3fa0f9cfd953e (prior published Site version 19). Local rollback branch: rollback/before-watercolor-20261012.

All 22 existing HTML routes receive a shared botanical header, forest-green navigation, search, cream page surfaces, elegant typography, matching cards, footer and responsive styles. Homepage, category intro layouts, directory controls, individual business styling and events filters receive additional changes. Every individual business uses the existing business.html?id= route.

Reused artwork: reference logo, two botanical crops and six decorative category illustrations. Recreated artwork: text-free watercolor mountain/downtown homepage scene, matching the reference composition. Generation used the built-in image tool with the supplied reference: landscape 3:1, left cream space and botanicals, right watercolor mountains/downtown, no text, UI, mockup frames or business photographs. Project assets: dist/assets/watercolor-hero.webp and watercolor-hero-small.webp. No generated photographs were assigned to actual business records.

Public content continues to come only from cc_ll_draft_publications. Public field selections and per-social-link hiding are enforced by the existing Command Center publication RPC. No fetches of private business records were added. Search/subcategory filters use only published category tags, split on bullet separators. Main category membership uses published placements or published category labels. Dedicated separate subcategory storage/editing is not introduced by this visual redesign.

Verification: 94 active public snapshots read successfully; complete directory and all 94 individual business pages exercised with DOM checks; category directories, search/no-result behavior, subcategories, sorting, spotlight order, directory exclusion independent of spotlight status, hidden fields and gallery absence tested. Existing Command Center publication regression passed in PGlite, verifying snapshot isolation, field/social visibility, membership authorization and anonymous publishing rejection. This is not a live authenticated publish/upload test. No business records were modified to test writes.

All 31 existing remote main-image URLs returned image content successfully. All local navigation/asset paths, heading and ID structure, JavaScript syntax checked. Existing fragment-only CSS filter references are SVG IDs, not missing asset files. Search index rebuilt. Events retain preexisting information and organizer URLs, with time/location carried into homepage previews. Event dates were not newly researched or certified during a design change.

Limitations: Browser control skill unavailable in this managed environment; no desktop/mobile screenshots, rendered accessibility/contrast audit or live end-to-end authenticated Command Center upload/publish test. Existing remote business image URLs depend on source availability; failure handling removes failed images without fabricating replacements. Source is saved to the existing Sites Git repository and mirrored in MKTvisibility/LovingLongmont on draft/watercolor-redesign-20261012. The homepage shows selected spotlights when assigned; otherwise it offers three published businesses with existing photos under Discover local businesses.

## Parade header revision

October 12: homepage scenery replaced with a watercolor adaptation of Michelle’s three supplied parade photographs, using the Coffman Street intersection, actual brick/blue-gray building, trees, balloon arch and parade participants. Expressions softened to natural smiles. Fantasy mountain backdrop removed. Generated using the built-in image tool; this is an illustrated adaptation of the photographs, not an unaltered documentary photo. Solid cream masthead and transparent logo preserved. New reusable assets: watercolor-parade-hero.webp and watercolor-parade-hero-small.webp. Previous hero assets retained for rollback.

## White and green, uncropped imagery

Removed ornamental florals from shared header/interior/footer accents and homepage hero art. White replaces cream backgrounds; forest-green navigation/buttons/footer retained. Hero is now a responsive image element showing its entire width, with headline below it on mobile. All displayed images use natural aspect ratios, contain sizing and no fixed-height cropping; directory/category/gallery/story image containers adapt to their contents. No browser rendering verification is available in this session.

## Approved full-width panorama

Michelle approved the revised panorama with the duplicated son removed at the X-marked position and the left circled instance retained. Used the exact approved generated artwork, optimized to WebP at original proportions with a responsive small variant. Homepage image fills available viewport width; headline/subtitle/button sit below so neither imagery nor text obscure parade participants. Interior headers remain compact and white with the transparent logo.
