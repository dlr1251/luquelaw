import type { AuthLocale } from "@/lib/auth/safe-next";

export function loginCopy(locale: AuthLocale) {
  if (locale === "es") {
    return {
      eyebrow: "Portal",
      title: "Iniciar sesión",
      lead: "Entra al portal para abrir Lucy AI. Las cuentas nuevas empiezan con USD 10 en créditos.",
      email: "Correo",
      password: "Contraseña",
      submit: "Entrar",
      signup: "Crear cuenta",
      forgot: "¿Olvidaste la contraseña?",
      backSite: "Volver al sitio público",
      homeHref: "/es",
      forgotHref: "/es/login/forgot",
      setupTitle: "El portal no está configurado",
      setupBody:
        "Para iniciar sesión hace falta un proyecto de Supabase. El sitio público funciona sin eso; agrega las claves para habilitar el acceso.",
      setupBack: "Volver al inicio",
    };
  }

  return {
    eyebrow: "Portal",
    title: "Sign in",
    lead: "Open Lucy AI in the portal. New accounts start with USD 10 in credits.",
    email: "Email",
    password: "Password",
    submit: "Log in",
    signup: "Create account",
    forgot: "Forgot password?",
    backSite: "Back to the public site",
    homeHref: "/",
    forgotHref: "/login/forgot",
    setupTitle: "Client portal not configured",
    setupBody:
      "Authentication requires a Supabase project. The public site works without it; add your keys to enable sign-in.",
    setupBack: "Back to home",
  };
}

export function forgotCopy(locale: AuthLocale) {
  if (locale === "es") {
    return {
      title: "Restablecer contraseña",
      lead: "Te enviamos un enlace al correo para elegir una nueva.",
      email: "Correo",
      submit: "Enviar enlace",
      back: "Volver a iniciar sesión",
      loginHref: "/es/login",
      homeHref: "/es",
      notConfigured: "La autenticación no está configurada.",
    };
  }

  return {
    title: "Reset password",
    lead: "We will email you a link to choose a new password.",
    email: "Email",
    submit: "Send reset link",
    back: "Back to sign in",
    loginHref: "/login",
    homeHref: "/",
    notConfigured: "Authentication is not configured.",
  };
}

export function updatePasswordCopy(locale: AuthLocale) {
  if (locale === "es") {
    return {
      title: "Nueva contraseña",
      lead: "Elige una contraseña nueva para tu cuenta.",
      password: "Nueva contraseña",
      confirm: "Confirmar contraseña",
      submit: "Guardar contraseña",
      cancel: "Cancelar — ir al portal",
      homeHref: "/es",
    };
  }

  return {
    title: "New password",
    lead: "Choose a new password for your account.",
    password: "New password",
    confirm: "Confirm password",
    submit: "Save password",
    cancel: "Cancel — go to portal",
    homeHref: "/",
  };
}

export function authActionCopy(locale: AuthLocale) {
  if (locale === "es") {
    return {
      notConfigured: "La autenticación no está configurada en este entorno.",
      confirmEmail: "Revisa tu correo para confirmar la cuenta.",
      emailRequired: "El correo es obligatorio.",
      resetSent: "Revisa tu correo. Ahí va el enlace para restablecer la contraseña.",
      passwordShort: "La contraseña debe tener al menos 6 caracteres.",
      passwordMismatch: "Las contraseñas no coinciden.",
    };
  }

  return {
    notConfigured: "Authentication is not configured on this environment.",
    confirmEmail: "Check your email to confirm your account.",
    emailRequired: "Email is required.",
    resetSent: "Check your email for a password reset link.",
    passwordShort: "Password must be at least 6 characters.",
    passwordMismatch: "Passwords do not match.",
  };
}
