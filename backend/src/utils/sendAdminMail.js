
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
    subject: 'New Employee Signup',
    text: `New employee registered: ${userEmail}`,
  });
};

module.exports = sendAdminMail;
