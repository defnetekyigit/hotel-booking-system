import cron from "node-cron";
import dayjs from "dayjs";
import { prisma } from "../prisma";
import { sendBookingMail } from "../mail/mailer";

export function startReminderScheduler() {
  cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Running reminder scheduler...");

    const tomorrow = dayjs().add(1, "day").startOf("day");
    const end = tomorrow.endOf("day");

    const bookings = await prisma.booking.findMany({
      where: {
        startDate: {
          gte: tomorrow.toDate(),
          lte: end.toDate(),
        },
      },
    });

    for (const booking of bookings) {
      await sendBookingMail("yourmail@gmail.com", booking);
      console.log("📧 Reminder sent for booking", booking.id);
    }
  });
}
