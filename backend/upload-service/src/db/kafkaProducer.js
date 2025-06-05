import { Kafka } from "kafkajs";
import { KAFKA_BROKER } from "../config/config.js";

const kafka = new Kafka({
  clientId: "video-upload-service",
  brokers: [KAFKA_BROKER],
});

const producer = kafka.producer();
await producer.connect();

export function sendMessages(topic, message) {
  return producer.send({
    topic,
    messages: [
      {
        value: message,
      },
    ],
  });
}

export function endConnection() {
  return producer.disconnect();
}
