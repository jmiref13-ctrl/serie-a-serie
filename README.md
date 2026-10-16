# Serie a Serie

App de entrenamiento online de Javi. Los clientes ven su plan, apuntan kilos, repeticiones y RIR serie a serie, ven su progreso y hablan con Javi. Javi ve a todos sus clientes, revisa cada semana, ajusta kilos, pone semanas de descarga y edita los planes.

- **Web:** HTML, CSS y JavaScript sin compilación (carpeta `public/`), publicada con GitHub Pages.
- **Datos y cuentas:** Supabase (Postgres + Auth + Realtime).
- **Cómo funciona por dentro (entrenamiento):** [`docs/funcionamiento.md`](docs/funcionamiento.md).

## Estructura

```
public/                 la app (lo que se publica)
  index.html
  app.js                pantallas y lógica de entrenamiento
  backend.js            entrada con email/contraseña y conexión con Supabase
  config.js             URL y clave pública del proyecto de Supabase
  styles.css
  vendor/supabase.js    @supabase/supabase-js 2.45.4
supabase/
  migrations/…_serie_a_serie.sql   tablas, permisos (RLS) y tiempo real
  seed.sql              los 5 bloques como plantillas de la biblioteca
docs/                   funcionamiento, planes.json y alternativas.json
tests/                  pruebas (permisos en Postgres y app con Supabase simulado)
```

## Datos

Todo se guarda en la tabla `docs` como documentos JSON con una ruta:

| Ruta | Qué es | Quién puede verlo |
|---|---|---|
| `library/<id>` | plantillas de planificación | solo Javi |
| `clients/<uid>` | ficha del cliente (plan, fecha de inicio, avisos de cadera…) | Javi y ese cliente |
| `clients/<uid>/plan/current` | su copia del plan | Javi y ese cliente |
| `clients/<uid>/logs/<pid>_w<sem>_<día>` | registro de cada sesión | Javi y ese cliente |
| `clients/<uid>/msgs/<id>` | mensajes | Javi y ese cliente |

Los entrenadores están en la tabla `coaches`. Los clientes no pueden borrar nada ni ver datos de otros.

## Puesta en marcha

### 1. Supabase (ya hecho)
El proyecto `serie-a-serie` (París) ya tiene las tablas, los permisos y el tiempo real (`supabase/migrations/`), y `public/config.js` ya apunta a él. La primera vez que Javi entra, la app carga sola los 5 bloques en la biblioteca (`public/planes.json`; `supabase/seed.sql` hace lo mismo por SQL).

Queda por hacer en el panel de Supabase:
1. **Authentication → Users → Add user → Create new user**: crea el usuario de Javi (marca *Auto Confirm User*). Con su correo se convierte en entrenador automáticamente.
2. **Authentication → Sign In / Providers**: desactiva *Allow new users to sign up* (solo entra quien des de alta).
3. **Authentication → URL Configuration**: *Site URL* = `https://jmiref13-ctrl.github.io/serie-a-serie/` (para «He olvidado la contraseña»).

Para añadir otro entrenador:
```sql
insert into public.coaches (user_id) select id from auth.users where email = 'CORREO';
```

### 2. GitHub Pages
**Settings → Pages → Source: GitHub Actions.** Cada cambio en `main` se publica solo. La dirección es `https://jmiref13-ctrl.github.io/serie-a-serie/`.

### 3. Dar de alta a un cliente
1. Supabase → **Authentication → Users → Add user**, con su correo y una contraseña provisional, marcando *Auto Confirm User*.
2. Mándale el enlace, su correo y la contraseña. Al entrar escribe su nombre y pulsa **Empezar**: ya aparece en tu panel.
3. En su ficha → **Plan**: asígnale el bloque y la fecha de inicio. Si tiene la cadera delicada, activa los avisos de cadera.

En el móvil se puede añadir a la pantalla de inicio (Compartir → Añadir a pantalla de inicio) y se abre como una app.

## Pruebas

```bash
# permisos (necesita un Postgres local; simula el esquema auth de Supabase)
psql -d prueba -f tests/rls_test.sql
# app completa con Supabase simulado (Python + Playwright)
python3 tests/e2e.py /tmp
```
