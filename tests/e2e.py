"""Prueba de punta a punta con Supabase simulado: entrada, alta de cliente, asignar plan, registrar sesión, permisos."""
import json, subprocess, sys, time, pathlib
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '/tmp')
seed = {f'library/{k}': v for k, v in json.load(open(ROOT / 'docs' / 'planes.json')).items()} if (ROOT/'docs'/'planes.json').exists() else {}
MOCK = (ROOT / 'tests' / 'mock-supabase.js').read_text()
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8765', '-d', str(ROOT / 'public')], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(0.8)
errors = []
PEPE = '22222222-2222-4222-8222-222222222222'
def login(pg, email):
    pg.locator('input[autocomplete=username]').fill(email); pg.locator('input[type=password]').fill('test1234')
    pg.get_by_role('button', name='Entrar').click(); pg.wait_for_timeout(700)
def logout(pg):
    pg.get_by_role('button', name='Cerrar sesión').click(); pg.wait_for_timeout(700)
try:
    with sync_playwright() as p:
        b = p.chromium.launch(); ctx = b.new_context(viewport={'width':390,'height':844})
        ctx.add_init_script('window.__mockSeed = {};')
        ctx.route('**/vendor/supabase.js', lambda r: r.fulfill(body=MOCK, content_type='application/javascript'))
        ctx.route('**/config.js', lambda r: r.fulfill(body="window.SAS_CONFIG={url:'https://x.supabase.co',anonKey:'k'};", content_type='application/javascript'))
        ctx.route('https://fonts.**', lambda r: r.abort())
        pg = ctx.new_page()
        pg.on('pageerror', lambda e: errors.append(str(e)))
        pg.on('console', lambda m: errors.append('console:' + m.text) if m.type == 'error' and 'fonts' not in m.text and 'ERR_FAILED' not in m.text else None)
        pg.goto('http://localhost:8765/'); pg.wait_for_timeout(600)
        pg.screenshot(path=str(OUT/'e_login.png'))
        # contraseña mala
        pg.locator('input[autocomplete=username]').fill('pepe@test.es'); pg.locator('input[type=password]').fill('mal')
        pg.get_by_role('button', name='Entrar').click(); pg.wait_for_timeout(300)
        print('bad login:', pg.locator('.err').first.inner_text())
        # Pepe entra por primera vez
        login(pg, 'pepe@test.es')
        pg.screenshot(path=str(OUT/'e_welcome.png'))
        pg.locator('#myname').fill('Pepe'); pg.get_by_role('button', name='Empezar').click(); pg.wait_for_timeout(600)
        print('pepe home:', pg.locator('.big').first.inner_text())
        logout(pg)
        # Javi asigna plan
        login(pg, 'javi@test.es')
        pg.screenshot(path=str(OUT/'e_coach.png'), full_page=True)
        pg.get_by_text('Pepe').first.click(); pg.wait_for_timeout(300)
        pg.get_by_role('tab', name='Plan').click(); pg.wait_for_timeout(300)
        pg.locator('select[aria-label="Planificación"]').select_option('bloque1')
        pg.locator('input[aria-label="Fecha de inicio"]').fill('2026-10-12')
        pg.get_by_role('button', name='Asignar plan').click(); pg.wait_for_timeout(800)
        pg.get_by_role('tab', name='Plan').click(); pg.wait_for_timeout(300); pg.locator('input[id^=hip-]').check(); pg.wait_for_timeout(400)
        st = pg.evaluate("JSON.parse(localStorage.mock_docs)")
        print('client doc:', {k: st[f'clients/{PEPE}'].get(k) for k in ('planTitle','startDate','weeks','hip')})
        logout(pg)
        # Pepe registra una sesión
        login(pg, 'pepe@test.es')
        pg.screenshot(path=str(OUT/'e_pepe_home.png'), full_page=True)
        pg.locator('button.day').first.click(); pg.wait_for_timeout(400)
        pg.locator('input[aria-label="Kilos, serie 1 de Press banca"]').fill('80')
        pg.locator('input[aria-label="Repeticiones, serie 1 de Press banca"]').fill('5')
        pg.locator('[aria-label="RIR 1"]').first.click(); pg.wait_for_timeout(300)
        print('test result:', pg.locator('#ex-A1 .okbox').inner_text()[:90])
        pg.locator('input[aria-label="Repeticiones, serie 2 de Press banca"]').fill('6')
        pg.wait_for_timeout(1500)
        st = pg.evaluate("JSON.parse(localStorage.mock_docs)")
        logs = [k for k in st if k.startswith(f'clients/{PEPE}/logs/')]
        print('logs:', logs, json.dumps(st[logs[0]]['sets']['A1'][:2]) if logs else '')
        pg.screenshot(path=str(OUT/'e_session.png'))
        # vídeo de técnica
        open('/tmp/claude-0/tecnica.mp4','wb').write(b'\x00' * 2048)
        pg.locator('#ex-A1 input[type=file]').set_input_files('/tmp/claude-0/tecnica.mp4'); pg.wait_for_timeout(600)
        print('video status:', pg.locator('#ex-A1 p[aria-live]').inner_text())
        pg.locator('#ex-A1').screenshot(path=str(OUT/'e_videobtn.png'))
        # recarga: los datos vuelven del servidor
        pg.reload(); pg.wait_for_timeout(900)
        pg.screenshot(path=str(OUT/'e_reload.png'), full_page=True)
        if pg.locator('button.day').count(): pg.locator('button.day').first.click(); pg.wait_for_timeout(500)
        pg.screenshot(path=str(OUT/'e_reload2.png'))
        if not pg.locator('input[aria-label="Kilos, serie 1 de Press banca"]').is_visible(): pg.locator('#ex-A1 button').first.click()
        pg.wait_for_timeout(300)
        print('after reload kg:', pg.locator('input[aria-label="Kilos, serie 1 de Press banca"]').input_value())
        # mensaje a Javi
        pg.goto('http://localhost:8765/'); pg.wait_for_timeout(800)
        pg.get_by_role('button', name='Mensajes').click(); pg.wait_for_timeout(300)
        pg.locator('textarea').last.fill('Hola Javi'); pg.get_by_role('button', name='Enviar').click(); pg.wait_for_timeout(500)
        # permisos: Pepe no puede leer la biblioteca ni escribir en otro cliente
        r = pg.evaluate("""async () => { const sb = window.SAS_supabase;
            const lib = await sb.from('docs').select('path,data').eq('parent','library');
            const w = await sb.from('docs').upsert({path:'clients/33333333-3333-4333-8333-333333333333/msgs/x', data:{}});
            return [lib.data.length, w.error && w.error.code]; }""")
        print('pepe library rows / write other:', r)
        logout(pg)
        login(pg, 'javi@test.es')
        pg.screenshot(path=str(OUT/'e_coach2.png'), full_page=True)
        # alta de cliente con usuario
        pg.get_by_role('button', name='Dar de alta un cliente').click(); pg.wait_for_timeout(200)
        pg.get_by_placeholder('Nombre').fill('Raúl Pérez'); pg.wait_for_timeout(100)
        print('auto username:', pg.get_by_placeholder('usuario').input_value())
        pg.get_by_label('Contraseña provisional').fill('remo123')
        pg.get_by_role('button', name='Crear cliente').click(); pg.wait_for_timeout(800)
        pg.screenshot(path=str(OUT/'e_alta.png'), full_page=True)
        print('alta:', pg.locator('textarea').first.input_value().replace('\n',' | '))
        pg.get_by_role('button', name='Hecho').click(); pg.wait_for_timeout(300)
        pg.get_by_text('Raúl Pérez').first.click(); pg.wait_for_timeout(300)
        pg.get_by_role('tab', name='Plan').click(); pg.wait_for_timeout(300)
        pg.get_by_label('Contraseña nueva').fill('nueva123'); pg.get_by_role('button', name='Poner').click(); pg.wait_for_timeout(400)
        print('reset:', pg.locator('.okbox').last.inner_text())
        logout(pg)
        pg.locator('input[autocomplete=username]').fill('Raul'); pg.locator('input[type=password]').fill('nueva123')
        pg.get_by_role('button', name='Entrar').click(); pg.wait_for_timeout(800)
        print('raul home:', pg.locator('#app').inner_text()[:120].replace('\n',' | '), '| acct:', pg.locator('#acct').inner_text().replace('\n',' '))
        logout(pg); login(pg, 'javi@test.es')
        pg.get_by_text('Pepe').first.click(); pg.wait_for_timeout(300)
        pg.get_by_role('tab', name='Mensajes').click(); pg.wait_for_timeout(600)
        print('coach video src:', pg.locator('video.vid').first.get_attribute('src'))
        pg.screenshot(path=str(OUT/'e_coach_video.png'), full_page=True)
        pg.get_by_role('button', name='Borrar vídeo (libera espacio)').click(); pg.get_by_role('button', name='Pulsa otra vez para borrarlo').click(); pg.wait_for_timeout(500)
        print('after delete:', pg.locator('.vidgone').first.inner_text(), pg.evaluate("localStorage.mock_videos"))
        pg.locator('#nav').get_by_role('button', name='Clientes').click(); pg.wait_for_timeout(300)
        print('coach list:', pg.locator('#app').inner_text()[:300].replace('\n',' | '))
        b.close()
finally:
    srv.terminate()
print('ERRORS:', errors)
