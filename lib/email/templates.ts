/**
 * Templates HTML pour les emails transactionnels (Resend).
 * Les emails ne peuvent pas utiliser Tailwind : tout est en styles
 * inline, avec la palette et la typographie des pages d'authentification.
 */

const STYLES = {
  body: "margin:0;padding:0;background-color:#F6F1E4;font-family:Georgia,'Times New Roman',serif;",
  wrapper: "max-width:480px;margin:0 auto;padding:40px 24px;",
  eyebrow:
    "font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:#B08D57;margin:0 0 20px;font-family:'Courier New',monospace;",
  card: "background-color:#ffffff;border:1px solid #E4DEC9;border-radius:8px;padding:32px;",
  title: "margin:0 0 12px;font-size:22px;color:#1B2A4A;",
  text: "margin:0 0 24px;font-size:14px;line-height:1.6;color:#4A4636;",
  button:
    "display:inline-block;background-color:#1B2A4A;color:#F6F1E4;text-decoration:none;padding:12px 24px;border-radius:4px;font-size:13px;letter-spacing:0.05em;text-transform:uppercase;font-family:'Courier New',monospace;",
  footer: "margin-top:32px;font-size:12px;color:#9B9679;",
  link: "color:#1B2A4A;",
};

function layout(
  title: string,
  message: string,
  buttonLabel: string,
  url: string,
) {
  return `<body style="${STYLES.body}">
    <div style="${STYLES.wrapper}">
      <p style="${STYLES.eyebrow}">FeuVert</p>
      <div style="${STYLES.card}">
        <h1 style="${STYLES.title}">${title}</h1>
        <p style="${STYLES.text}">${message}</p>
        <a href="${url}" style="${STYLES.button}">${buttonLabel}</a>
        <p style="${STYLES.footer}">
          Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br />
          <a href="${url}" style="${STYLES.link}">${url}</a>
        </p>
      </div>
      <p style="${STYLES.footer}">© ${new Date().getFullYear()} FeuVert — Préparation au permis</p>
    </div>
  </body>`;
}

export function resetPasswordEmail(url: string) {
  return {
    subject: "Réinitialisez votre mot de passe FeuVert",
    html: layout(
      "Réinitialisation du mot de passe",
      "Vous avez demandé la réinitialisation de votre mot de passe. Ce lien est valable 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.",
      "Choisir un nouveau mot de passe",
      url,
    ),
  };
}

export function verifyEmailEmail(url: string) {
  return {
    subject: "Vérifiez votre adresse email — FeuVert",
    html: layout(
      "Vérifiez votre adresse email",
      "Confirmez votre adresse email pour activer pleinement votre compte FeuVert et sécuriser votre dossier de préparation.",
      "Vérifier mon email",
      url,
    ),
  };
}
