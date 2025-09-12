import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, html, from } = req.body || {};

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: 'Missing RESEND_API_KEY' });
    }

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const fromAddress = from || 'onboarding@resend.dev';

    const { error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html
    });

    if (error) {
      return res.status(400).json({ error: error.message || 'Failed to send email' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unexpected error' });
  }
}
