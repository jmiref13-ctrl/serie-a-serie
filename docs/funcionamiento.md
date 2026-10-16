# Contexto para la app de entrenamiento de Javi (Serie a Serie)

Este documento describe cómo funciona el sistema de entrenamiento online que Javi (entrenador) usa con sus clientes, para replicarlo en otra app. Va acompañado de tres archivos:

- `planes.json`: los 5 bloques completos (días, ejercicios, series y repeticiones por semana, tests, variantes, calentamientos, indicaciones).
- `planes.csv`: lo mismo en tabla (una fila por ejercicio, semana y día), para importar o revisar en Excel.
- `alternativas.json`: la biblioteca de ejercicios alternativos por patrón de movimiento, las zonas de molestia y los patrones cercanos.

---

## 1. Usuarios y privacidad

- **Entrenador (Javi):** crea planes, los asigna, ve todo lo que hacen sus clientes, pone kilos objetivo y responde mensajes.
- **Cliente:** solo ve su plan, sus registros, su progreso y su chat con Javi. Nunca ve los datos de otros clientes.
- El cliente **no ve** el nombre del bloque ni la fase (Aterrizaje, Densidad…). Ve «Semana X de N», el RIR y la explicación de la semana.
- Raúl tiene avisos específicos de cadera en algunos ejercicios. Es un dato de salud: solo deben verlo Raúl y Javi.

## 2. Estructura de un plan

Un plan (plantilla) tiene:

- `title`, `desc` (solo para el entrenador), `weeks` (número de semanas).
- `weekInfo[semana]`: `phase` (nombre interno), `rir` (RIR objetivo de la semana) y `note` (mensaje que ve el cliente esa semana).
- `days[]`: cada día tiene `id` (A, B, C, D), `name` (p. ej. «Banca y dominadas»), `dur` (duración aproximada), `warm` (calentamiento: lista de `{n, d}`; se hace en 2 vueltas) y `ex[]` (ejercicios).
- Cada ejercicio tiene `id`, `name`, `uni` (unilateral: se anota lado derecho e izquierdo por separado), `tempo`, `rest`, `cue` (foco técnico), `why` (para qué sirve), `warn` (aviso de seguridad), `hip` (aviso de cadera, solo para quien lo tenga activado) y `wk[semana]`.
- `wk[semana]` lleva `s` (series; 0 = ese ejercicio no se hace esa semana), `r` (repeticiones, texto: «6», «10 por pierna», «según test»), `kg` (kilos objetivo fijados por Javi; vacío = automático), `n` (nota de la semana, p. ej. «Última serie: drop set…»), `test` (`rm5`, `max` o `sym` si esa semana el ejercicio es un test) y, si cambia de ejercicio esa semana, `v` (nombre de la variante), `vc` (su foco técnico) y `vh` (su aviso de cadera).

Cuando Javi asigna un plan a un cliente se hace una **copia** para ese cliente (con un identificador propio). Lo que cambie en la copia no toca la plantilla, y los registros de un bloque no se mezclan con los del siguiente.

## 3. Los bloques de Pepe y Raúl

| Bloque | Fechas | Semanas | Idea |
|---|---|---|---|
| 1 · Base y tests | 19 oct - 20 dic 2026 | 9 | Aprender RIR, tests (sem. 1, 2 y 9), fases de control, estiramiento y densidad |
| 2 · Volumen alto | 28 dic - 21 mar | 12 | Más series, variantes nuevas, parciales y drop sets; test sem. 12 |
| 3 · Hombro y glúteo | 29 mar - 23 may | 8 | Especialización; empuje + cuádriceps y tirón + isquios/glúteo; test sem. 7 |
| 4 · Fuerza y test final | 24 may - 27 jun | 5 | Básicos a 3-5 repeticiones; test final sem. 5 |
| 5 · Mantenimiento de verano | 28 jun - 5 sep | 10 | 3 días de cuerpo completo; sem. 5 suave; test sem. 10 |

Navidad (21-27 dic) y Semana Santa (22-28 mar) son semanas libres.

**Reglas de diseño que Javi quiere en todos los planes:**
- Las sesiones de una semana duran más o menos lo mismo (20-25 series). Se puede mezclar tren superior e inferior en un día si un ejercicio no perjudica al siguiente.
- Todo el trabajo de core va en el calentamiento, al principio.
- Repeticiones concretas, no rangos (salvo casos puntuales).
- Variedad: el ejercicio principal de cada día y los tests se mantienen todo el bloque; los accesorios cambian a mitad de bloque por otra variante del mismo patrón (campo `v`).

## 4. Peso objetivo automático

En cada ejercicio el cliente ve un **peso objetivo** grande y, en cada serie, los kilos ya escritos en gris. Si lo hace tal cual, solo escribe las repeticiones; si no puede o le sobra, cambia los kilos de esa serie o pulsa − / + (2,5 kg; 2 kg en mancuernas) para ajustar todas las series que le quedan.

Prioridad del objetivo:
1. Si Javi ha puesto `kg` para esa semana, se usa ese.
2. Si no, se calcula con la última semana en la que hizo **ese mismo ejercicio** (misma variante):
   - Fuerza estimada (1RM): `e1RM = kg × (1 + (reps + RIR) / 30)`, con su mejor serie y el RIR que marcó.
   - Peso de esta semana: `e1RM / (1 + (reps objetivo + RIR objetivo) / 30)`.
   - Se limita a entre −10% y +7,5% del peso más alto que movió esa semana, y se redondea a 2,5 kg (2 kg en mancuernas).
   - En semana de descarga, −10%.
3. Si no hay datos, «Elige el peso para quedarte con el RIR indicado».

Dominadas: no llevan kilos. Tras el test, el objetivo es **máximo − 2 repeticiones por serie**.

El cliente marca el **RIR de la última serie** de cada ejercicio (0-4). Con eso se calcula la semana siguiente.

## 5. Tests

En la semana de test, la serie 1 del ejercicio es la serie de test y aparece un recuadro con los pasos:

- **Fuerza (`rm5`):** calentamiento de 8 repeticiones con poco peso; 2-3 aproximaciones (5, 3 y 1-2 reps); serie de test con el peso para 5 repeticiones limpias dejando 1 en reserva (si salen más de 7 o menos de 4, descansar 3-4 min, ajustar y repetir una vez); anotar kilos, reps y RIR. Al anotarla, la app muestra al momento el 1RM estimado y el peso para el resto de series.
- **Dominadas (`max`):** 2 series de calentamiento de 3; una serie al máximo de repeticiones limpias (desde brazos estirados hasta barbilla sobre la barra, sin balanceo).
- **Simetría (`sym`):** cada lado por separado, empezando por el débil, 5-8 repeticiones con 1-2 en reserva y el mismo peso. La app calcula la diferencia entre lados (hasta 10% es normal).

Si un test no se hace, o la sesión se termina sin él, pasa automáticamente a las siguientes sesiones (también a la semana siguiente).

## 6. «No puedo hacerlo»

Cada ejercicio tiene un botón «No puedo hacerlo» con estos motivos:

| Motivo | Qué hace |
|---|---|
| No me da tiempo | Lo deja «para otro día». Se reparte entre las sesiones que le quedan esa semana, uno por día. Si no le da tiempo esa semana, se pierde (los tests no: pasan a la semana siguiente). |
| Me duele o me molesta | Pide zona e intensidad (0-10). Con 7 o más: «Para por hoy». Con menos: propone ejercicios de **otro patrón cercano** que no carguen esa zona, o quitarlo. |
| Máquina ocupada o no la hay | Sugiere adelantar otro ejercicio; si no, propone alternativas del **mismo patrón**, o dejarlo para otro día. |
| No me sale la técnica | Propone versiones más sencillas del mismo patrón, o quitarlo. |
| Otro motivo | Texto libre y elegir: otro día o quitarlo. |

Las alternativas y qué zonas carga cada una están en `alternativas.json`. El ejercicio sustituto se hace como accesorio (series de 10-12 por RIR) y **no cuenta** para el progreso ni para los pesos automáticos. Cada cambio envía un mensaje automático a Javi.

## 7. Progreso para el cliente

- **Récords:** cuando una serie supera su mejor marca anterior en ese ejercicio (fuerza estimada; repeticiones en dominadas), aparece un aviso al momento («Nuevo récord en press banca: 90 kg × 6»).
- Pestaña **Progreso:** sesiones hechas, racha de semanas completas (las 4 sesiones), número de récords, últimos récords, evolución de cada ejercicio con su gráfica y tests «antes y ahora».
- **Meta de 10 dominadas:** barra con su mejor marca y los hitos 6 (diciembre), 8 (marzo) y 10 (mayo).
- **Resumen semanal automático** al abrir la app desde el domingo: sesiones, récords, racha y dominadas.
- Sin medidas ni fotos: no se van a pesar ni medir.

## 8. Lo que ve el entrenador

- **Lista de clientes:** cada uno con su plan y semana, los días hechos (A B C D en colores), última actividad, mensajes sin leer, aviso de molestia y una etiqueta: «Todo bien», «Revisar» o «Atención».
- **Ficha del cliente:**
  - **Semana:** revisión automática con sesiones hechas, % de series, RIR real frente a objetivo, duración media y dureza, y una lista de «qué hacer». Debajo, cada día con los kilos y repeticiones de cada serie, RIR, notas, molestias, cambios y pendientes.
  - **Poner kilos objetivo:** para fijar kilos de una semana (vacío = automático; muestra en gris lo que propone la app).
  - **Semana de descarga:** un botón que deja esa semana al 60% de las series, RIR 3 y −10% de peso. Se deshace con el mismo botón.
  - **Plan:** asignar plantilla con fecha de inicio (lunes), editar su copia, activar avisos de cadera, ver como cliente.
  - **Mensajes** y **Progreso** del cliente.
- **Reglas de la revisión semanal:**
  - Molestia → «Escríbele hoy; si se repite en la misma zona, cambia el ejercicio el resto del bloque».
  - Menos del 85% de las series → «Pregúntale qué pasó antes de tocar el plan».
  - RIR real ≥ objetivo + 1 → «Le sobran repeticiones».
  - RIR real ≤ objetivo − 1 (y dureza ≥ 9) → «Llega sin reserva; si se repite, semana de descarga».
  - Duración media > 80 min → «Recorta accesorios, nunca los básicos».
  - Récords → «Felicítale».
- **Planes:** biblioteca de plantillas con editor (semanas, fase, RIR y nota por semana; días; calentamiento; ejercicios con series, reps, kilos, variante y nota por semana; pegar ejercicios desde Excel).

## 9. Sesión del cliente (cómo se ve)

1. Barra fija arriba con el progreso de la sesión (p. ej. 3/7).
2. «Cómo usar el peso objetivo y el RIR» (abierto la primera semana).
3. Calentamiento con casillas para 2 vueltas.
4. Pendientes de otros días, al principio.
5. Ejercicios como tarjetas plegadas; solo se abre el que toca. Cada una: nombre, series × reps, kilos, tempo, descanso, indicaciones, peso objetivo con − / +, series (Objetivo · Antes · Kg · Reps), RIR, nota para Javi, «No puedo hacerlo» y «Siguiente».
6. Al final: dureza de la sesión (1-10), comentario para Javi y «Terminar sesión». La app guarda la duración real y envía un resumen a Javi.

## 10. Cómo usar este paquete

- Si la app de Pepe se ha hecho con una IA (Claude u otra), pásale este documento y los tres archivos, y pídele que adapte su app a este funcionamiento e importe `planes.json`.
- Si la app solo permite cargar tablas, usa `planes.csv`.
- Los registros que ya se hayan hecho en Serie a Serie no van en este paquete; si hace falta, se pueden exportar aparte.
