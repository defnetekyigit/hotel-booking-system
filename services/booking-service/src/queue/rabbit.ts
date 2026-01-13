import amqp from "amqplib";

const RABBIT_URL = "amqp://localhost";

export async function publishBookingCreated(event: any) {
  const connection = await amqp.connect(RABBIT_URL);
  const channel = await connection.createChannel();

  const queue = "booking.created";
  await channel.assertQueue(queue, { durable: true });

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)));

  console.log("Booking event published", event);

  setTimeout(() => {
    connection.close();
  }, 500);
}
