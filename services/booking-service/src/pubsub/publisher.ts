import { PubSub } from "@google-cloud/pubsub";

const pubsub = new PubSub();

const BOOKING_TOPIC = "booking-created";

export async function publishBookingCreated(payload: {
  bookingId: string;
  roomId: string;
  userId: string;
  startDate: string;
  endDate: string;
}) {
  const dataBuffer = Buffer.from(JSON.stringify(payload));

  await pubsub.topic(BOOKING_TOPIC).publishMessage({
    data: dataBuffer,
  });
}
