// messageStore.js
import nanobuffer from "nanobuffer";

const MAX_MESSAGES = 50;
const messageBuffer = new nanobuffer(MAX_MESSAGES);
let clients = [];

export function addConnection(socket) {
  clients.push(socket);
}

export function removeConnection(socket) {
  clients = clients.filter((client) => client !== socket);
}

export function broadcastMessages(encodedMessage) {
  clients.forEach((client) => {
    client.write(encodedMessage);
  });
  console.log("🚀 ~ broadcastMessages ~ encodedMessage:", encodedMessage);
}

export function addMessage(message) {
  messageBuffer.push(message);
}

export function getRecentMessages() {
  return Array.from(messageBuffer).reverse();
}

export default {
  addConnection,
  removeConnection,
  broadcastMessages,
  addMessage,
  getRecentMessages,
};
