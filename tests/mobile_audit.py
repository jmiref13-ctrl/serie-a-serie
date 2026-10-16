"""Recorre todas las pantallas a anchos de móvil y detecta desbordes, toques pequeños y campos que hacen zoom en iPhone."""
import json, subprocess, sys, time, pathlib
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '/tmp')
WIDTHS = [int(x) for x in (sys.argv[2] if len(sys.argv) > 2 else '320,375').split(',')]
MOCK = (ROOT / 'tests' / 'mock-supabase.js').read_text()
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8766', '-d', str(ROOT / 'public')], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(0.8)
CHECK = """() => {
  const W = document.documentElement.clientWidth, out = {overflow: document.documentElement.scrollWidth - W, wide: [], small: [], zoom: []};
  document.querySelectorAll('#app *, #nav *, #acct *').forEach(e => {
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) return;
    const cs = getComputedStyle(e); if (cs.visibility === 'hidden') return;
    let p = e.parentElement, clipped = false; while (p && p !== document.body){ const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden'){ clipped = true; break; } p = p.parentElement; }
    if (!clipped && (r.right > W + 1 || r.left < -1)) out.wide.push((e.tagName + '.' + e.className + ' ' + (e.textContent||'').trim().slice(0,30)).slice(0,80) + ' R=' + Math.round(r.right));
    if (/^(BUTTON|A|SELECT)$/.test(e.tagName) || (e.tagName === 'INPUT' && !['checkbox','radio','hidden'].includes(e.type))) { if (r.height < 36 && r.width > 0) out.small.push(e.tagName + ' "' + ((e.textContent||e.value||e.getAttribute('aria-label')||'').trim().slice(0,25)) + '" ' + Math.round(r.width) + 'x' + Math.round(r.height)); }
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.tagName) && parseFloat(cs.fontSize) < 16) out.zoom.push(e.tagName + ' ' + (e.getAttribute('aria-label')||e.placeholder||'') + ' ' + cs.fontSize);
  });
  out.wide = [...new Set(out.wide)].slice(0,8); out.small = [...new Set(out.small)].slice(0,12); out.zoom = [...new Set(out.zoom)].slice(0,6);
  return out;
}"""
def report(pg, name, w):
    r = pg.evaluate(CHECK)
    pg.screenshot(path=str(OUT / f'{w}_{name}.png'), full_page=True)
    print(f'[{w}] {name}: overflow={r["overflow"]} wide={len(r["wide"])} small={len(r["small"])} zoom={len(r["zoom"])}')
    for k in ('wide','small','zoom'):
        for x in r[k]: print('     ', k, x)
def login(pg, u):
    pg.locator('input[autocomplete=username]').fill(u); pg.locator('input[type=password]').fill('test1234')
    pg.get_by_role('button', name='Entrar').click(); pg.wait_for_timeout(800)
def logout(pg):
    pg.evaluate("localStorage.removeItem('mock_session')"); pg.reload(); pg.wait_for_timeout(600)
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        for w in WIDTHS:
            ctx = b.new_context(viewport={'width': w, 'height': 740}, device_scale_factor=2, is_mobile=True, has_touch=True)
            ctx.add_init_script('window.__mockSeed = {};')
            ctx.route('**/vendor/supabase.js', lambda r: r.fulfill(body=MOCK, content_type='application/javascript'))
            ctx.route('**/config.js', lambda r: r.fulfill(body="window.SAS_CONFIG={url:'https://x.supabase.co',anonKey:'k'};", content_type='application/javascript'))
            ctx.route('https://fonts.**', lambda r: r.abort())
            pg = ctx.new_page(); pg.goto('http://localhost:8766/'); pg.wait_for_timeout(600)
            report(pg, 'login', w)
            login(pg, 'javi@test.es'); report(pg, 'coach_empty', w)
            pg.get_by_role('button', name='Dar de alta un cliente').click(); pg.wait_for_timeout(200); report(pg, 'alta_form', w)
            pg.get_by_placeholder('Nombre').fill('Pepe García'); pg.get_by_role('button', name='Crear cliente').click(); pg.wait_for_timeout(800)
            report(pg, 'alta_ok', w); pg.get_by_role('button', name='Hecho').click(); pg.wait_for_timeout(300)
            pg.get_by_text('Pepe García').first.click(); pg.wait_for_timeout(400); report(pg, 'ficha_semana', w)
            pg.get_by_role('tab', name='Plan').click(); pg.wait_for_timeout(300)
            pg.locator('select[aria-label="Planificación"]').select_option('bloque1'); pg.locator('input[aria-label="Fecha de inicio"]').fill('2026-10-12')
            pg.get_by_role('button', name='Asignar plan').click(); pg.wait_for_timeout(800); report(pg, 'ficha_semana_plan', w)
            pg.get_by_role('tab', name='Plan').click(); pg.wait_for_timeout(300); report(pg, 'ficha_plan', w)
            if pg.get_by_role('button', name='Poner kilos objetivo').count():
                pg.get_by_role('tab', name='Semana').click(); pg.wait_for_timeout(200)
                pg.get_by_role('button', name='Poner kilos objetivo').click(); pg.wait_for_timeout(300); report(pg, 'kilos_objetivo', w); pg.go_back() if False else None
            for t in ('Mensajes','Progreso'):
                tab = pg.get_by_role('tab', name=t)
                if tab.count(): tab.click(); pg.wait_for_timeout(300); report(pg, 'ficha_' + t.lower(), w)
            pg.get_by_role('button', name='Planes').click(); pg.wait_for_timeout(400); report(pg, 'planes', w)
            ed = pg.get_by_role('button', name='Editar').first
            if ed.count(): ed.click(); pg.wait_for_timeout(500); report(pg, 'editor', w)
            # cliente
            uid = pg.evaluate("Object.keys(JSON.parse(localStorage.mock_docs)).find(k => /^clients\\/4444[^/]+$/.test(k)).split('/')[1]")
            pg.evaluate("(u) => { const x = JSON.parse(localStorage.mock_users); x.forEach(v => v.password = 'test1234'); localStorage.mock_users = JSON.stringify(x); }", uid)
            logout(pg); login(pg, 'pepe'); report(pg, 'cliente_home', w)
            pg.locator('button.day').first.click(); pg.wait_for_timeout(500); report(pg, 'sesion', w)
            nc = pg.get_by_role('button', name='No puedo hacerlo')
            if nc.count(): nc.first.click(); pg.wait_for_timeout(300); report(pg, 'no_puedo', w); pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
            pg.goto('http://localhost:8766/'); pg.wait_for_timeout(800)
            pg.get_by_role('button', name='Progreso').click(); pg.wait_for_timeout(400); report(pg, 'cliente_progreso', w)
            pg.get_by_role('button', name='Mensajes').click(); pg.wait_for_timeout(400); report(pg, 'cliente_chat', w)
            ctx.close()
        b.close()
finally:
    srv.terminate()
