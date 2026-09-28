import nodemailer from "nodemailer";

// Lazily created — one transporter reused across requests
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  enquiryId: string;
}

/**
 * Send a notification email to the business when a contact form is submitted.
 * Also sends a confirmation email to the customer.
 * Non-throwing — logs errors instead of crashing the request.
 */
export async function sendContactEmails(data: ContactEmailData) {
  const to = process.env.CONTACT_RECEIVER_EMAIL;
  const from = process.env.CONTACT_SENDER_EMAIL ?? process.env.SMTP_USER;

  if (!to || !from || !process.env.SMTP_USER) {
    console.warn(
      "[mailer] Email env vars not configured — skipping email send."
    );
    return;
  }

  const t = getTransporter();
  const submittedAt = new Date().toLocaleString("en-GB", {
    timeZone: "Africa/Lagos",
    dateStyle: "full",
    timeStyle: "short",
  });

  // ── 1. Notification to business ────────────────────────
  const notifyHtml = `
    <div style="font-family:'Times New Roman',Times,serif;max-width:600px;margin:0 auto;background:#CAF0F8;border-radius:12px;overflow:hidden;">
      <div style="background:#03045E;padding:32px 40px;">
        <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">New Enquiry Received</h1>
        <p style="color:#90E0EF;margin:8px 0 0;font-size:14px;">Iwueseter Furniture — Contact Form</p>
      </div>
      <div style="padding:36px 40px;background:#ffffff;">
        <table style="width:100%;border-collapse:collapse;font-size:15px;color:#03045E;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #CAF0F8;font-weight:600;width:140px;">Name</td>
            <td style="padding:10px 0;border-bottom:1px solid #CAF0F8;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #CAF0F8;font-weight:600;">Email</td>
            <td style="padding:10px 0;border-bottom:1px solid #CAF0F8;">
              <a href="mailto:${data.email}" style="color:#0077B6;">${data.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #CAF0F8;font-weight:600;">Phone</td>
            <td style="padding:10px 0;border-bottom:1px solid #CAF0F8;">${data.phone ?? "Not provided"}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #CAF0F8;font-weight:600;">Submitted</td>
            <td style="padding:10px 0;border-bottom:1px solid #CAF0F8;">${submittedAt}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #CAF0F8;font-weight:600;">Enquiry ID</td>
            <td style="padding:10px 0;border-bottom:1px solid #CAF0F8;font-size:12px;color:#0077B6;">${data.enquiryId}</td>
          </tr>
        </table>
        <div style="margin-top:28px;">
          <p style="font-weight:600;color:#03045E;margin-bottom:10px;">Message</p>
          <div style="background:#f0f8ff;border-left:4px solid #0077B6;padding:18px 20px;border-radius:0 8px 8px 0;font-size:15px;line-height:1.7;color:#03045E;white-space:pre-wrap;">${data.message}</div>
        </div>
        <div style="margin-top:32px;text-align:center;">
          <a href="mailto:${data.email}?subject=Re: Your Iwueseter Furniture Enquiry"
             style="display:inline-block;background:#0077B6;color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
            Reply to ${data.name}
          </a>
        </div>
      </div>
      <div style="background:#03045E;padding:20px 40px;text-align:center;">
        <p style="color:#90E0EF;margin:0;font-size:12px;">Iwueseter Furniture · Akaajime, Gboko, Benue State, Nigeria</p>
      </div>
    </div>
  `;

  // ── 2. Confirmation to customer ─────────────────────────
  const confirmHtml = `
    <div style="font-family:'Times New Roman',Times,serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #CAF0F8;">
      <div style="background:#03045E;padding:32px 40px;">
        <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">Thank You, ${data.name}</h1>
        <p style="color:#90E0EF;margin:8px 0 0;font-size:14px;">We have received your message.</p>
      </div>
      <div style="padding:36px 40px;">
        <p style="font-size:16px;line-height:1.8;color:#03045E;">
          Thank you for reaching out to <strong>Iwueseter Furniture</strong>. We have received your enquiry
          and our team will get back to you within <strong>24 business hours</strong>.
        </p>
        <div style="background:#f0f8ff;border-left:4px solid #0077B6;padding:18px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
          <p style="margin:0;font-size:14px;color:#0077B6;font-weight:600;">Your message:</p>
          <p style="margin:10px 0 0;font-size:14px;color:#03045E;line-height:1.7;white-space:pre-wrap;">${data.message}</p>
        </div>
        <p style="font-size:14px;color:#0077B6;line-height:1.7;">
          In the meantime, feel free to browse our
          <a href="${process.env.NEXTAUTH_URL ?? "https://iwueseter.com"}/products" style="color:#0077B6;">full collection</a>
          or call us directly on <strong>+234 800 000 0000</strong>.
        </p>
      </div>
      <div style="background:#03045E;padding:20px 40px;text-align:center;">
        <p style="color:#90E0EF;margin:0;font-size:12px;">Iwueseter Furniture · Akaajime, Gboko, Benue State, Nigeria</p>
      </div>
    </div>
  `;

  try {
    await Promise.all([
      // Notify the business
      t.sendMail({
        from: `"Iwueseter Furniture" <${from}>`,
        to,
        subject: `New Enquiry from ${data.name}`,
        html: notifyHtml,
        replyTo: data.email,
      }),
      // Confirm to the customer
      t.sendMail({
        from: `"Iwueseter Furniture" <${from}>`,
        to: data.email,
        subject: "We received your message — Iwueseter Furniture",
        html: confirmHtml,
      }),
    ]);
    console.log(`[mailer] Emails sent for enquiry ${data.enquiryId}`);
  } catch (err) {
    // Log but don't throw — the enquiry is already saved to the DB
    console.error("[mailer] Failed to send email:", err);
  }
}
