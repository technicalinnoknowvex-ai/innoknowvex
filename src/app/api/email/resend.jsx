import { Resend } from 'resend';

const resend = new Resend('re_MtyWQUGH_AVt7JXbPkZ5WefhAzZhd5sQs');

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'anshumanrana1404@gmail.com',
  subject: 'Hello World',
  html: '<p>Thank you for purchasing our course!</p><p>We are excited to have you on board. Our team at <strong>Innoknowvex</strong> will be contacting you shortly with the next steps.</p><p>Congrats on taking the first step toward your learning journey — you have just sent your <strong>first email</strong>!</p>',
});