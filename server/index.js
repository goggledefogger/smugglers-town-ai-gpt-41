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
  onCreate() {
    this.setState(new State());
    this.onMessage("input", (client, data) => {
      const car = this.state.cars[client.sessionId];
      if (!car) return;
      // Update car state from input
      car.x = data.x;
      car.y = data.y;
      car.heading = data.heading;
    });
  }
  onJoin(client) {
    const car = new CarState();
    car.id = client.sessionId;
    this.state.cars[client.sessionId] = car;
  }
  onLeave(client) {
    delete this.state.cars[client.sessionId];
  }
}

gameServer.define("arena", CarRoom);

server.listen(port, () => {
  console.log(`Colyseus server listening on ws://localhost:${port}`);
});
