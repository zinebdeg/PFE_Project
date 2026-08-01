import { createServerFn } from "@tanstack/react-start";
import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pullmandusud6@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface SendBookingEmailParams {
  email: string;
  name: string;
  bookingCode: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  amount: number;
  seats: string;
}

export const sendBookingEmail = createServerFn({ method: "POST" })
  .inputValidator((data: SendBookingEmailParams) => data)
  .handler(async (ctx) => {
    const d = ctx.data;

    try {
      const qrContent = `PULLMAN-DU-SUD|${d.bookingCode}|${d.name}|${d.from}>${d.to}|${d.date}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrContent)}&bgcolor=ffffff&color=000000&margin=10`;

      await transporter.sendMail({
        from: '"Pullman du Sud" <pullmandusud6@gmail.com>',
        to: d.email,
        subject: `✅ Votre billet confirmé – ${d.from} → ${d.to}`,
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Confirmation de réservation</title>
          </head>
          <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
              <tr>
                <td align="center">
                  <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background:#004B87;padding:30px 40px;text-align:center;">
                        <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:bold;letter-spacing:1px;">PULLMAN DU SUD</h1>
                        <p style="color:#a8c4e0;margin:6px 0 0;font-size:13px;text-transform:uppercase;letter-spacing:2px;">Votre billet de voyage</p>
                      </td>
                    </tr>

                    <!-- Success Badge -->
                    <tr>
                      <td style="padding:30px 40px 10px;text-align:center;">
                        <div style="display:inline-block;background:#e8f5e9;border-radius:50%;padding:16px;margin-bottom:16px;">
                          <span style="font-size:36px;">✅</span>
                        </div>
                        <h2 style="color:#2e7d32;margin:0 0 6px;font-size:20px;">Paiement confirmé !</h2>
                        <p style="color:#666;margin:0;font-size:14px;">Bonjour <strong>${d.name}</strong>, votre réservation a été validée avec succès.</p>
                      </td>
                    </tr>

                    <!-- Booking Reference -->
                    <tr>
                      <td style="padding:20px 40px;">
                        <div style="background:#f0f7ff;border:1px solid #c0d8f5;border-radius:8px;padding:16px;text-align:center;">
                          <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">Référence de réservation</p>
                          <p style="margin:0 0 16px;font-size:24px;font-weight:bold;color:#004B87;letter-spacing:3px;">${d.bookingCode}</p>
                          <img src="${qrUrl}" alt="QR Code" width="150" height="150" style="display:block;margin:0 auto;border-radius:8px;border:1px solid #c0d8f5;padding:4px;background:#fff;" />
                          <p style="margin:12px 0 0;font-size:11px;color:#666;">Présentez ce QR code lors de l'embarquement</p>
                        </div>
                      </td>
                    </tr>

                    <!-- Journey Details -->
                    <tr>
                      <td style="padding:10px 40px 20px;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
                          <tr>
                            <td style="background:#f9f9f9;padding:12px 20px;border-bottom:1px solid #e5e5e5;">
                              <strong style="font-size:13px;color:#333;text-transform:uppercase;letter-spacing:1px;">Détails du voyage</strong>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:16px 20px;">
                              <table width="100%">
                                <tr>
                                  <td style="padding:6px 0;color:#555;font-size:13px;width:140px;">🚌 Trajet</td>
                                  <td style="padding:6px 0;font-weight:bold;color:#333;font-size:13px;">${d.from} → ${d.to}</td>
                                </tr>
                                <tr>
                                  <td style="padding:6px 0;color:#555;font-size:13px;">📅 Date</td>
                                  <td style="padding:6px 0;font-weight:bold;color:#333;font-size:13px;">${d.date}</td>
                                </tr>
                                <tr>
                                  <td style="padding:6px 0;color:#555;font-size:13px;">🕐 Départ</td>
                                  <td style="padding:6px 0;font-weight:bold;color:#333;font-size:13px;">${d.departureTime}</td>
                                </tr>
                                <tr>
                                  <td style="padding:6px 0;color:#555;font-size:13px;">💺 Siège(s)</td>
                                  <td style="padding:6px 0;font-weight:bold;color:#333;font-size:13px;">${d.seats}</td>
                                </tr>
                                <tr>
                                  <td style="padding:6px 0;color:#555;font-size:13px;">💰 Montant payé</td>
                                  <td style="padding:6px 0;font-weight:bold;color:#004B87;font-size:15px;">${d.amount.toFixed(2)} MAD</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Instructions -->
                    <tr>
                      <td style="padding:0 40px 20px;">
                        <div style="background:#fff8e1;border-left:4px solid #f59e0b;border-radius:4px;padding:14px 16px;">
                          <p style="margin:0;font-size:13px;color:#78350f;">
                            📌 <strong>Important :</strong> Veuillez vous présenter <strong>15 minutes avant le départ</strong> à la gare routière avec votre code de réservation <strong>${d.bookingCode}</strong>.
                          </p>
                        </div>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background:#004B87;padding:20px 40px;text-align:center;">
                        <p style="color:#a8c4e0;margin:0;font-size:12px;">© ${new Date().getFullYear()} Pullman du Sud · Tous droits réservés</p>
                        <p style="color:#a8c4e0;margin:6px 0 0;font-size:11px;">Ce mail est envoyé automatiquement, merci de ne pas y répondre.</p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });

      return { success: true };
    } catch (err: any) {
      console.error("[EMAIL] Erreur envoi email:", err);
      // On ne bloque pas le flux si l'email échoue
      return { success: false, error: err.message };
    }
  });
