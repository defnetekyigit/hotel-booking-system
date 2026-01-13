import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import dayjs from "dayjs";

export class BookingService {
  static async createBooking(params: {
    roomId: string;
    userId: string;
    startDate: string;
    endDate: string;
    guestCount: number;
  }) {
    const { roomId, userId, startDate, endDate, guestCount } = params;

    const start = dayjs(startDate).startOf("day");
    const end = dayjs(endDate).endOf("day");

    if (end.isBefore(start)) {
      throw new Error("Invalid date range");
    }

    const days: Date[] = [];
    let current = start;
    while (current.isBefore(end) || current.isSame(end, "day")) {
      days.push(current.toDate());
      current = current.add(1, "day");
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const availableCount = await tx.roomAvailability.count({
        where: {
          roomId,
          date: { in: days },
          isAvailable: true,
        },
      });

      if (availableCount !== days.length) {
        throw new Error("Room not available for selected dates");
      }

      const booking = await tx.booking.create({
        data: {
          roomId,
          userId,
          startDate: start.toDate(),
          endDate: end.toDate(),
          guestCount,
        },
      });

      await tx.roomAvailability.updateMany({
        where: {
          roomId,
          date: { in: days },
        },
        data: {
          isAvailable: false,
        },
      });

      // 4️⃣ (ileride) Queue event
      // await publishBookingEvent(booking);

      return booking;
    });
  }
  // BookingService
  static getUserBookings(userId: string) {
    return prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }
}
