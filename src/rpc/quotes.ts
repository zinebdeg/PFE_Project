import { createServerFn } from "@tanstack/react-start";
import { Resend } from 'resend';
import type { QuoteRequest } from '../api/types';

export const sendQuoteEmail = createServerFn({ method: "POST" })
  .handler(async (ctx) => {
    const data = ctx.data as unknown as QuoteRequest;
    
    // Fallback to empty string if env variable isn't found
    const resendApiKey = process.env.RESEND_API_KEY || '';
    const contactEmail = process.env.CONTACT_EMAIL || 'contact@pullmandusud.com';

    if (!resendApiKey) {
      console.warn("No RESEND_API_KEY found, skipping real email send.");
      return { success: true, mocked: true };
    }

    const resend = new Resend(resendApiKey);

    try {
      // Send email using Resend
      const response = await resend.emails.send({
        from: 'Pullman du Sud <onboarding@resend.dev>', // Resend's testing email domain
        to: contactEmail,
        subject: `Nouveau devis: ${data.subject || 'Demande de devis'} - ${data.name}`,
        html: `
          <h2>Nouvelle demande de devis sur-mesure</h2>
          <p><strong>Nom / Agence :</strong> ${data.name}</p>
          <p><strong>Sujet :</strong> ${data.subject}</p>
          <p><strong>Email :</strong> ${data.email}</p>
          <p><strong>WhatsApp :</strong> +212 ${data.whatsapp}</p>
          <hr />
          <h3>Détails du parcours :</h3>
          <p>${data.message ? data.message.replace(/\n/g, '<br/>') : 'Aucun détail fourni.'}</p>
        `
      });

      if (response.error) {
        console.error("Resend API Error:", response.error);
        throw new Error(response.error.message);
      }

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Failed to send email:', error);
      throw new Error("Failed to send email");
    }
  });
