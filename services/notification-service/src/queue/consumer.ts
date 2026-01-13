import amqp from "amqplib";

const RABBIT_URL = "amqp://localhost";

export async function startBookingConsumer() {
  const connection = await amqp.connect(RABBIT_URL);
  const channel = await connection.createChannel();

  const queue = "booking.created";
  await channel.assertQueue(queue, { durable: true });

  console.log("Notification Service listening for booking events...");

  channel.consume(queue, (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());
    console.log("Booking received:", data);

    // ŞİMDİLİK SADECE LOG
    // mail sonra

    channel.ack(msg);
  });
}
