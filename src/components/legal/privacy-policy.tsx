import Link from "next/link";

type Props = {
  locale: "en" | "es";
};

export function PrivacyPolicy({ locale }: Props) {
  if (locale === "es") {
    return (
      <article className="mx-auto max-w-2xl px-4 py-16 prose-legal">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-normal text-[color:var(--forest)]">
          Política de tratamiento de datos personales
        </h1>
        <p className="mt-4 text-[color:var(--ink)] leading-relaxed">
          <strong>Luque Law · Daniel Luque Restrepo</strong> (en adelante, el
          Responsable), con domicilio en Medellín, Colombia, informa que el
          tratamiento de los datos personales que usted suministre a través del
          formulario de contacto del sitio web se realiza conforme a la Ley 1581
          de 2012, el Decreto 1377 de 2013 y demás normas que las modifiquen,
          adicionen o complementen.
        </p>
        <h2 className="mt-8 text-xl font-bold text-[color:var(--forest)]">Finalidad</h2>
        <p className="mt-2 text-[color:var(--ink)] leading-relaxed">
          Sus datos (nombre, correo electrónico, tipo de asunto, mensaje y
          archivos adjuntos) serán utilizados exclusivamente para: (i) responder
          su consulta; (ii) evaluar si podemos prestar servicios jurídicos; (iii)
          mantener comunicación relacionada con su solicitud.
        </p>
        <h2 className="mt-8 text-xl font-bold text-[color:var(--forest)]">Derechos del titular</h2>
        <p className="mt-2 text-[color:var(--ink)] leading-relaxed">
          Usted puede conocer, actualizar, rectificar y suprimir sus datos, así
          como revocar la autorización y presentar quejas ante la
          Superintendencia de Industria y Comercio, escribiendo a{" "}
          <a className="font-bold text-[color:var(--moss)] underline" href="mailto:daniel@luquelaw.co">
            daniel@luquelaw.co
          </a>
          .
        </p>
        <h2 className="mt-8 text-xl font-bold text-[color:var(--forest)]">Cookies</h2>
        <p className="mt-2 text-[color:var(--ink)] leading-relaxed">
          Usamos cookies esenciales para el funcionamiento del sitio (por ejemplo,
          idioma y sesión). Con su autorización, también podemos usar cookies de
          analítica (Google Analytics) para entender el uso del sitio de forma
          agregada. Puede aceptar o limitar las cookies no esenciales en el aviso
          de cookies; puede cambiar su preferencia en cualquier momento desde el
          enlace &quot;Cookies&quot; del pie de página.
        </p>
        <h2 className="mt-8 text-xl font-bold text-[color:var(--forest)]">Conservación</h2>
        <p className="mt-2 text-[color:var(--ink)] leading-relaxed">
          Conservaremos la información el tiempo necesario para atender su
          consulta y, de ser el caso, durante los plazos legales aplicables a la
          relación profesional.
        </p>
        <p className="mt-10">
          <Link href="/es#contact" className="font-bold text-[color:var(--moss)] underline">
            ← Volver al formulario de contacto
          </Link>
        </p>
      </article>
    );
  }

  return (
    <article className="mx-auto max-w-2xl px-4 py-16 prose-legal">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-normal text-[color:var(--forest)]">
        Personal data processing policy
      </h1>
      <p className="mt-4 text-[color:var(--ink)] leading-relaxed">
        <strong>Luque Law · Daniel Luque Restrepo</strong> (the Controller),
        based in Medellín, Colombia, processes personal data submitted through
        this website&apos;s contact form in accordance with Colombian Law 1581
        of 2012, Decree 1377 of 2013, and related regulations.
      </p>
      <h2 className="mt-8 text-xl font-bold text-[color:var(--forest)]">Purpose</h2>
      <p className="mt-2 text-[color:var(--ink)] leading-relaxed">
        Your data (name, email, matter type, message, and attachments) will be
        used solely to: (i) respond to your inquiry; (ii) assess whether we can
        provide legal services; (iii) communicate regarding your request.
      </p>
      <h2 className="mt-8 text-xl font-bold text-[color:var(--forest)]">Your rights</h2>
      <p className="mt-2 text-[color:var(--ink)] leading-relaxed">
        You may access, update, rectify, and delete your data, revoke
        authorization, and file complaints with the Colombian data protection
        authority (SIC) by emailing{" "}
        <a className="font-bold text-[color:var(--moss)] underline" href="mailto:daniel@luquelaw.co">
          daniel@luquelaw.co
        </a>
        .
      </p>
      <h2 className="mt-8 text-xl font-bold text-[color:var(--forest)]">Cookies</h2>
      <p className="mt-2 text-[color:var(--ink)] leading-relaxed">
        We use essential cookies for site functionality (for example, language and
        session). With your permission, we may also use analytics cookies (Google
        Analytics) to understand aggregated site usage. You can accept or limit
        non-essential cookies in the cookie notice; you can change your preference
        anytime via the &quot;Cookies&quot; link in the footer.
      </p>
      <h2 className="mt-8 text-xl font-bold text-[color:var(--forest)]">Retention</h2>
      <p className="mt-2 text-[color:var(--ink)] leading-relaxed">
        We retain information for as long as needed to handle your inquiry and,
        where applicable, for legally required periods related to a professional
        engagement.
      </p>
      <p className="mt-10">
        <Link href="/#contact" className="font-bold text-[color:var(--moss)] underline">
          ← Back to contact form
        </Link>
      </p>
    </article>
  );
}
