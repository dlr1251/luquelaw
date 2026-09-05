import {
  BarChart,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Grid,
  H1,
  H2,
  H3,
  PieChart,
  Pill,
  Row,
  Stack,
  Stat,
  Table,
  Text,
  TodoList,
  UsageBar,
  useCanvasState,
} from "cursor/canvas";

type Tab = "panorama" | "apps" | "plata" | "plan";

const WEEK_HOURS = {
  instagram: 14 + 12 / 60,
  whatsapp: 7 + 20 / 60,
  waBiz: 6 + 56 / 60,
  bumble: 3 + 10 / 60,
  cursor: 3 + 3 / 60,
  notion: 2 + 33 / 60,
  spotify: 2 + 21 / 60,
  meet: 1 + 17 / 60,
  gmail: 1 + 12 / 60,
  safari: 54 / 60,
  x: 54 / 60,
};

export default function IphonePlanMaestro() {
  const [tab, setTab] = useCanvasState<Tab>("tab", "panorama");

  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 960 }}>
      <Stack gap={8}>
        <H1>Plan maestro del iPhone</H1>
        <Text tone="secondary">
          Auditoría por iPhone Mirroring · viernes 4 sep 2026, 7:11–7:37 p.m.
          · Screen Time, almacenamiento, batería, iCloud+ y suscripciones
          Apple. Semana lun–vie (sábado y domingo aún vacíos).
        </Text>
      </Stack>

      <Row gap={8} wrap>
        {(
          [
            ["panorama", "Panorama"],
            ["apps", "Apps y roles"],
            ["plata", "Plata y nube"],
            ["plan", "Plan de uso"],
          ] as const
        ).map(([id, label]) => (
          <span key={id}>
            <Pill active={tab === id} onClick={() => setTab(id)}>
              {label}
            </Pill>
          </span>
        ))}
      </Row>

      {tab === "panorama" && <Panorama />}
      {tab === "apps" && <Apps />}
      {tab === "plata" && <Plata />}
      {tab === "plan" && <Plan />}

      <Text tone="tertiary" size="small">
        Fuente: Ajustes → Tiempo de uso, Batería, Almacenamiento, iCloud+,
        Suscripciones. Aplicado 4 sep noche: Auto-Lock 1 min, Action Button
        Silent, Private Relay On, Gmail badge off, Grok push off, Instagram
        / X / Gmail fuera de Home, offload CapCut/Coinbase/Base/Trust/Strava/Sudoku/Canva.
        Bloqueado sin tu código: Downtime, límite 45 min Instagram.
      </Text>
    </Stack>
  );
}

function Panorama() {
  return (
    <Stack gap={20}>
      <Callout tone="warning" title="El celular es tu oficina y tu sala al mismo tiempo">
        Promedio 12 h 33 min al día, con un tope que tú mismo pusiste en 8 h
        y que no se está cumpliendo. Instagram sola (14 h 12 min esta semana)
        equivale a las dos WhatsApp juntas. El teléfono se desbloquea ~98
        veces al día; lo primero que abres es WhatsApp Business.
      </Callout>

      <Grid columns={4} gap={12}>
        <Stat value="12h 33m" label="Promedio diario" tone="danger" />
        <Stat value="62h 49m" label="Semana lun–vie" />
        <Stat value="98" label="Desbloqueos / día" />
        <Stat value="150" label="Notifs / día (+43%)" tone="warning" />
      </Grid>

      <Card>
        <CardHeader trailing="62h 49m / límite 8h">
          Tiempo de pantalla por categoría
        </CardHeader>
        <CardBody>
          <Grid columns={2} gap={20}>
            <Stack gap={8}>
              <PieChart
                donut
                size={220}
                data={[
                  { label: "Social", value: 23 * 60 + 57, tone: "danger" },
                  {
                    label: "Productividad y finanzas",
                    value: 14 * 60 + 31,
                    tone: "info",
                  },
                  { label: "Otros", value: 9 * 60 + 51, tone: "warning" },
                  { label: "Resto (sin etiqueta)", value: 14 * 60 + 30 },
                ]}
              />
              <Text tone="tertiary" size="small">
                Minutos por categoría · Screen Time · esta semana
              </Text>
            </Stack>
            <Stack gap={12}>
              <UsageBar
                total={12 * 60 + 33}
                topLeftLabel="Día promedio vs. tu límite de 8 h"
                topRightLabel="12h 33m / 8h"
                segments={[
                  { id: "limit", value: 8 * 60, color: "blue" },
                  { id: "over", value: 4 * 60 + 33, color: "orange" },
                ]}
              />
              <Table
                headers={["Categoría", "Semana"]}
                rows={[
                  ["Social", "23h 57m"],
                  ["Productividad y finanzas", "14h 31m"],
                  ["Otros", "9h 51m"],
                  ["Total", "62h 49m"],
                ]}
                columnAlign={["left", "right"]}
              />
            </Stack>
          </Grid>
        </CardBody>
      </Card>

      <Card>
        <CardHeader trailing="lun–vie">
          Apps más usadas esta semana
        </CardHeader>
        <CardBody>
          <BarChart
            horizontal
            height={320}
            valueSuffix=" h"
            categories={[
              "Instagram",
              "WhatsApp",
              "WA Business",
              "Bumble",
              "Cursor",
              "Notion",
              "Spotify",
              "Meet",
              "Gmail",
              "Safari / X",
            ]}
            series={[
              {
                name: "Horas esta semana",
                data: [
                  WEEK_HOURS.instagram,
                  WEEK_HOURS.whatsapp,
                  WEEK_HOURS.waBiz,
                  WEEK_HOURS.bumble,
                  WEEK_HOURS.cursor,
                  WEEK_HOURS.notion,
                  WEEK_HOURS.spotify,
                  WEEK_HOURS.meet,
                  WEEK_HOURS.gmail,
                  WEEK_HOURS.safari,
                ],
                tone: "danger",
              },
            ]}
          />
          <Text tone="tertiary" size="small">
            Safari y X empatan en 54 min. Fuente: Tiempo de uso → Ver toda la
            actividad.
          </Text>
        </CardBody>
      </Card>

      <Grid columns={2} gap={16}>
        <Card>
          <CardHeader>Hoy, batería (hasta 7:34 p.m.)</CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text>
                Promedio diario de batería: 136% (más de un ciclo completo).
                Hoy ya ibas en 113%. Salud de batería: Normal.
              </Text>
              <Table
                headers={["App", "Pantalla", "%"]}
                rows={[
                  ["WA Business", "1h 51m", "25%"],
                  ["WhatsApp", "1h 5m", "17%"],
                  ["Instagram", "1h", "19%"],
                ]}
                columnAlign={["left", "right", "right"]}
              />
              <Text tone="secondary" size="small">
                Las tres, además, corren 26–40 min en segundo plano cada una.
              </Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>El hábito de desbloqueo</CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text>
                489 pickups esta semana. El martes fue el pico (123). Lo
                primero que abres después de desbloquear:
              </Text>
              <Table
                headers={["App", "Veces"]}
                rows={[
                  ["WA Business", "114"],
                  ["WhatsApp", "109"],
                  ["Instagram", "79"],
                  ["Bumble", "28"],
                ]}
                columnAlign={["left", "right"]}
                rowTone={["info", "info", "danger", "warning"]}
              />
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Stack gap={8}>
        <H2>Cosas que probablemente no tenías en el radar</H2>
        <Table
          headers={["Hallazgo", "Por qué importa"]}
          rows={[
            [
              "Auto-Lock en Nunca",
              "iOS mismo te lo marcó: la pantalla no se apaga sola. Plata de batería y riesgo si dejas el teléfono en una mesa.",
            ],
            [
              "Tope de 8 h que no frena nada",
              "El límite existe, el promedio es 12h 33m. Sin código de Tiempo de uso es un recordatorio, no una regla.",
            ],
            [
              "Hik-Connect: 28 notificaciones",
              "Cámaras de seguridad pidiendo atención cada semana. No está en la pantalla de inicio; sí está en el bolsillo.",
            ],
            [
              "Whoosh: 25 min + 12 notifs",
              "App de micromovilidad (mismo ecosistema que Lime/Bird en Sign in with Apple). La usas sin tenerla a la vista.",
            ],
            [
              "Action Button = linterna",
              "iPhone Pro. La linterna ya está en Centro de control. Ese botón puede ser un atajo de verdad (silencio, traducir, nota a Notion).",
            ],
            [
              "Gmail 1.475 no leídos + Teléfono 29+",
              "La pantalla de inicio te grita atraso. Eso empuja a abrir Instagram, no a procesar correo.",
            ],
            [
              "iCloud+ 2 TB con 168 GB usados",
              "Pagas capacidad de sobra. Family Sharing está en “Set Up”. Private Relay está apagado.",
            ],
            [
              "CapCut, Coinbase, Base, Trust",
              "Cientos de MB cada una, sin “último uso” reciente. Dinero/crypto y edición de video en hibernación.",
            ],
            [
              "5 apps de IA en el teléfono",
              "ChatGPT, Claude, Grok, Gemini y Cursor. Claude Pro, ChatGPT Go y SuperGrok ya vencieron en Apple. Sigues abriéndolas en plan gratis.",
            ],
            [
              "Sign in with Apple fantasma",
              "Bird, Lime, Come Ya, Cooking Madness, Merqueo, GIPHY, Adobe XD, Airalo, Komoot… cuentas ligadas que ya no ves en el Home.",
            ],
          ]}
        />
      </Stack>
    </Stack>
  );
}

function Apps() {
  return (
    <Stack gap={20}>
      <Callout tone="info" title="Cómo está armado hoy">
        Una sola página de inicio, casi vacía. Arriba: Spotify, Gmail, Notion,
        Notion Calendar, Instagram, X, Journal. Dock: WhatsApp Business,
        WhatsApp, Safari, Teléfono. El resto vive en App Library. Eso está
        bien como idea; el problema es cuáles iconos ganaron la primera fila.
      </Callout>

      <Stack gap={8}>
        <H2>Roles: qué debería hacer cada app</H2>
        <Text tone="secondary">
          El celular de un abogado-founder en Medellín no puede tener 70
          herramientas compitiendo. Una app, un trabajo.
        </Text>
      </Stack>

      <Table
        headers={["Rol", "App canónica", "Qué hacer con las demás"]}
        rows={[
          [
            "Línea del estudio",
            "WhatsApp Business",
            "Esa es la puerta de Luque Law. Meta One Essential ($35.990/mes) solo vale si usas catálogo, etiquetas o anuncios. Si no, baja a gratis.",
          ],
          [
            "Línea personal / familia",
            "WhatsApp",
            "Mantén las dos. No las mezcles. El dock con las dos es correcto.",
          ],
          [
            "Correo de trabajo",
            "Gmail en el Mac",
            "En el iPhone: notificaciones solo VIP. Los 1.475 no leídos se archivan en lote un sábado, no se “ponen al día” en el bus.",
          ],
          [
            "Sistema operativo del trabajo",
            "Notion + Notion Calendar",
            "Cursor es para el Mac (3 h esta semana en el teléfono = mirroring / app). No uses el iPhone como IDE.",
          ],
          [
            "Una sola IA en el bolsillo",
            "ChatGPT o Claude",
            "Grok, Gemini y la segunda IA salen del Home y de notificaciones. Apple Intelligence cubre lo rápido (escribir, resumir).",
          ],
          [
            "Música",
            "Spotify",
            "8,55 GB. Baja descargas viejas. YouTube Music y Apple Music ya vencieron: no los reactives.",
          ],
          [
            "Plata Colombia",
            "Mi Bancolombia + Nequi + Rappi",
            "PayPal para afuera. Revolut si viajas. Stripe es del negocio: déjalo, no lo abras “a ver”.",
          ],
          [
            "Crypto",
            "Ninguna en el teléfono",
            "Coinbase, Base y Trust ocupan ~1,7 GB y no se usaron. Wallet de Apple para tarjetas; crypto en el computador si acaso.",
          ],
          [
            "Citas / salud",
            "Doctoralia",
            "Health (3,43 GB, último uso 24 ago) y Fitness están de adorno. Strava venció en junio.",
          ],
          [
            "Cámaras de la casa",
            "Hik-Connect",
            "Deja alertas de persona/puerta; apaga “movimiento genérico”. 28 notifs/semana es ruido, no seguridad.",
          ],
          [
            "Transporte",
            "Uber + Waze",
            "Whoosh/Lime/Bird: una sola. Google Maps se queda por si Waze falla.",
          ],
          [
            "Redes",
            "Instagram (cuota) + X (leer)",
            "Threads es duplicado de IG. Messenger hoy se usó: si no es cliente, sácalo del Switcher. Bumble es dating, no “red”.",
          ],
        ]}
        striped
      />

      <H2>Inventario que sí usas vs. el que solo ocupa</H2>
      <Grid columns={2} gap={16}>
        <Card>
          <CardHeader>Uso reciente (hoy / ayer)</CardHeader>
          <CardBody>
            <Text size="small" tone="secondary">
              WhatsApp ×2, Instagram, Gmail, Notion, Cursor, ChatGPT, Claude,
              Grok, Bumble, Messenger, X, Journal, Mi Bancolombia, Meet,
              Spotify, Revolut, Threads, Whoosh, Doctoralia, App Store, Safari,
              Cámara, Files.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Candidatas a borrar u offload</CardHeader>
          <CardBody>
            <Table
              headers={["App", "Tamaño", "Último uso"]}
              rows={[
                ["CapCut", "752 MB", "sin fecha"],
                ["Coinbase", "730 MB", "sin fecha"],
                ["Base App", "629 MB", "sin fecha"],
                ["Trust", "337 MB", "—"],
                ["Strava", "452 MB", "23 ago"],
                ["YouTube", "445 MB", "26 ago"],
                ["Books", "220 MB", "18 ago"],
                ["Shazam", "53 MB", "13 ago"],
                ["Canva", "165 MB", "24 ago"],
                ["Sudoku.com", "—", "—"],
              ]}
              columnAlign={["left", "right", "right"]}
            />
          </CardBody>
        </Card>
      </Grid>

      <Card>
        <CardHeader trailing="+43% vs. semana pasada">
          Notificaciones de la semana
        </CardHeader>
        <CardBody>
          <BarChart
            height={240}
            categories={[
              "Instagram",
              "Gmail",
              "Notion",
              "Rappi",
              "WA Biz",
              "Teléfono",
              "Mensajes",
              "Hik-Connect",
              "Revolut",
              "Bumble",
            ]}
            series={[
              {
                name: "Notificaciones (semana)",
                data: [250, 121, 76, 47, 40, 35, 32, 28, 18, 17],
                tone: "warning",
              },
            ]}
          />
          <Text tone="tertiary" size="small">
            Conteo semanal · Tiempo de uso → Notificaciones
          </Text>
        </CardBody>
      </Card>
    </Stack>
  );
}

function Plata() {
  return (
    <Stack gap={20}>
      <Callout tone="warning" title="Bumble Premium se renueva el 7 de septiembre">
        En tres días Apple vuelve a cobrar $26.900. Si no estás usando el
        boost a propósito, cancélalo hoy en Ajustes → Apple Account →
        Suscripciones. No esperes al domingo.
      </Callout>

      <Grid columns={3} gap={12}>
        <Stat value="$107.790" label="Apple, activos / mes" tone="warning" />
        <Stat value="168 / 2.000 GB" label="iCloud+ usado" />
        <Stat value="109 / 256 GB" label="iPhone usado" />
      </Grid>

      <Card>
        <CardHeader trailing="COP · este mes">
          Suscripciones activas en Apple
        </CardHeader>
        <CardBody>
          <Table
            headers={["Producto", "Renueva", "COP/mes", "Veredicto"]}
            rows={[
              [
                "Bumble Premium",
                "7 sep",
                "$26.900",
                "Decidir ya. 3h 10m esta semana: o es prioridad o es lujo.",
              ],
              [
                "Meta One Essential (WA Business)",
                "10 sep",
                "$35.990",
                "Solo si usas herramientas de negocio. Si es el mismo chat, sobra.",
              ],
              [
                "iCloud+ 2 TB",
                "17 sep",
                "$44.900",
                "Usas 168 GB. Baja a 200 GB o activa Family Sharing y que paguen conmigo.",
              ],
            ]}
            columnAlign={["left", "left", "right", "left"]}
            rowTone={["danger", "warning", "info"]}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Ya no pagas (pero las apps siguen ahí)</CardHeader>
        <CardBody>
          <Table
            headers={["App", "Plan", "Venció"]}
            rows={[
              ["Claude", "Pro mensual", "20 ago"],
              ["ChatGPT", "Go", "30 ago"],
              ["Grok", "SuperGrok", "31 ago"],
              ["PURE", "Membership", "6 ago"],
              ["Strava", "Subscription", "6 jun"],
              ["Kimi", "Kimist Bit 20", "22 mar"],
              ["Tiimo", "Pro", "5 ene"],
              ["Apple Arcade", "Arcade", "10 ene"],
              ["Apple TV", "Channel", "19 ene"],
              ["YouTube Music", "Premium", "23 dic 2025"],
              ["Apple Music", "Individual", "23 dic 2025"],
            ]}
            striped
          />
          <Text tone="secondary" size="small">
            Claude, ChatGPT y Grok se abrieron hoy en plan gratis. Está bien;
            no reactives tres Pro a la vez. Tiimo ya no está instalada — solo
            queda el rastro en Apple.
          </Text>
        </CardBody>
      </Card>

      <Grid columns={2} gap={16}>
        <Card>
          <CardHeader>iCloud+ 2 TB</CardHeader>
          <CardBody>
            <Stack gap={10}>
              <UsageBar
                total={2000}
                topLeftLabel="168,3 GB de 2 TB"
                topRightLabel="8% lleno"
                segments={[{ id: "used", value: 168, color: "blue" }]}
              />
              <Table
                headers={["Qué hay", "Volumen"]}
                rows={[
                  ["Fotos", "25.098 ítems"],
                  ["Drive", "27,3 GB"],
                  ["Mensajes", "2,7 GB"],
                  ["Notas", "256"],
                  ["Contraseñas", "178"],
                  ["Backup de este iPhone", "hace 1 día"],
                ]}
                columnAlign={["left", "right"]}
              />
              <Text tone="secondary" size="small">
                Private Relay: apagado. Family Sharing: no configurado. Apple
                Invites: Get Started.
              </Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Almacenamiento del iPhone 256 GB</CardHeader>
          <CardBody>
            <Stack gap={10}>
              <UsageBar
                total={256}
                topLeftLabel="109 GB usados · 147 GB libres"
                topRightLabel="no hay apuro"
                segments={[
                  { id: "apps", value: 50, color: "orange" },
                  { id: "sys", value: 27, color: "gray" },
                  { id: "ios", value: 22, color: "blue" },
                  { id: "photos", value: 7, color: "yellow" },
                ]}
              />
              <Table
                headers={["Bloque", "Tamaño"]}
                rows={[
                  ["WhatsApp Inc. (media)", "13,09 GB"],
                  ["Spotify (descargas)", "8,55 GB"],
                  ["Fotos en el aparato", "6,71 GB"],
                  ["Health", "3,43 GB"],
                  ["Datos del sistema", "27,5 GB"],
                  ["iOS", "21,85 GB"],
                ]}
                columnAlign={["left", "right"]}
              />
              <Text tone="secondary" size="small">
                El cuello no es espacio. Es WhatsApp guardando años de
                videos y Spotify cacheando offline.
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>
    </Stack>
  );
}

function Plan() {
  return (
    <Stack gap={20}>
      <H2>Sistema operativo del celular</H2>
      <Text>
        El iPhone hace tres trabajos: (1) línea del estudio, (2) vida en
        Medellín, (3) ocio. Hoy los tres están en la misma fila de iconos, con
        Instagram de jefe. El plan es separar capas, no “usar menos el
        teléfono” en abstracto.
      </Text>

      <Grid columns={3} gap={12}>
        <Card>
          <CardHeader>Capa 1 · Estudio</CardHeader>
          <CardBody>
            <Text size="small">
              WA Business, Teléfono, Notion Calendar, Safari. Notificaciones
              siempre. Gmail solo VIP. Meet cuando hay junta.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Capa 2 · Ciudad</CardHeader>
          <CardBody>
            <Text size="small">
              WhatsApp personal, Bancolombia, Nequi, Rappi, Uber, Waze,
              Doctoralia, Hik-Connect (alertas serias).
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Capa 3 · Ocio</CardHeader>
          <CardBody>
            <Text size="small">
              Instagram, X, Bumble, Spotify, Journal. Sin badge. Sin push.
              Se abren a propósito, no por reflejo al desbloquear.
            </Text>
          </CardBody>
        </Card>
      </Grid>

      <Card>
        <CardHeader>Pantalla de inicio propuesta</CardHeader>
        <CardBody>
          <Stack gap={10}>
            <H3>Página única, igual de limpia</H3>
            <Table
              headers={["Posición", "Ahora", "Propuesto"]}
              rows={[
                ["Fila 1", "Spotify · Gmail · Notion · Calendar", "WA Business · Notion Calendar · Notion · Teléfono"],
                ["Fila 2", "Instagram · X", "WhatsApp · Safari"],
                ["Fila 3", "Journal", "Journal (si lo vas a escribir; si no, App Library)"],
                [
                  "Dock",
                  "WA Biz · WhatsApp · Safari · Teléfono",
                  "WA Biz · WhatsApp · Spotify · Cámara",
                ],
              ]}
            />
            <Text tone="secondary" size="small">
              Instagram y Gmail salen de la primera pantalla. El badge de
              1.475 correos entrena el cerebro a huir. Cámara en el dock:
              evidencia, cédulas, contratos. Action Button: atajo “Nota
              rápida a Notion” o Modo silencioso — no linterna.
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Límites que sí se sienten</CardHeader>
        <CardBody>
          <Table
            headers={["Control", "Ajuste"]}
            rows={[
              ["Auto-Lock", "1 minuto. Hoy. iOS ya te lo pidió."],
              ["Downtime", "23:30–07:00. Siempre permitidas: Teléfono, WA Business, WhatsApp, Uber, Waze."],
              ["Instagram", "45 min/día, con código de Tiempo de uso que no sea el PIN del teléfono."],
              ["Bumble", "30 min/día, o se cancela el Premium el 7 sep."],
              ["Focus “Reduce Interruptions”", "En horas de escritorio. Permite WA Business, Calendar, Teléfono."],
              ["Instagram / X / Bumble push", "Off. El badge también."],
              ["Gmail", "Solo VIP y Direct. El resto se lee en el Mac."],
              ["Hik-Connect", "Persona / puerta. No “cualquier movimiento”."],
              ["Private Relay", "On. Ya pagas iCloud+."],
            ]}
          />
        </CardBody>
      </Card>

      <H2>Esta semana (antes del 7 de septiembre)</H2>
      <TodoList
        todos={[
          {
            id: "al",
            content:
              "Auto-Lock → 1 minuto (Ajustes → Batería / Pantalla y brillo).",
            status: "completed",
          },
          {
            id: "bumble",
            content:
              "Bumble Premium: se queda (5 sep). No cancelar.",
            status: "completed",
          },
          {
            id: "ig",
            content:
              "Instagram: fuera de Home, notificaciones iOS ya off. Falta tu código de Tiempo de uso para el límite 45 min.",
            status: "completed",
          },
          {
            id: "st-code",
            content:
              "Tiempo de uso: código olvidado. No adivinar. Límite 45 min y Downtime quedan sin aplicar hasta un reset con Apple ID.",
            status: "cancelled",
          },
          {
            id: "gmail",
            content:
              "Gmail: badge off, VIP only. Plan de archivo de los 1.475 el sábado (no en el teléfono a las 11 p.m.).",
            status: "completed",
          },
          {
            id: "home",
            content:
              "Reordenar Home y Dock según la tabla de arriba. Action Button ≠ linterna.",
            status: "completed",
          },
        ]}
      />

      <H2>Este mes</H2>
      <TodoList
        todos={[
          {
            id: "meta",
            content:
              "Antes del 10 sep: abrir WhatsApp Business y listar si usas algo de Meta One. Si no, cancelar Essential.",
            status: "pending",
          },
          {
            id: "icloud",
            content:
              "Antes del 17 sep: Family Sharing (familia usa los 2 TB) o bajar a 200 GB.",
            status: "pending",
          },
          {
            id: "wa-media",
            content:
              "Save to Photos ya estaba Off (Chats). 13 GB de WhatsApp no se borra a granel — pedirlo aparte.",
            status: "completed",
          },
          {
            id: "spotify",
            content:
              "Spotify: borrar descargas que no escuchas. 8,55 GB es un disco lleno de playlists muertas.",
            status: "pending",
          },
          {
            id: "delete",
            content:
              "Offload/borrar: CapCut, Coinbase, Base, Trust, Strava, Sudoku, Canva si editas en el Mac.",
            status: "completed",
          },
          {
            id: "ai",
            content:
              "Una IA en el teléfono (ChatGPT o Claude). Grok y Gemini a App Library, notifs off.",
            status: "completed",
          },
          {
            id: "siwa",
            content:
              "SIWA revocados 5 sep: Bird, Adobe XD, AmpMe, Come Ya, Cooking Madness, GIPHY, Komoot, Lime, Merqueo. Quedan Airalo, Notion, Uber, Whoosh, Goodnotes, etc.",
            status: "completed",
          },
          {
            id: "focus",
            content:
              "Activar Sleep + Downtime. Focus Status se puede dejar off si no quieres que se note.",
            status: "pending",
          },
        ]}
      />

      <Callout tone="neutral" title="Qué no toques">
        Las dos WhatsApp. Notion + Calendar. Safari. Teléfono. Bancolombia /
        Nequi / Rappi. Uber / Waze. Journal, si de verdad escribes. Cursor en
        el Mac, no como app cotidiana del iPhone. El iPhone 256 GB tiene aire:
        no hace falta “limpiar por limpiar”.
      </Callout>
    </Stack>
  );
}
