// utils/computeWebSocketAccept.js
import crypto from "node:crypto";

export default function computeWebSocketAcceptValue(key) {
  const GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
  return crypto
    .createHash("sha1")
    .update(key + GUID, "binary")
    .digest("base64");
}
