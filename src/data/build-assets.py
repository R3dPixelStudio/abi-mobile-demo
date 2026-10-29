"""Rebuild original demo SVG assets and attribution from saved public metadata."""
from pathlib import Path
import json, re, html
ROOT = Path(__file__).resolve().parents[2]
PRODUCTS = ROOT / 'public/products'
EDITORIAL = ROOT / 'public/editorial'
def svg(body, width=600, height=600, background='none'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}"><defs><linearGradient id="body" x2=".9" y2="1"><stop stop-color="#f8f7f3"/><stop offset=".55" stop-color="#dddcd7"/><stop offset="1" stop-color="#aaa9a4"/></linearGradient><linearGradient id="dark" x2=".6" y2="1"><stop stop-color="#565b5c"/><stop offset="1" stop-color="#181e20"/></linearGradient><filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="18" stdDeviation="16" flood-opacity=".12"/></filter></defs><rect width="100%" height="100%" fill="{background}"/>{body}</svg>'
art = {
 'charger': '<g filter="url(#shadow)" transform="rotate(-15 300 300)"><rect x="209" y="110" width="28" height="95" rx="10" fill="#aaaead"/><rect x="325" y="110" width="28" height="95" rx="10" fill="#aaaead"/><rect x="165" y="183" width="240" height="268" rx="56" fill="url(#body)" stroke="#d5d4cd" stroke-width="2"/><rect x="244" y="392" width="78" height="16" rx="8" fill="#343a3b"/><rect x="258" y="398" width="50" height="4" rx="2" fill="#848a89"/><text x="285" y="293" text-anchor="middle" font-family="sans-serif" font-size="22" letter-spacing="4" fill="#777e7c">USB-C</text></g>',
 'cable': '<g fill="none" stroke-linecap="round" filter="url(#shadow)"><path d="M195 190 C60 390 220 535 370 421 C500 322 370 187 235 285 C126 365 261 453 337 365" stroke="#bbbdb6" stroke-width="23"/><path d="M195 190 C60 390 220 535 370 421 C500 322 370 187 235 285 C126 365 261 453 337 365" stroke="#e2e3da" stroke-width="15"/></g><g transform="rotate(25 195 170)"><rect x="174" y="98" width="42" height="80" rx="12" fill="url(#body)"/><rect x="177" y="72" width="36" height="40" rx="9" fill="#a3aaa9"/><rect x="185" y="76" width="20" height="6" rx="3" fill="#424947"/></g><g transform="rotate(48 337 350)"><rect x="317" y="317" width="42" height="75" rx="12" fill="url(#body)"/><rect x="320" y="290" width="36" height="40" rx="9" fill="#a3aaa9"/></g>',
 'earbuds': '<g filter="url(#shadow)"><rect x="155" y="280" width="290" height="196" rx="80" fill="url(#body)" stroke="#d4d6d0"/><path d="M160 343 Q300 380 440 343" fill="none" stroke="#aeb4ac" stroke-width="3"/><circle cx="300" cy="406" r="4" fill="#728576"/><g transform="rotate(-18 225 200)"><rect x="216" y="158" width="35" height="117" rx="17" fill="url(#body)"/><ellipse cx="220" cy="158" rx="49" ry="37" fill="url(#body)"/><ellipse cx="190" cy="154" rx="11" ry="18" fill="#525956"/></g><g transform="rotate(18 375 200)"><rect x="350" y="158" width="35" height="117" rx="17" fill="url(#body)"/><ellipse cx="380" cy="158" rx="49" ry="37" fill="url(#body)"/><ellipse cx="410" cy="154" rx="11" ry="18" fill="#525956"/></g></g>',
 'case': '<g transform="rotate(-13 300 300)" filter="url(#shadow)"><rect x="180" y="75" width="240" height="450" rx="51" fill="#ced5c8" stroke="#9aa99b" stroke-width="9"/><rect x="197" y="93" width="206" height="414" rx="37" fill="#e8ebe3" stroke="#b8c3b6" stroke-width="3"/><rect x="213" y="110" width="99" height="113" rx="25" fill="#f5f6f1" stroke="#a1afa0" stroke-width="6"/><circle cx="300" cy="330" r="73" fill="none" stroke="#c7d0c3" stroke-width="12"/><path d="M300 419v31" stroke="#c7d0c3" stroke-width="12" stroke-linecap="round"/></g>',
 'powerbank': '<g transform="rotate(-13 300 300)" filter="url(#shadow)"><rect x="172" y="101" width="256" height="405" rx="48" fill="url(#dark)"/><rect x="194" y="117" width="212" height="375" rx="33" fill="none" stroke="#737b76" stroke-opacity=".5"/><rect x="266" y="137" width="68" height="14" rx="7" fill="#111715"/><text x="300" y="275" fill="#dce3dc" font-family="sans-serif" font-size="44" text-anchor="middle">100</text><text x="300" y="307" fill="#93a19a" font-family="sans-serif" font-size="14" text-anchor="middle">POWER / USB-C</text><path d="M307 358l-24 32h20l-13 31 33-41h-21z" fill="#a9bb99"/></g>',
}
for name, body in art.items():
    (PRODUCTS / f'{name}.svg').write_text(svg(body), encoding='utf-8')
missing = {'xiaomi-14t':'Xiaomi 14T','redmi-note-13-pro-5g':'Redmi Note 13 Pro 5G','poco-f6':'POCO F6','honor-200':'HONOR 200','honor-200-pro':'HONOR 200 Pro','honor-magic6-pro':'HONOR Magic6 Pro','honor-x9b':'HONOR X9b'}
for slug,name in missing.items():
    body = f'<rect x="208" y="94" width="184" height="300" rx="30" fill="none" stroke="#b8bdb5" stroke-width="3" stroke-dasharray="8 9"/><path d="M272 208h56v44h-56z M282 198v10m36-10v10" fill="none" stroke="#9aa296" stroke-width="3"/><text x="300" y="453" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" fill="#596456">{html.escape(name)}</text><text x="300" y="495" text-anchor="middle" font-family="Tahoma,Arial,sans-serif" font-size="20" fill="#76806f" direction="rtl">تصویر تأییدشده آماده نیست</text>'
    (PRODUCTS / f'{slug}-unavailable.svg').write_text(svg(body), encoding='utf-8')
for i in range(1,7):
    colors = ['#e5e9dc','#e7e3d7','#dce3dd','#e7ddd5','#dce1cf','#e7e7df']
    objects = [
      '<rect x="375" y="35" width="190" height="355" rx="30" fill="url(#dark)" transform="rotate(14 470 210)"/><rect x="290" y="100" width="160" height="300" rx="25" fill="url(#body)" transform="rotate(-12 370 250)"/>',
      '<g fill="url(#dark)"><rect x="340" y="95" width="115" height="220" rx="15"/><rect x="475" y="140" width="115" height="220" rx="15"/></g><g font-family="sans-serif" font-size="30" fill="#d4dccd"><text x="362" y="218">128</text><text x="497" y="263">256</text></g>',
      '<g transform="translate(190 -70) scale(.9)">'+art['charger']+'</g>',
      '<circle cx="465" cy="220" r="135" fill="url(#dark)"/><circle cx="465" cy="220" r="102" fill="#6a7469"/><circle cx="465" cy="220" r="75" fill="#272e2b"/><circle cx="465" cy="220" r="44" fill="#839591"/><circle cx="444" cy="195" r="21" fill="#b8c8bd" fill-opacity=".5"/>',
      '<g transform="translate(180 -65) scale(.85)">'+art['powerbank']+'</g>',
      '<g transform="rotate(9 470 220)"><rect x="345" y="65" width="225" height="320" rx="20" fill="#f4f4ee"/><path d="M385 150l12 12 22-28 M385 220l12 12 22-28 M385 290l12 12 22-28" fill="none" stroke="#657855" stroke-width="8" stroke-linecap="round"/><path d="M443 150h83 M443 220h83 M443 290h83" stroke="#c4ccba" stroke-width="8" stroke-linecap="round"/></g>',
    ]
    body = '<circle cx="620" cy="80" r="250" fill="#fff" opacity=".23"/><circle cx="130" cy="390" r="180" fill="#fff" opacity=".21"/>'+objects[i-1]+f'<text x="67" y="111" font-family="Arial,sans-serif" font-size="16" letter-spacing="4" fill="#66745f">THE EDIT / 0{i}</text><path d="M70 145h80" stroke="#748264" stroke-width="2"/>'
    (EDITORIAL / f'guide-{i}.svg').write_text(svg(body,800,440,colors[i-1]),encoding='utf-8')

mapping = {'File:IPhone 16 Pro Vector.svg':'iphone-16-pro.svg','File:IPhone 16 Pro Max Vector.svg':'iphone-16-pro-max.svg','File:IPhone 16 Vector.svg':'iphone-16.svg','File:IPhone 15 Vector.svg':'iphone-15.svg','File:S24 Onyx Black.png':'galaxy-s24.png','File:Samsung S24 Ultra Phone.png':'galaxy-s24-ultra.png','File:Galaxy S23 FE.png':'galaxy-s23-fe.png','File:Samsung Galaxy A55 5G 2024 (cropped).jpg':'galaxy-a55.jpg','File:Google Pixel 9 (Peony) front.svg':'pixel-9.svg','File:Google Pixel 9 Pro (Hazel) front.svg':'pixel-9-pro.svg','File:Google Pixel 8 front.svg':'pixel-8.svg','File:Google Pixel 8a front.svg':'pixel-8a.svg','File:Xiaomi 14 rear (July 10, 2026).jpg':'xiaomi-14.jpg'}
credits=[]
for name in ('image-sources.json','image-sources-extra.json'):
    metadata=json.loads((ROOT/'src/data'/name).read_text(encoding='utf-8-sig'))
    for page in metadata['query']['pages'].values():
        if page['title'] not in mapping: continue
        info=page['imageinfo'][0]; meta=info['extmetadata']; filename=mapping[page['title']]
        credits.append({'file':'/products/'+filename,'title':page['title'][5:],'author':html.unescape(re.sub('<[^>]+>','',meta['Artist']['value'])),'source':info['descriptionurl'],'license':meta['LicenseShortName']['value'],'licenseUrl':meta['LicenseUrl']['value'],'changes':'Unmodified SVG; raster files downloaded at reduced resolution where available.'})
(ROOT/'src/data/asset-credits.json').write_text(json.dumps(credits,ensure_ascii=False,indent=2),encoding='utf-8')
doc = '''# Catalog, image rights, and editorial sources

Prepared 2026-10-27 for a local demo. All 32 prices, inventory values, discounts, and availability are fictional seed data, in integer Toman. No market-price or current-stock claim is made. Accessories are 12 generic demo SKUs, not genuine branded listings. Their SVGs are original schematic illustrations; the stated demo specifications must be replaced with supplier-confirmed details before selling real goods.

## Model-specific images

13 phone models use exact-model Wikimedia Commons photographs or illustrations. These are not manufacturer endorsements. Image color need not match the selected variant; the product alt text says so. No claim is made that a photograph shows every offered capacity. Attribution below and the linked licenses must accompany redistribution. CC BY-SA adaptations retain the applicable ShareAlike license. Source metadata is retained in `src/data/image-sources*.json` and compact display-ready credits in `src/data/asset-credits.json`.

| Local asset | Work / author | License | Source | Changes |
|---|---|---|---|---|
'''
for credit in credits:
    doc+=f"| `{credit['file']}` | {credit['title']} — {credit['author']} | [{credit['license']}]({credit['licenseUrl']}) | [Wikimedia file page]({credit['source']}) | {credit['changes']} |\n"
doc+='''
## Explicit image gaps

Xiaomi 14T, Redmi Note 13 Pro 5G, POCO F6, HONOR 200, HONOR 200 Pro, HONOR Magic6 Pro and HONOR X9b display a clearly labeled, model-named unavailable-image card. No image of a different phone is substituted. The placeholder is an original neutral dashed outline, not a purported product render. Official product pages below are the sources to consult when obtaining licensed imagery. Manufacturer image reuse rights were not established, so their copyrighted renders were not bundled. Wikimedia rate limits were observed while collecting assets; successful local downloads are checked separately.

## Original SVG art

`public/products/charger.svg`, `cable.svg`, `earbuds.svg`, `case.svg`, `powerbank.svg`, the seven unavailable-image cards, and `public/editorial/guide-1.svg` through `guide-6.svg` are original code-generated schematic SVG illustrations created for this project. They contain no downloaded brand logos, stock photos, or external dependencies. Six Persian guides are original editorial text, not copied product reviews. The covers are conceptual, not product photography. `src/data/build-assets.py` regenerates this art and attribution records.

## Official specification sources

Specifications are intentionally short. Battery capacity is typical where specified; Apple battery duration is its video-playback laboratory claim, not a comparable capacity figure. OS family is given without claiming a currently installed release. Samsung S24 and S23 FE specify the international Exynos versions. Regional hardware, memory configurations, colors, box contents, and software availability must be checked against real supplier SKUs before launch. Available demo variants are not claims of actual inventory.

| Product | Primary specification reference |
|---|---|
| iPhone 16 Pro | https://support.apple.com/en-us/121031 |
| iPhone 16 Pro Max | https://support.apple.com/en-us/121032 |
| iPhone 16 | https://support.apple.com/en-us/121029 |
| iPhone 15 | https://support.apple.com/en-us/111831 |
| Galaxy S24 Ultra / S24 | https://www.samsungsvc.co.kr/solution/1848050 ; https://www.samsung.com/global/galaxy/galaxy-s24/specs/ |
| Galaxy S23 FE | https://www.samsung.com/in/support/mobile-devices/specifications-for-the-new-galaxy-s23-fe/ |
| Galaxy A55 5G | https://www.samsung.com/uk/smartphones/galaxy-a/galaxy-a55-5g-awesome-iceblue-128gb-sm-a556blbaeub/ |
| Xiaomi 14 | https://www.mi.com/uk/product/xiaomi-14/specs/ |
| Xiaomi 14T | https://www.mi.com/global/product/xiaomi-14t/specs/ |
| Redmi Note 13 Pro 5G | https://www.mi.com/ae-en/product/redmi-note-13-pro-5g/specs/ |
| POCO F6 | https://www.mi.com/global/product/poco-f6/specs/ |
| HONOR 200 | https://www.honor.com/global/phones/honor-200/ ; https://www.honor.com/sa-en/phones/honor-200/spec/ |
| HONOR 200 Pro | https://www.honor.com/global/phones/honor-200-pro/ ; https://www.honor.com/sa-en/phones/honor-200-pro/spec/ |
| HONOR Magic6 Pro | https://www.honor.com/global/phones/honor-magic6-pro/ |
| HONOR X9b | https://www.honor.com/global/phones/honor-x9b/ |
| Google Pixel 9 / 9 Pro / 8 / 8a | https://support.google.com/pixelphone/answer/7158570?hl=en |

The editorial selection checklist and storage/camera/charging explanations are general, original guidance. Manufacturer documentation should remain the reference for exact charging behavior and battery care. No legal registration, payment, shipping, warranty, or operator service promises are asserted by the sample catalog.
'''
(ROOT/'docs/ASSETS.md').write_text(doc,encoding='utf-8')
print(f'Created 5 accessory illustrations, 7 honest image-gap cards, 6 covers, and {len(credits)} image credit records.')
