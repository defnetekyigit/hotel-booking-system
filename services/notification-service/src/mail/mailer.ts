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
}
export async function senReminderMail(to: string, booking: any) {
  const info = await transporter.sendMail({
    from: `"Hotel Booking" <${process.env.SMTP_USER}>`,
    to,
    subject: "Reminder: Upcoming Booking",
    html: `
      <h2>Reminder: Upcoming Booking</h2>
      <p>You have an upcoming booking.</p>
      <ul>
        <li>Room ID: ${booking.roomId}</li>
        <li>From: ${booking.startDate}</li>
        <li>To: ${booking.endDate}</li>
      </ul>
    `,
  });
  console.log("📧 Mail sent:", info.messageId);
}

export async function sendCapacityAlertMail(
  to: string,
  data: {
    hotelName: string;
    availableRooms: number;
    totalRooms: number;
  }
) {
  await transporter.sendMail({
    from: `"Hotel Booking" <${process.env.SMTP_USER}>`,
    to,
    subject: "⚠️ Hotel Capacity Alert",
    html: `
      <h2>Capacity Warning</h2>
      <p><b>${data.hotelName}</b> hotel capacity is below 20%.</p>
      <ul>
        <li>Total rooms: ${data.totalRooms}</li>
        <li>Available rooms: ${data.availableRooms}</li>
      </ul>
    `,
  });

  console.log("⚠️ Capacity alert sent to admin:", to);
}
