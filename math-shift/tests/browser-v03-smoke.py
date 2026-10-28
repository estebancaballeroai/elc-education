from playwright.sync_api import sync_playwright
from pathlib import Path
import json,sys,os
ROOT=Path(__file__).resolve().parents[1]
import re,base64,mimetypes

def inline_assets(text):
 def sub(m):
  path=m.group(1)
  content=(ROOT/path).read_bytes()
  mime=mimetypes.guess_type(path)[0] or 'application/octet-stream'
  return f'data:{mime};base64,{base64.b64encode(content).decode("ascii")}'
 return re.sub(r'(assets/[-a-zA-Z0-9/.]+\.(?:png|webp))',sub,text)

def load_app(page):
 html=(ROOT/'index.html').read_text()
 html=re.sub(r'<script src=\"[^\"]+\" defer></script>','',html)
 html=re.sub(r'<link rel=\"stylesheet\"[^>]+/>','',html)
 page.set_content(html,wait_until='load')
 page.add_style_tag(content=(ROOT/'styles.css').read_text())
 page.add_style_tag(content=(ROOT/'v03.css').read_text())
 for f in ['content.js','engine.js','app.js']:
  page.add_script_tag(content=(ROOT/f).read_text())
 page.wait_for_selector('.station-card')

OUT=Path('/mnt/data/mathshift-v03-screens');OUT.mkdir(exist_ok=True)

def go(page,action):page.locator(f'[data-action="{action}"]').first.click()
def open_station(page,station):page.locator(f'.station-card[data-id="{station}"]').click()
def open_question(page,question):
 go(page,'go-revision')
 go(page,'filter-tous')
 page.locator(f'[data-action="open-question"][data-id="{question}"]').click()

with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--disable-dev-shm-usage','--no-sandbox','--allow-file-access-from-files'])
 for size in [int(n) for n in os.environ.get('MATHSHIFT_VIEWPORTS','').split(',') if n.strip()]:
  errors=[]
  page=browser.new_page(viewport={'width':size,'height':800},device_scale_factor=1)
  page.on('pageerror',lambda e:errors.append(str(e)))
  load_app(page)
  assert page.locator('.station-card').count()==7,(size,page.locator('.station-card').count())
  assert 'Sept quartiers' in page.content()
  if size in [390,1280]:page.screenshot(path=str(OUT/f'home-{size}.png'),full_page=False)
  open_station(page,'nombres')
  assert page.locator('#answer-number').count()==1,('number field',size)
  page.locator('#answer-number').fill('32')
  page.locator('button[type="submit"]').first.click()
  assert page.locator('.feedback.success').count()==1,('number success',size)
  go(page,'next')
  assert 'Cristal des puissances 2' in page.content()
  go(page,'go-map')
  open_station(page,'litteral')
  assert page.locator('[data-action="algebra-step"][data-choice="correct"]').count()==1,('algebra step',size)
  page.locator('[data-action="algebra-step"][data-choice="correct"]').click()
  assert page.locator('#alg-a').count()==1,('algebra field',size)
  if size in [320,390]:page.screenshot(path=str(OUT/f'algebra-{size}.png'),full_page=False)
  page.locator('#alg-a').fill('3')
  page.locator('#alg-b').fill('12')
  page.locator('button[type="submit"]').first.click()
  assert page.locator('.feedback.success').count()==1,('algebra success',size)
  dims=page.evaluate('({doc:document.documentElement.scrollWidth,view:innerWidth})')
  assert dims['doc']<=dims['view']+1,(size,dims)
  assert not errors,('JS errors',size,errors)
  page.close()
  print('SCREEN',size,'OK')
 if os.environ.get('SKIP_SCENARIOS')=='1':
  browser.close();print('VIEWPORTS OK');sys.exit(0)
 page=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
 page.set_default_timeout(4000)
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 load_app(page)
 print('SCENARIO science',flush=True)
 open_question(page,'nombres-science-1')
 page.locator('#num-mantissa').fill('4,2')
 page.locator('#num-exponent').fill('-4')
 page.locator('button[type="submit"]').click()
 assert page.locator('.feedback.success').count()==1,'scientific success'
 print('SCENARIO simplify',flush=True)
 open_question(page,'nombres-simplifier-1')
 page.locator('#answer-number').fill('5')
 page.locator('button[type="submit"]').click()
 assert page.locator('.feedback.incorrect').count()==1,'wrong root reject'
 page.locator('#answer-number').fill('6')
 page.locator('button[type="submit"]').click()
 assert page.locator('.feedback.success').count()==1,'root correct accept'
 print('SCENARIO factor',flush=True)
 open_question(page,'litteral-factoriser-1')
 page.locator('[data-action="algebra-step"][data-choice="wrong"]').first.click()
 assert page.locator('.feedback.incorrect').count()==1,'wrong factor method'
 page.locator('[data-action="algebra-step"][data-choice="correct"]').click()
 page.locator('#alg-g').fill('3');page.locator('#alg-a').fill('2');page.locator('#alg-b').fill('3')
 page.locator('button[type="submit"]').click()
 assert page.locator('.feedback.success').count()==1,'factor right'
 print('SCENARIO double',flush=True)
 open_question(page,'litteral-double-5')
 page.locator('[data-action="algebra-step"][data-choice="correct"]').click()
 page.locator('#alg-a').fill('0');page.locator('#alg-b').fill('-9')
 page.locator('button[type="submit"]').click()
 assert page.locator('.feedback.success').count()==1,'double distributive'
 go(page,'go-map')
 open_station(page,'pont')
 assert 'Passerelle' in page.content(), 'old station'
 go(page,'go-progress')
 assert '88' in page.content(),'progress updated'
 assert not errors,errors
 print('SCENARIOS OK scientific, simplification, factor, double, old geometry and progress')
 page.close()
 browser.close()
print('ALL BROWSER SMOKES PASSED')
