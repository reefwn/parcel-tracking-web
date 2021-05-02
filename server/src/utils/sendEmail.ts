import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
  let testAccount = await nodemailer.createTestAccount();
  console.log("testAccount", testAccount);

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Parcel Tracking" <not-reply@parcel-tracking.com>',
    to,
    subject,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
