// Test the email function directly
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'test-key');

async function testEmail() {
  try {
    const { to, subject, html, from } = {
      to: 'test@example.com',
      subject: 'Test Email',
      html: '<p>Test email content</p>',
      from: undefined
    };
    
    console.log('Request body:', { to, subject, html, from });
    console.log('Environment:', { 
      hasApiKey: !!process.env.RESEND_API_KEY, 
      resendFrom: process.env.RESEND_FROM 
    });

    if (!process.env.RESEND_API_KEY) {
      console.log('ERROR: Missing RESEND_API_KEY');
      return;
    }

    if (!to || !subject || !html) {
      console.log('ERROR: Missing required fields:', { to: !!to, subject: !!subject, html: !!html });
      return;
    }

    const fromAddress = from || process.env.RESEND_FROM || 'onboarding@resend.dev';
    console.log('From address:', fromAddress);
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fromAddress)) {
      console.log('ERROR: Invalid from address format:', fromAddress);
      return;
    }

    console.log('Sending email:', { from: fromAddress, to, subject });

    const { error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html
    });

    if (error) {
      console.log('ERROR:', error);
    } else {
      console.log('SUCCESS: Email sent');
    }
  } catch (err) {
    console.log('EXCEPTION:', err.message);
  }
}

testEmail();
