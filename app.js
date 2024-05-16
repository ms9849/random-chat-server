import express from "express";
import { createServer } from "http";
import { performMatching } from "./src/performMatching.js";
import socketHandler from "./io.js";

const app = express();
const server = createServer(app); // express server
const port = 3000;

app.get("/", (req, res) => {
  res.send("<h1>Socket.io Server is running</h1>");
});

server.listen(3000, () => {
  console.log(`server running at port:${port}`);
});

socketHandler(server);
setInterval(performMatching, 3000);
