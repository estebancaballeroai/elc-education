"""Vérification visuelle et preuve de chargement des assets avec vrais bytes locaux."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from urllib.parse import urlparse
import re,base64,mimetypes
ROOT=Path(__file__).resolve().parents[1]
OUT=Path('/mnt/data/mathshift-v04-screens');OUT.mkdir(parents=True,exist_ok=True)
def inline_art(s):
 def f(m):
  name=m.group(1);mime=mimetypes.guess_type(name)[0] or 'application/octet-stream'
  return 'data:'+mime+';base64,'+base64.b64encode((ROOT/name).read_bytes()).decode()
 return re.sub(r'(assets/[-a-zA-Z0-9/.]+\.(?:png|webp))',f,s)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
 errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
 def local_art(route):
  u=urlparse(route.request.url)
  rel=u.path.lstrip('/')
  file=(ROOT/rel).resolve()
  if not file.is_relative_to(ROOT) or not file.is_file():route.fulfill(status=404,body='not found');return
  route.fulfill(status=200,body=file.read_bytes(),content_type=mimetypes.guess_type(str(file))[0] or 'application/octet-stream')
 page.route('https://mathshift-game.invalid/**',local_art)
 html=(ROOT/'index.html').read_text()
 html=re.sub(r'<script src="[^"]+" defer></script>','',html)
 html=re.sub(r'<link rel="stylesheet"[^>]+/>','',html)
 html=re.sub(r'<link rel="preload"[^>]+/>','',html)
 html=html.replace('<head>','<head><base href="https://mathshift-game.invalid/">',1)
 page.set_content(html,wait_until='load')
 for css in ('styles.css','v03.css','v04.css'):page.add_style_tag(content=inline_art((ROOT/css).read_text()))
 for js in ('content.js','engine.js','app.js'):page.add_script_tag(content=(ROOT/js).read_text())
 page.wait_for_selector('.hero-bot')
 page.wait_for_function("Array.from(document.images).every(x => x.complete && x.naturalWidth > 0)")
 assert page.locator('.hero-person').evaluate('(img)=>img.naturalWidth')>50
 page.screenshot(path=str(OUT/'v04-home-full-art.png'),full_page=False)
 for station in ('statistiques','hasard'):
  page.locator(f'.station-card[data-id="{station}"]').click()
  page.locator('#diagram').scroll_into_view_if_needed()
  page.wait_for_timeout(200)
  bg=page.locator('.'+('stats-machine' if station=='statistiques' else 'chance-machine')).evaluate('(e)=>getComputedStyle(e).backgroundImage')
  assert 'data:image/webp;base64' in bg,('real artwork missing',station)
  assert page.locator('.lesson-card').count()==1
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
  page.screenshot(path=str(OUT/f'v04-{station}-full-art.png'),full_page=False)
  page.locator('[data-action="go-map"]').first.click()
 assert not errs,errs
 print('VISUAL OK: 2 original WebP actually loaded as CSS scene backgrounds; protagonist/robot images served; no overflow')
 browser.close()
