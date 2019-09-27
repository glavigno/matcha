const nodemailer = require("nodemailer");

async function sendMail(email, nb, key) {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 465,
    sendmail: true,
    path: "/usr/sbin/sendmail",
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  await transporter.sendMail({
    from: '"Matcha(tche) team 💕" <matcha@findlove.com>',
    to: email,
    subject: nb ? "Oops, someone lost something !" : "Welcome 😍!",
    text: nb ? "Reset your password 🔒" : "Confirm your account 🔥",
    html: nb
      ? `<h1>Click <a href=\"http://localhost:3000/security/reset/${key}\">here</a> to reset your password 🔒</h1>`
      : `<h1>Confirm your account 🔥 <a href=\"http://localhost:3000/authentication/${key}\">here</a></h1>`
  });
}

module.exports = { sendMail };
