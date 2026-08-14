// app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, societe } = body as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
      societe?: string; // champ piège (honeypot) anti-spam, doit rester vide
    };

    // Honeypot : un bot qui remplit ce champ caché reçoit un faux succès
    // sans qu'aucun email ne soit envoyé ni enregistré.
    if (societe) {
      return NextResponse.json({ ok: true });
    }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Merci de remplir tous les champs obligatoires." },
        { status: 400 },
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Adresse email invalide." },
        { status: 400 },
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { ok: false, error: "Le message est trop long." },
        { status: 400 },
      );
    }

    // Si l'auteur du message est connecté, on relie le message à son
    // compte pour l'afficher dans le panel admin (sinon userId reste null).
    const session = await auth.api.getSession({ headers: request.headers });

    const savedMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        subject: subject?.trim() || null,
        message: message.trim(),
        userId: session?.user?.id ?? null,
      },
    });

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"${name.trim()} via FeuVert" <${process.env.GMAIL_USER}>`,
        to: process.env.CONTACT_TO_EMAIL || process.env.GMAIL_USER,
        replyTo: email.trim(),
        subject: subject?.trim()
          ? `[Contact FeuVert] ${subject.trim()}`
          : "[Contact FeuVert] Nouveau message",
        text: `Nom : ${name}\nEmail : ${email}\n${subject ? `Sujet : ${subject}\n` : ""}\n${message}`,
        html: `
          <div style="font-family: -apple-system, sans-serif; line-height: 1.6; color: #1C1C1E;">
            <h2 style="margin-bottom: 4px;">Nouveau message — formulaire de contact</h2>
            <p style="color:#6B7280; font-size: 13px; margin-top: 0;">Envoyé depuis feuvert.fr</p>
            <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
            <p><strong>Email :</strong> ${escapeHtml(email)}</p>
            ${subject ? `<p><strong>Sujet :</strong> ${escapeHtml(subject)}</p>` : ""}
            <p><strong>Message :</strong></p>
            <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
        `,
      });
    } catch (mailErr) {
      // Le message est déjà enregistré en base (donc visible dans le panel
      // admin) même si l'envoi de l'email échoue : on log sans faire
      // échouer la requête pour ne pas perdre le message.
      console.error(
        "Erreur envoi email contact (message enregistré) :",
        mailErr,
      );
    }

    return NextResponse.json({ ok: true, id: savedMessage.id });
  } catch (err) {
    console.error("Erreur traitement contact:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Une erreur est survenue lors de l'envoi. Réessayez plus tard.",
      },
      { status: 500 },
    );
  }
}

/** Échappe le HTML pour éviter toute injection dans l'email envoyé. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
