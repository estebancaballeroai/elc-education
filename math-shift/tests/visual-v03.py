from pathlib import Path
from playwright.sync_api import sync_playwright
import re,base64,mimetypes
ROOT=Path(__file__).resolve().parents[1]
OUT=Path('/mnt/data/mathshift-v03-screens');OUT.mkdir(exist_ok=True)

def inline_assets(s):
 def f(m):
  path=m.group(1);data=(ROOT/path).read_bytes()
  mime=mimetypes.guess_type(path)[0] or 'application/octet-stream'
  return 'data:'+mime+';base64,'+base64.b64encode(data).decode('ascii')
 return re.sub(r'(assets/[-a-zA-Z0-9/.]+\.(?:png|webp))',f,s)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
 html=(ROOT/'index.html').read_text();html=re.sub(r'<script src="[^"]+" defer></script>','',html);html=re.sub(r'<link rel="stylesheet"[^>]+/>','',html)
 page.set_content(inline_assets(html),wait_until='load')
 for name in ['styles.css','v03.css']:page.add_style_tag(content=inline_assets((ROOT/name).read_text()))
 for name in ['content.js','engine.js','app.js']:page.add_script_tag(content=(ROOT/name).read_text())
 page.wait_for_timeout(550)
 assert len(errors)==0,errors
 page.screenshot(path=str(OUT/'v03-map-with-assets.png'),full_page=False)
 page.locator('.station-card[data-id="nombres"]').click();page.wait_for_timeout(500)
 page.evaluate('window.scrollTo(0,360)');page.wait_for_timeout(250)
 assert page.evaluate('getComputedStyle(document.querySelector("#diagram")).backgroundImage.includes("data:image/webp;base64")')
 page.screenshot(path=str(OUT/'v03-nombres-with-assets.png'),full_page=False)
 page.locator('[data-action="go-map"]').first.click()
 page.locator('.station-card[data-id="litteral"]').click();page.locator('[data-action="algebra-step"][data-choice="correct"]').click()
 page.evaluate('window.scrollTo(0,370)');page.wait_for_timeout(350)
 page.screenshot(path=str(OUT/'v03-litteral-with-assets.png'),full_page=False)
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
 assert len(errors)==0,errors
 b.close()
 print('VISUAL OK: actual asset data loaded, 390px mobile, no horizontal overflow or JS errors.')
