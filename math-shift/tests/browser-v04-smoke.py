"""Tests Playwright réels sur les JS/CSS/assets du jeu, en mémoire (sans serveur externe)."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import re,base64,mimetypes,os,json
ROOT=Path(__file__).resolve().parents[1]
OUT=Path('/mnt/data/mathshift-v04-screens')
OUT.mkdir(parents=True,exist_ok=True)

def inline_assets(s):
 def f(m):
  path=m.group(1);raw=(ROOT/path).read_bytes();mime=mimetypes.guess_type(path)[0] or 'application/octet-stream'
  return 'data:'+mime+';base64,'+base64.b64encode(raw).decode('ascii')
 return re.sub(r'(assets/[-a-zA-Z0-9/.]+\.(?:png|webp))',f,s)

def load_app(page):
 html=(ROOT/'index.html').read_text(encoding='utf8')
 html=re.sub(r'<script src="[^"]+" defer></script>','',html)
 html=re.sub(r'<link rel="stylesheet"[^>]+/>','',html)
 html=re.sub(r'<link rel="preload"[^>]+/>','',html)
 page.set_content(inline_assets(html),wait_until='load')
 for name in ['styles.css','v03.css','v04.css']:
  page.add_style_tag(content=inline_assets((ROOT/name).read_text(encoding='utf8')))
 for name in ['content.js','engine.js','app.js']:
  page.add_script_tag(content=(ROOT/name).read_text(encoding='utf8'))
 page.wait_for_selector('.station-card')

def click_action(page,action):page.locator(f'[data-action="{action}"]').first.click()
def station(page,kind):
 click_action(page,'go-map')
 page.locator(f'.station-card[data-id="{kind}"]').click()
def question(page,qid):
 click_action(page,'go-revision');click_action(page,'filter-tous')
 page.locator(f'[data-action="open-question"][data-id="{qid}"]').click()
def answer(page,value):
 page.locator('#answer-number').fill(str(value));page.locator('#answer-form button[type="submit"]').click()
def fraction(page,num,den):
 page.locator('#prob-num').fill(str(num));page.locator('#prob-den').fill(str(den));page.locator('#answer-form button[type="submit"]').click()
def success(page):assert page.locator('.feedback.success').count()==1

def no_overflow(page,width):
 bounds=page.evaluate('({width:document.documentElement.scrollWidth,screen:window.innerWidth})')
 assert bounds['width']<=bounds['screen']+1,('horizontal overflow',width,bounds)

with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 widths=[int(x) for x in os.environ.get('MATHSHIFT_VIEWPORTS','320,390,768,1280').split(',') if x.strip()]
 for width in widths:
  page=browser.new_page(viewport={'width':width,'height':844},device_scale_factor=1)
  errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
  load_app(page)
  assert page.locator('.station-card').count()==9,('stations',width)
  assert page.locator('.hero-quick').inner_text().find('122')>=0
  no_overflow(page,width)
  if width in (390,1280):page.screenshot(path=str(OUT/f'home-{width}.png'),full_page=False)
  station(page,'statistiques')
  assert page.locator('#stats-range').count()==1
  page.locator('#stats-range').fill('7')
  assert page.locator('#answer-number').input_value()=='7'
  if width in (320,390):
   page.evaluate('window.scrollTo(0,350)')
   page.screenshot(path=str(OUT/f'stats-bar-{width}.png'),full_page=False)
  page.locator('#answer-form button[type="submit"]').click();success(page)
  no_overflow(page,width)
  station(page,'hasard')
  assert page.locator('#prob-num').count()==1
  click_action(page,'simulate-10')
  assert '10 essais' in page.locator('.chance-frequency').inner_text()
  if width in (320,390):
   page.evaluate('window.scrollTo(0,340)')
   page.screenshot(path=str(OUT/f'hasard-urne-{width}.png'),full_page=False)
  fraction(page,1,2);success(page)
  no_overflow(page,width)
  assert not errors,('JS errors',width,errors)
  print('VIEWPORT',width,'OK')
  page.close()
 if os.environ.get('MATHSHIFT_SKIP_SCENARIOS')=='1':
  browser.close();print('VIEWPORTS OK');raise SystemExit(0)
 # Étapes avancées dans un navigateur mobile : erreurs, indices, valeurs décimales et roue.
 page=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
 page.set_default_timeout(5000)
 errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
 load_app(page)
 print('SCENARIO barre incorrecte / correction',flush=True)
 question(page,'stats-barre-2');answer(page,7)
 assert page.locator('.feedback.incorrect').count()==1
 answer(page,8);success(page)
 print('SCENARIO moyenne FR',flush=True)
 question(page,'stats-moyenne-3');answer(page,'7,5');success(page)
 print('SCENARIO mediane paire',flush=True)
 question(page,'stats-mediane-2');click_action(page,'stats-sort')
 assert page.locator('.stats-token.center').count()==2
 answer(page,'8,5');success(page)
 print('SCENARIO etendue',flush=True)
 question(page,'stats-etendue-3');click_action(page,'stats-extrema')
 assert page.locator('.stats-token.extreme').count()==2
 answer(page,16);success(page)
 print('SCENARIO probabilité dés et fraction équivalente',flush=True)
 question(page,'proba-de-2');fraction(page,1,6);success(page)
 print('SCENARIO roue simulation obligatoire',flush=True)
 question(page,'proba-roue-1');fraction(page,1,2)
 assert page.locator('.feedback.hint').count()==1
 click_action(page,'simulate-10')
 assert '10 essais' in page.locator('.chance-frequency').inner_text()
 fraction(page,2,4);success(page)
 page.evaluate('window.scrollTo(0,310)')
 page.screenshot(path=str(OUT/'hasard-roue-390.png'),full_page=False)
 print('SCENARIO doubles tirages avec remise',flush=True)
 question(page,'proba-double-2');fraction(page,3,25)
 assert page.locator('.feedback.incorrect').count()==1
 fraction(page,6,25);success(page)
 print('SCENARIO moteur ancien et guide',flush=True)
 question(page,'pont-1');assert page.locator('#answer-range').count()==1
 click_action(page,'go-guide')
 assert 'statistiques et les probabilités' in page.content()
 no_overflow(page,390)
 assert not errors,errors
 page.close();browser.close()
 print('OK — parcours mobile, roue, simulations, 4 thèmes statistiques, anciennes missions, 0 erreur JS')
