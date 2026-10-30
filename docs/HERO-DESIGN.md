# Interactive hero, local design revision

## Latest revision: continuous blue blend and expanded catalog

Mode 02 adjustment: stage/canvas dimensions now stay fixed across all options. The phone retains its gentle front rotation and moves only 0.28 units forward. This supersedes the 560px stage/0.92-unit approach below; no mode-specific resizing, scaling or camera zoom is used.

Shader time now advances independently of the selected console option. Tone, ring deformation and blue ink density interpolate smoothly; switching 01/02/03 does not restart time or replace the canvas. The hero loads once and pauses outside the viewport or in hidden tabs. Reduced motion uses demand rendering. Mode 02 uses a 560px stage and moves the phone 0.92 units forward, giving the miniature screen roughly 50% more height on mobile than the original default view. The native scroll surface and signal game remain; the miniature contains no page navigation.

The catalog now contains 92 products: 20 phones and 72 accessories, including seven watches/bands across Apple, Samsung, Xiaomi and Honor. Watch navigation, filters, category hero and homepage collection are connected to actual records. All 20 phones have 21 grouped specification fields, four overview blocks and an official source link. Regional variations and illustrative prices remain explicit.

The gallery now has larger imagery, thumbnails, keyboard arrows and an enlargement dialog. Optimized manufacturer references and attributed CC photos replace the seven unavailable-image cards. Eighteen phones have multiple images; S23 FE and A55 currently have one each. Some views are documented crops or color groupings, not new camera angles. See ASSETS.md and /credits: manufacturer reuse permission is not established, and approved media is required before publishing these new assets.

Focused verification: TypeScript, focused ESLint and six catalog/domain checks passed. Desktop galleries/watch listing and the 390px close-up were inspected. The shader retained the same canvas across a mode switch. RTL watch-carousel overflow was corrected (document width 390px). No full regression suite, production build, upload or deployment was performed for this revision.

## Category signatures, closer view, blue prices and club

The second hero console option now moves the model 0.76 scene units toward the camera and returns it to a readable front angle. The mini-page has no anchors or navigation; the signal game and native scrolling remain.

Listings have compact animated SVG category heroes with distinct copy, imagery and optical treatments for cases, glass, audio, chargers, cables and power banks. Animation respects reduced motion. Filter surfaces and selected states use the blue palette.

`Variant.compareAtPrice` is an optional illustrative reference price, validated to exceed the payable price. Seed offer records have sample reference values; payable prices remain unchanged. Cards and details share the blue strike-through and «قیمت آبی» presentation. The admin can edit the reference value. These are demo comparisons, not verified former market prices.

`/club` and `/account/club` present the customer club. The demo rule is one point per 100,000 Toman of merchandise after discounts, excluding delivery. New orders snapshot `bluePoints`; older fictional seed orders use the same calculation. The balance is derived from unique order IDs, so reading or refreshing never awards points again. Product, cart, confirmation, order detail, account overview and club ledger use the same rule. Future discount, shipping, event and grand-prize concepts are labeled unavailable; no redemption or actual award exists. The 500-point badge is a proposed demo milestone.

Focused checks passed for point rounding, delivery exclusion, checkout snapshots, persistence and duplicate-order handling. Desktop/mobile category and club layouts were visually inspected; no page overflow was observed in the tested mobile views. Type checking and focused lint passed. No deployment or full regression build was run for this design revision.

## Superseding revision: supplied GLTF and direct gestures

The hero now uses the owner's supplied `apple_iphone_18_pro_max_burgundy_2026` model by extraakash. Original files remain in Downloads. The local copy is recolored blue and packaged as `public/models/iphone-18/scene.glb` with external lens/detail textures. The supplied Sketchfab Standard license is preserved in the model folder and attribution appears on `/credits`. This replaces the earlier procedural interpretation described below.

There are no interaction modes. Desktop click-drag or horizontal touch movement orbits the model. Vertical touch swipes on its front-facing HTML screen use native scrolling; a visible thin scrollbar supports desktop use. The screen retains its blue identity and offers a three-signal connection interaction. The background shader now has stronger travelling rings, breathing displacement and blue light sweeps. Hidden tabs pause rendering; reduced motion uses demand rendering for the phone and disables ambient movement.

## Accessories and discovery

The catalog adds an individually linked case and glass entry for each of the 20 phones. `compatiblePhoneIds` defines exact fit; `compatibleBrands` supports phone-brand browsing. These fields are validated and editable in admin. Device brand is distinct from accessory manufacturer. Product pages recommend only exact model matches. Seed compatibility and illustrative artwork remain demo information requiring real SKU verification before sales.

Accessory menus derive manufacturer brands from the actual catalog and offer all five phone brands for cases and glass. Additional branded demonstration records use limited specifications from official sources: [Anker 511 Nano 3](https://www.ankerjapan.com/products/a2147), [Soundcore P20i](https://www.soundcore.com/products/p20i), [Anker 325 A1268](https://www.anker.com/eu-en/products/a1268). Their category diagrams are explicitly labeled as schematics, not photographs of those models. Prices and inventory are illustrative.

Search uses Persian/English brand aliases and bounded edit-distance suggestions when exact results are empty. Suggestions preserve the current price, brand and fit scope. Navigation shows a delayed, indeterminate travelling signal only while pending; Suspense loading pages use the same optical language, with no artificial minimum wait.

Focused local checks: exact-fit and typo-suggestion tests passed; desktop dragging and native screen scrolling worked; emulated mobile vertical screen swipe scrolled the mini-page, horizontal swipe changed the phone angle, and the accessory listing had no page overflow. The pending-navigation signal appeared during a deliberately delayed local navigation. Type checking and focused lint passed. Existing catalog-count and hero assertions were updated for the expanded catalog and revised reduced-motion behavior; the broad regression suite was not rerun. No deployment was performed.

## Earlier design notes (superseded where noted)

The hero now uses an animated GLSL ring field and a procedural phone mesh with metallic/glass materials, three camera lenses and side controls. The phone is a custom visual interpretation of iPhone 18 Pro Max, informed by [Apple's design reference](https://www.apple.com/iphone-18-pro/); it is not an official Apple CAD/model asset or a catalog product. All geometry is authored in this repository; no downloaded model or external environment map is required.

`src/components/phone-experience.tsx` contains the model and miniature Persian HTML experience. Screen pixels are projected through the same Three.js camera using a CSS homography, so native HTML scrolling and buttons remain usable. Rotation and screen interaction have separate controls to prevent touch gestures competing. The console below the hero changes the view and shader tone. The main shopping links remain ordinary HTML.

`src/components/optics.tsx` contains the background shader and visibility/reduced-motion handling. Both scenes are lazy loaded, bounded in pixel density and removed when the hero leaves the viewport. Hidden tabs pause rendering; reduced motion stops automatic rotation and shader animation. R3F owns geometry/material disposal, and event subscriptions and GSAP contexts clean up on unmount.

Desktop header and phone-category cards reveal the five catalog brands. Mobile keeps its compact category links and navigation.

This revision is local only. No source upload or Cloudflare deployment was performed. Focused local visual inspection covered desktop and 390px mobile; the phone theme button and native screen scrolling were exercised. Broad commerce/build/deployment testing was intentionally not repeated for this design pass.
