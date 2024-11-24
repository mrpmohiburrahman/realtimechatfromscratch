// src/server.js
import http from "node:http";
import nanobuffer from "nanobuffer";
import objToResponse from "./obj-to-response.js";
import generateAcceptValue from "./generate-accept-value.js";
import parseMessage from "./parse-message.js";

let connections = [];
const msg = new nanobuffer(50);
const getMsgs = () => Array.from(msg).reverse();

// Initial message for demonstration
msg.push({
  user: "brian",
  text: "hi",
  time: Date.now(),
});

// Create HTTP server without serving static files
const server = http.createServer((request, response) => {
  // Optionally, handle HTTP requests here (e.g., health checks)
  if (request.method === "GET" && request.url === "/health") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ status: "OK" }));
  } else {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("Not Found");
  }
});

// Handle WebSocket upgrades
server.on("upgrade", (req, socket) => {
  if (req.headers["upgrade"] !== "websocket") {
    // Only handle WebSocket requests
    socket.end("HTTP/1.1 400 Bad Request");
    return;
  }

  const acceptKey = req.headers["sec-websocket-key"];
  const acceptValue = generateAcceptValue(acceptKey);
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
