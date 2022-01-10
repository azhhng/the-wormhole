import { WormholeServer } from "./server";

const server = new WormholeServer();

server.listen(port => {
  console.log(`Server is listening on http://localhost:${port} or http://172.26.164.19:${port}`);
});