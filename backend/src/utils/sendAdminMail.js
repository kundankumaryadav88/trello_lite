
const nodemailer = require('nodemailer');

const sendAdminMail = async (userEmail) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_PASS,
    },
  });

  await transporter.sendMail({
  from: process.env.ADMIN_EMAIL,
  to: process.env.ADMIN_EMAIL,
  subject: '🎉 New Employee Registered!',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px; max-width: 500px; margin: auto;">
      <div style="text-align: center;">
        <img src="https://media.giphy.com/media/26ufnwz3wDUli7GU0/giphy.gif" alt="Welcome" style="width: 150px; height: auto;" />
        <h2 style="color: #4CAF50;">New Employee Registration</h2>
      </div>
      <p style="font-size: 16px;">
        <strong>Employee Email:</strong> ${userEmail}
      </p>
      <p style="font-size: 16px;">
        A new employee has successfully registered on the platform.<br/>
        Please review and take necessary actions if required.
      </p>
      <p style="font-size: 14px; color: #555;">
        Best regards,<br/>
        Your Automated Notification System
      </p>
    </div>
  `,
});

};

module.exports = sendAdminMail;
