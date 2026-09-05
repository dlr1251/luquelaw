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
  useCanvasState,
} from "cursor/canvas";

type Tab =
  | "diagnostico"
  | "audiencia"
  | "contactos"
  | "contenido"
  | "protocolo"
  | "superficies";

export default function InstagramCoach() {
  const [tab, setTab] = useCanvasState<Tab>("tab", "diagnostico");

  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 980 }}>
      <Stack gap={8}>
        <H1>Coach Instagram · @luque_restrepo</H1>
        <Text tone="secondary">
          Auditoría 4 sep 2026 · Insights 5 ago–3 sep · 437 seguidores, 441
          following, 34 posts. Screen Time de la semana: 14 h 12 min en
          Instagram. Cuenta profesional ligada a la Page de Luque Law.
        </Text>
      </Stack>

      <Row gap={8} wrap>
        {(
          [
            ["diagnostico", "Diagnóstico"],
            ["audiencia", "Audiencia"],
            ["contactos", "Seguir / dejar"],
            ["contenido", "Contenido que cobra"],
            ["protocolo", "Protocolo 45 min"],
            ["superficies", "Teléfono / Chrome / APIs"],
          ] as const
        ).map(([id, label]) => (
          <span key={id}>
            <Pill active={tab === id} onClick={() => setTab(id)}>
              {label}
            </Pill>
          </span>
        ))}
      </Row>

      {tab === "diagnostico" && <Diagnostico />}
      {tab === "audiencia" && <Audiencia />}
      {tab === "contactos" && <Contactos />}
      {tab === "contenido" && <Contenido />}
      {tab === "protocolo" && <Protocolo />}
      {tab === "superficies" && <Superficies />}

      <Text tone="tertiary" size="small">
        Fuentes: Instagram in-app Insights, Your activity, following
        (168/441 leídos), comentarios públicos, Screen Time iOS. No se
        citan DMs. No se hizo unfollow masivo.
      </Text>
    </Stack>
  );
}

function Diagnostico() {
  return (
    <Stack gap={20}>
      <Callout tone="danger" title="Instagram te está usando a ti">
        14 h 12 min esta semana (lun–vie) contra 15.0K views y +11
        seguidores. Casi todo el tiempo es feed de Noticias Caracol, Reels
        de celebrity y comentarios políticos. El grid habla de visas y
        property; el pulgar habla de farándula y Petro. El algoritmo te
        trata como usuario paisa de noticias, no como abogado que vende
        a expats.
      </Callout>

      <Grid columns={4} gap={12}>
        <Stat value="14h 12m" label="Instagram esta semana" tone="danger" />
        <Stat value="15.0K" label="Views · 30 días" />
        <Stat value="+11" label="Seguidores netos" tone="warning" />
        <Stat value="405" label="Interacciones · 30 días" />
      </Grid>

      <Grid columns={2} gap={16}>
        <Card>
          <CardHeader trailing="30 días">De dónde salen las views</CardHeader>
          <CardBody>
            <Stack gap={12}>
              <PieChart
                donut
                size={200}
                data={[
                  { label: "Stories", value: 13000, tone: "info" },
                  { label: "Posts", value: 1800, tone: "warning" },
                  { label: "Reels", value: 157, tone: "danger" },
                  { label: "Live", value: 0 },
                ]}
              />
              <Text size="small" tone="secondary">
                Stories ~13K, casi todas de gente que ya te sigue. Reels
                157: Instagram no te está mostrando a nadie nuevo. Live 0.
              </Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Quién ve vs quién debería ver</CardHeader>
          <CardBody>
            <Stack gap={12}>
              <PieChart
                donut
                size={200}
                data={[
                  { label: "Seguidores", value: 86.9, tone: "warning" },
                  { label: "No seguidores", value: 13.1, tone: "info" },
                ]}
              />
              <Text size="small" tone="secondary">
                86.9% followers. Sin descubrimiento no hay pipeline. Unique
                viewers 813 sobre 437 followers: reciclas la misma sala.
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Card>
        <CardHeader>Qué haces en la app (el uso real, no el grid)</CardHeader>
        <CardBody>
          <Table
            headers={["Capa", "Qué vimos", "Efecto en el negocio"]}
            rows={[
              [
                "Al abrir",
                "Live de noticiascaracol; stories de itspedrodude, andresgoba, lauramayar",
                "El feed se entrena como noticiero + amigos. Cero cliente US.",
              ],
              [
                "Likes",
                "Reels: celebrity, bikini, un clip de inversión, robótica",
                "Le dices al algoritmo que eres ocio. Te va a devolver ocio.",
              ],
              [
                "Comentarios públicos",
                "Familia (kwaiii); política en elcolombiano_; pelea con @alexandrarojas_g; chiste Deudas/Embargo; defensa Derecho vs IA",
                "Quien busca visa en inglés ve a un penalista de Twitter. Mata confianza de expat.",
              ],
              [
                "DMs",
                "3 no leídos (no se citan)",
                "Inbox sin protocolo. El lead se pudre al lado del meme.",
              ],
              [
                "Grid",
                "Visa/property, Sunday Properties, bote/playa, meme LOTR. 0 highlights",
                "El forastero no sabe por dónde entrar. Sunday Properties diluye Luque Law.",
              ],
            ]}
          />
        </CardBody>
      </Card>

      <Callout tone="warning" title="La cuenta es una sola persona y un estudio">
        @luque_restrepo es el mismo handle para la mamá, el debate de
        Petro y el Concepto Jurídico de USD 2.400. O se vuelve marca
        (visas, inmuebles, sociedades, EN/ES) y la política se va a un
        segundo perfil personal, o el 7% de audiencia US nunca va a
        escribirte.
      </Callout>
    </Stack>
  );
}

function Audiencia() {
  return (
    <Stack gap={20}>
      <H2>A quién le estás hablando hoy</H2>
      <Text>
        La demografía es buena para visa y property (25–44 ≈ 78%). El
        problema es geografía e idioma: 69% Colombia, 76% español. El
        cliente que paga en dólares está en el 7.1% US y el 15.6% inglés.
      </Text>

      <Grid columns={4} gap={12}>
        <Stat value="78%" label="Edad 25–44" />
        <Stat value="69%" label="Colombia" tone="warning" />
        <Stat value="7.1%" label="Estados Unidos" tone="danger" />
        <Stat value="15.6%" label="Inglés" />
      </Grid>

      <Grid columns={2} gap={16}>
        <Card>
          <CardHeader>Países · 30 días</CardHeader>
          <CardBody>
            <BarChart
              height={220}
              categories={["CO", "US", "ES", "IT", "DE"]}
              series={[
                {
                  name: "Share audiencia (%)",
                  data: [69.2, 7.1, 5.1, 3.4, 2.9],
                  tone: "info",
                },
              ]}
            />
            <Text size="small" tone="secondary">
              Top ciudades: Medellín 34.2%, Bogotá 5.6%, Envigado 4.4%,
              Sabaneta 3.2%, Rionegro 2.2%. Cero ciudades US en el top 5.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Idioma de la audiencia</CardHeader>
          <CardBody>
            <PieChart
              donut
              size={200}
              data={[
                { label: "Español", value: 76, tone: "warning" },
                { label: "Inglés", value: 15.6, tone: "info" },
                { label: "Italiano", value: 3.4 },
                { label: "Alemán", value: 2.2 },
                { label: "Portugués", value: 1.0 },
              ]}
            />
          </CardBody>
        </Card>
      </Grid>

      <Card>
        <CardHeader>Género y edad</CardHeader>
        <CardBody>
          <Table
            headers={["Corte", "Dato"]}
            rows={[
              ["Hombres", "53.5%"],
              ["Mujeres", "46.5%"],
              ["35–44", "43% — el sweet spot de comprador y visa familiar"],
              ["25–34", "35.4%"],
              ["Resto", "21.6%"],
            ]}
          />
        </CardBody>
      </Card>

      <Callout tone="info" title="Qué significa esto para el contenido">
        El post en español para el amigo de Envigado ya te lo ve. El Reel
        en inglés (o bilingüe con caption EN) es el único camino a
        descubrimiento de expat. Stories siguen siendo para nurturing de
        los que ya te conocen — no las mates, pero no las uses como único
        canal. Conversión actual: ~1 follow nuevo por cada 1.360 views.
        Meta sana: 1 follow por cada 200–400 views de Reel no-seguidor.
      </Callout>
    </Stack>
  );
}

function Contactos() {
  return (
    <Stack gap={20}>
      <H2>Following 441 · ratio ~1:1</H2>
      <Text>
        Leímos 168 de 441. No se dejó de seguir a nadie. Familia y amigos
        reales se quedan. Lo que sobra es ruido que entrena el feed
        (noticias, política, trading, meme-abogados, DJs).
      </Text>

      <Grid columns={2} gap={16}>
        <Card>
          <CardHeader trailing="ya los sigues">Útiles — mantener</CardHeader>
          <CardBody>
            <Table
              headers={["Cuenta", "Por qué"]}
              rows={[
                ["francoimmigration", "Peer de visas; ver tono, no copiar"],
                ["capitalm.law", "Firma comparable"],
                ["_pcl.legal", "Legal local serio"],
                ["marianacastanod.abogada", "Colega; red"],
                ["alejoduque_dpelegal", "Peer"],
                ["cindylaboral", "Laboral; no es tu oferta pero es oficio"],
                ["derechoupb", "Alma mater; ok en dosis"],
                ["legalcheck1", "Herramienta, no entretenimiento"],
              ]}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader trailing="prioridad">Dejar de seguir (ruido)</CardHeader>
          <CardBody>
            <Table
              headers={["Cuenta", "Por qué sale"]}
              rows={[
                ["noticiascaracol", "Primera cosa que ves. Noticiero ≠ clientes"],
                ["elcolombiano_", "De ahí salen los comentarios políticos"],
                ["sergiofajardovalderrama", "Política en el feed de la firma"],
                ["laurisarabia", "Política / farándula"],
                ["abogadodegenerado", "Meme-abogado. Te posiciona en chiste"],
                ["abogadodegeneradoenvivo", "Igual"],
                ["psicologiadeldespertar29", "Wellness spam"],
                ["eyetrade_", "Trading. Conflicto con perfil serio"],
                ["metainvested", "Inversión genérica"],
                ["dj_ebbsolute / xtrahotdjs", "Ocio puro en following de marca"],
              ]}
            />
          </CardBody>
        </Card>
      </Grid>

      <Card>
        <CardHeader>A quién seguir (páginas, no personas random)</CardHeader>
        <CardBody>
          <Table
            headers={["Cuenta", "Rol"]}
            rows={[
              ["migracioncolombia", "Fuente primaria visas/migración. Citar, no opinar"],
              ["cancilleriacol", "Trámites consulares, apostilla, pasaporte"],
              ["usembassybogota", "El cliente US mira esto. Tú también"],
              ["diancolombia", "Tributario; CLKR y sociedades"],
              ["registraduria", "Cédulas, registro civil — property + visa"],
              ["superintendencia_de_notariado", "Inmuebles, tradition"],
              ["procolombia", "Inversión extranjera; lenguaje de tu cliente"],
              ["camaracomed", "Cámara de Comercio Medellín"],
            ]}
            columnAlign={["left", "left"]}
          />
          <Text size="small" tone="secondary">
            Handles oficiales pueden variar un carácter; búscalo en IG y
            verifica el check o el link .gov.co. No seguir “abogados
            millonarios” ni cuentas de “cómo ganar en USA”. Eso te mete
            otra vez en el cubo de hustle.
          </Text>
        </CardBody>
      </Card>

      <Callout tone="neutral" title="Familia y amigos">
        luquemoniq, chimeneasluque, sebastianduquex, itspedrodude,
        gabs__mqz, lauramayar, andresgoba y el resto de la vida real se
        quedan. Instagram de marca no significa ghostear a la familia.
        Significa que el comentario político no sale de @luque_restrepo.
      </Callout>
    </Stack>
  );
}

function Contenido() {
  return (
    <Stack gap={20}>
      <H2>Qué publicar para que sirva plata</H2>
      <Text>
        El grid ya tiene visa y property. Lo que no tiene es
        descubrimiento (Reels) ni un funnel (highlights + link). El
        Substack dejó de ser el primer tap: ahora el primer link es
        luquelaw.co.
      </Text>

      <Grid columns={3} gap={12}>
        <Card>
          <CardHeader>Ya aplicado</CardHeader>
          <CardBody>
            <Text size="small">
              Bio: Luque Law | Medellin. Visas, property, companies.
              EN/ES. Links: luquelaw.co primero, luego Substack, luego
              WhatsApp.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Pendiente en la app</CardHeader>
          <CardBody>
            <Text size="small">
              Highlights: Visas · Property · Firm · CLKR. Cover en forest
              de la marca. Un Reel EN por semana. Cero comentarios
              políticos desde este handle.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Ya programado (MBS)</CardHeader>
          <CardBody>
            <Text size="small">
              5 sep firma · 7 sep CLKR · 9 sep engagement · 11 sep
              immigration. IG-only; Facebook aparte. No mezclar Sunday
              Properties en captions de Luque Law.
            </Text>
          </CardBody>
        </Card>
      </Grid>

      <Card>
        <CardHeader>Pilar de contenido (4 tipos, rotación semanal)</CardHeader>
        <CardBody>
          <Table
            headers={["Pilar", "Formato", "Ejemplo que sí convierte", "Idioma"]}
            rows={[
              [
                "Visa / status",
                "Reel 20–35s + story",
                "M365 vs visitante: 3 diferencias que la gente confunde. CTA: luquelaw.co",
                "EN first, caption ES",
              ],
              [
                "Property",
                "Carrusel",
                "Comprar con pasaporte: promesa vs escritura. No listing de Sunday.",
                "EN/ES split",
              ],
              [
                "Firma / modelo",
                "Carrusel (ya el 9 sep)",
                "45 min → Concepto + quote en 3 días hábiles. Precio no se inventa.",
                "ES o bilingüe",
              ],
              [
                "CLKR / normas",
                "Reel corto o carrusel",
                "Un artículo de la norma que un expat sí usa (RUT, sociedad, vivienda).",
                "ES, hook en EN",
              ],
            ]}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Qué no publicar (quema plata de atención)</CardHeader>
        <CardBody>
          <Table
            headers={["Tipo", "Por qué"]}
            rows={[
              ["Comentario político / Petro / gobernadora", "El comprador US cierra la pestaña"],
              ["Sunday Properties en este grid", "Conflicto de marca; listing ≠ Concepto Jurídico"],
              ["LOTR / bote / playa como post principal", "Story de domingo, no grid de firma"],
              ["Debate con randoms de economía", "Te deja de abogado de comentarios"],
              ["Reels de tacos / celebrity likes", "Entrena el cubo de ocio"],
            ]}
          />
        </CardBody>
      </Card>

      <H3>CTA que sí pega con el modelo de la firma</H3>
      <Text>
        No “DM me”. El sitio y WhatsApp Business ya existen. Cada Reel
        termina en: link in bio → luquelaw.co → consulta 45 min. El
        engagement model no se cambia: Concepto + quote en 3 días
        hábiles, luego workplan/retainer.
      </Text>
    </Stack>
  );
}

function Protocolo() {
  return (
    <Stack gap={20}>
      <H2>45 minutos y se acabó</H2>
      <Text>
        Hoy Instagram es 14 h. El límite de Screen Time (45 min) quedó
        bloqueado: iOS pide el código de Tiempo de uso y ya hay 2
        intentos fallidos. No se adivina. Vos lo ponés. Mientras tanto,
        el protocolo es de conducta, no de software.
      </Text>

      <Grid columns={3} gap={12}>
        <Stat value="20 min" label="Crear (Reel o carrusel)" />
        <Stat value="15 min" label="Engagement dirigido" />
        <Stat value="10 min" label="DMs + Insights" />
      </Grid>

      <Card>
        <CardHeader>Bloque diario (no “cuando tenga un rato”)</CardHeader>
        <CardBody>
          <Table
            headers={["Min", "Acción", "Regla"]}
            rows={[
              [
                "0–20",
                "Un Reel o un carrusel. Si ya hay post programado, grabar el de la semana siguiente",
                "No abrir el feed. Perfil → + → crear",
              ],
              [
                "20–35",
                "Responder comentarios de TU contenido. Seguir 2 cuentas oficiales. Dejar 3 comentarios en expats/visas (no política)",
                "Si no es visa, property, sociedad o CLKR, no se toca",
              ],
              [
                "35–45",
                "DMs de negocio. Cerrar Insights 10 segundos. Salir",
                "Los 3 no leídos se contestan aquí, no a las 11 p.m.",
              ],
            ]}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Esta semana</CardHeader>
        <CardBody>
          <TodoList
            todos={[
              {
                id: "passcode",
                content:
                  "Tiempo de uso olvidado — skip. Protocolo de 45 min es de conducta, no de software.",
                status: "cancelled",
              },
              {
                id: "unfollow",
                content:
                  "Confirmar unfollow de noticiascaracol, elcolombiano_, fajardo, abogadodegenerado, eyetrade_, psicologiadeldespertar29.",
                status: "pending",
              },
              {
                id: "follow",
                content:
                  "Seguidos en Chrome: migracioncol, usembassybogota, cancilleriacol, diancolombia, registraduria, procolombiaco, supernotariado, camaramedellin. (No procolombia ni ccmedellin — eran fakes; se dejó de seguir.)",
                status: "completed",
              },
              {
                id: "highlights",
                content:
                  "Crear 4 highlights (Visas, Property, Firm, CLKR) desde el teléfono.",
                status: "pending",
              },
              {
                id: "reel",
                content:
                  "Un Reel EN esta semana: M365 vs visitante, o ‘buying with a passport’.",
                status: "pending",
              },
              {
                id: "politics",
                content:
                  "Si la política no se puede soltar: segundo perfil personal. Este handle queda firma.",
                status: "pending",
              },
            ]}
          />
        </CardBody>
      </Card>

      <Callout tone="info" title="Cómo sabes que está funcionando">
        En 30 días: views de no-seguidores &gt; 30% (hoy 13%). Reels &gt;
        3K views al mes (hoy 157). Inglés en audiencia &gt; 25% (hoy
        15.6%). Follows netos &gt; 40 (hoy +11). DMs de “I need a visa /
        I want to buy” &gt; likes de bikini. Si no se mueve eso, el
        problema no es “más contenido”, es que seguís usando Instagram
        como televisor.
      </Callout>
    </Stack>
  );
}

function Superficies() {
  return (
    <Stack gap={20}>
      <H2>Dónde se hace cada cosa</H2>
      <Text>
        Chrome primero. Teléfono solo cuando iOS es la fuente de verdad.
        No hay conector de Meta en este workspace: IG y FB van por Meta
        Business Suite o por la app.
      </Text>
      <Table
        headers={["Trabajo", "Dónde", "Nota"]}
        rows={[
          [
            "Programar posts IG/FB, planner, Page",
            "Chrome · Meta Business Suite",
            "Ola 1: 5/7/9/11 sep en cola (Luque Law). Ola 2: solo 13 sep 10:00 IG; faltan 16, 18, 20, 23, 25.",
          ],
          [
            "Seguir / dejar de seguir cuentas",
            "Chrome · instagram.com",
            "Más rápido que mirroring. Unfollow solo con tu OK.",
          ],
          [
            "Bio, links, highlights, stories",
            "iPhone · app Instagram",
            "Desktop no edita el website. Highlights salen de stories.",
          ],
          [
            "Reel a cámara",
            "iPhone",
            "El clip se puede subir después por MBS.",
          ],
          [
            "Límite 45 min / Downtime",
            "iPhone · Tiempo de uso",
            "Código olvidado. Skip. El protocolo es de conducta.",
          ],
          [
            "Focus, SIWA, WhatsApp rollo",
            "iPhone",
            "No pasan por Chrome.",
          ],
          [
            "Gmail 1.475 / VIP",
            "Chrome o Gmail MCP",
            "Badge iOS ya off. No archivar en el celular.",
          ],
          [
            "Bloque de 45 min en agenda",
            "Google Calendar MCP",
            "Recurrente, no un recordatorio en Instagram.",
          ],
          [
            "Tareas y session log",
            "Notion MCP",
            "No el Journal del teléfono.",
          ],
          [
            "Barrido de WhatsApp clientes",
            "Chrome · WhatsApp Business Web",
            "Skill whatsapp-ops. No el iPhone.",
          ],
        ]}
      />
      <Callout tone="neutral" title="Regla">
        Si una acción existe en Chrome y en el teléfono, se hace en Chrome.
        El mirroring queda para bio, highlights, Focus y lo que iOS no
        publica en la web.
      </Callout>
    </Stack>
  );
}
