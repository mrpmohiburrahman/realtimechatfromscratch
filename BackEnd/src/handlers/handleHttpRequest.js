export function handleHttpRequest(req, res) {
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "Healthy" }));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Route Not Found");
  }
}
