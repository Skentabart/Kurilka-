const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

let clients = {};

wss.on("connection", ws => {
  ws.on("message", message => {
    let data = JSON.parse(message);
    clients[data.from] = ws; // register user

    if (data.to && clients[data.to]) {
      clients[data.to].send(JSON.stringify(data)); // forward signal
    }
  });

  ws.on("close", () => {
    // remove disconnected user
    for (let key in clients) {
      if (clients[key] === ws) delete clients[key];
    }
  });
});

console.log("Signaling server running at ws://localhost:8080");