import { prisma } from "../prisma";
import dayjs from "dayjs";

export class SearchService {
  static async searchAvailableRooms(params: {
    city: string;
    startDate: string;
    endDate: string;
    guests: number;
    isLoggedIn: boolean;
  }) {
    const { city, startDate, endDate, guests, isLoggedIn } = params;

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
      throw new Error("Invalid date range");
    }

    const requiredDays = end.diff(start, "day") + 1;

    const rooms = await prisma.room.findMany({
      where: {
        capacity: { gte: guests },
        hotel: { city },
        availability: {
          some: {
            date: {
              gte: start.toDate(),
              lte: end.toDate(),
            },
            isAvailable: true,
          },
        },
      },
      include: {
        hotel: true,
        availability: {
          where: {
            date: {
              gte: start.toDate(),
              lte: end.toDate(),
            },
            isAvailable: true,
          },
        },
      },
    });

    const discountMultiplier = isLoggedIn ? 0.9 : 1;
    
    return rooms
      .filter((room) => room.availability.length === requiredDays)
      .map((room) => ({
        ...room,
        availability: room.availability.map((a) => ({
          ...a,
          price: Number((a.price * discountMultiplier).toFixed(2)),
        })),
      }));
  }
}
