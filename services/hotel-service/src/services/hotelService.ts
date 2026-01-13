import { prisma } from "../prisma";

export class HotelService {
  static listHotels() {
    return prisma.hotel.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        country: true,
        address: true,
      },
    });
  }

  static getHotelRooms(hotelId: string) {
    return prisma.room.findMany({
      where: { hotelId },
      select: {
        id: true,
        type: true,
        capacity: true,
        basePrice: true,
      },
    });
  }

  static getRoomAvailability(roomId: string) {
    return prisma.roomAvailability.findMany({
      where: { roomId, isAvailable: true },
      orderBy: { date: "asc" },
    });
  }
}
