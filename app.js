import express from "express";
import { createServer } from "http";
import { performMatching } from "./src/performMatching.js";
import createSocket from "./io.js";

const app = express();
const server = createServer(app);
const port = 3000;

app.get("/", (req, res) => {
  res.send(`<h1>Socket Server is Runnig at Port ${port}</h1>`);
});

server.listen(3000, () => {
  console.log(`Node.js Server is runnig at PORT ${port}`);
});

createSocket(server);
setInterval(performMatching, 3000);
