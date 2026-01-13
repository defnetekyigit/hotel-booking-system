import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendBookingMail(to: string, booking: any) {
  const info = await transporter.sendMail({
    from: `"Hotel Booking" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your booking is confirmed",
    html: `
      <h2>Booking Confirmed</h2>
      <p>Your booking has been successfully created.</p>
      <ul>
        <li>Room ID: ${booking.roomId}</li>
        <li>From: ${booking.startDate}</li>
        <li>To: ${booking.endDate}</li>
      </ul>
    `,
  });

  console.log("📧 Mail sent:", info.messageId);
}
