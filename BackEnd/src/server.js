// src/server.js
import http from "node:http";
import nanobuffer from "nanobuffer";
import parseMessage from "./utils/parse-message.js";
import { handleHttpRequest } from "./handlers/handleHttpRequest.js";
import computeWebSocketAcceptValue from "./utils/compute-web-socket-accept-value.js";
import objToResponse from "./utils/objToResponse.js";

let connections = [];
const msg = new nanobuffer(50);
const getMsgs = () => Array.from(msg).reverse();

const server = http.createServer(handleHttpRequest);

// Handle WebSocket upgrades
server.on("upgrade", (req, socket) => {
  if (req.headers["upgrade"] !== "websocket") {
    socket.end("HTTP/1.1 400 Bad Request");
    return;
  }

  const acceptKey = req.headers["sec-websocket-key"];
  const acceptValue = computeWebSocketAcceptValue(acceptKey);
  const headers = [
    "HTTP/1.1 101 Switching Protocols",
    "Upgrade: websocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${acceptValue}`,
    "Sec-WebSocket-Protocol: json",
    "\r\n",
  ];

  socket.write(headers.join("\r\n"));

  // Send existing messages upon connection
  socket.write(objToResponse({ msg: getMsgs() }));

  connections.push(socket);

  socket.on("data", (buffer) => {
    const message = parseMessage(buffer);
    if (message) {
      console.log("Received message:", message);
      msg.push({
        user: message.user,
        text: message.text,
        time: Date.now(),
      });

      // Broadcast updated messages to all connected clients
      const response = objToResponse({ msg: getMsgs() });
      connections.forEach((s) => s.write(response));
    } else if (message === null) {
      // Connection closed
      socket.end();
    }
  });

  socket.on("end", () => {
    connections = connections.filter((s) => s !== socket);
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
    connections = connections.filter((s) => s !== socket);
    socket.destroy();
  });
});

const port = process.env.PORT || 8080;
server.listen(port, () =>
  console.log(`WebSocket server running at ws://localhost:${port}`)
);
