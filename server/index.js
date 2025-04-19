const { Server } = require("colyseus");
const http = require("http");

const port = 2567;
const server = http.createServer();
const gameServer = new Server({ server });

gameServer.define("arena", class {}); // Placeholder room

server.listen(port, () => {
  console.log(`Colyseus server listening on ws://localhost:${port}`);
});
