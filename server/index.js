const { Server } = require("colyseus");
const http = require("http");
const { Schema, type, MapSchema } = require("@colyseus/schema");

const port = 2567;
const server = http.createServer();
const gameServer = new Server({ server });

// --- Colyseus Schema ---
class CarState extends Schema {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.heading = 0;
    this.id = "";
  }
}
type("number")(CarState.prototype, "x");
type("number")(CarState.prototype, "y");
type("number")(CarState.prototype, "heading");
type("string")(CarState.prototype, "id");

class State extends Schema {
  constructor() {
    super();
    this.cars = new MapSchema();
  }
}
type({ map: CarState })(State.prototype, "cars");

// --- Colyseus Room ---
const { Room } = require("colyseus");
class CarRoom extends Room {
  onCreate(options) {
    if (options && options.roomId) {
      this.roomId = options.roomId;
    }
    this.setState(new State());
    console.log(`[Colyseus] Room created: ${this.roomId}`);
    this.onMessage("input", (client, data) => {
      const car = this.state.cars[client.sessionId];
      if (!car) return;
      car.x = data.x;
      car.y = data.y;
      car.heading = data.heading;
    });
  }
  onJoin(client) {
    const car = new CarState();
    car.id = client.sessionId;
    this.state.cars[client.sessionId] = car;
    console.log(`[Colyseus] Client joined: ${client.sessionId} in room ${this.roomId}`);
  }
  onLeave(client) {
    delete this.state.cars[client.sessionId];
    console.log(`[Colyseus] Client left: ${client.sessionId} in room ${this.roomId}`);
  }
  onDispose() {
    console.log(`[Colyseus] Room disposed: ${this.roomId}`);
  }
}

gameServer.define("arena", CarRoom).filterBy(['roomId']);

server.listen(port, () => {
  console.log(`Colyseus server listening on ws://localhost:${port}`);
});
