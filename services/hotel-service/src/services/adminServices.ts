import { prisma } from "../prisma";
import dayjs from "dayjs";

export class AdminService {
  static async createHotel(data: {
    name: string;
    city: string;
    country: string;
    address: string;
    adminUserId: string;
  }) {
    console.log("Creating hotel with data", data);
    return prisma.hotel.create({
      data,
    });
  }

  static async createRoom(data: {
    hotelId: string;
    type: string;
    capacity: number;
    basePrice: number;
  }) {
    console.log("Creating room with data", data);
    return prisma.room.create({
      data,
    });
  }

  static async createRoomAvailability(params: {
    roomId: string;
    startDate: string;
    endDate: string;
    price: number;
  }) {
    const { roomId, startDate, endDate, price } = params;

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (!start.isValid() || !end.isValid()) {
      throw new Error("Invalid date format");
    }

    if (end.isBefore(start)) {
      throw new Error("End date must be after start date");
    }

    const days: {
      roomId: string;
      date: Date;
      price: number;
      isAvailable: boolean;
    }[] = [];

    let current = start;

    while (current.isSame(end) || current.isBefore(end)) {
      days.push({
        roomId,
        date: current.toDate(),
        price,
        isAvailable: true,
      });
      current = current.add(1, "day");
    }

    await prisma.roomAvailability.createMany({
      data: days,
      skipDuplicates: true, // @@unique(roomId, date)
    });

    return { daysCreated: days.length };
  }
}
