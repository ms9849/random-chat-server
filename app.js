import * as express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";

const app = express();
const server = createServer(app); // express server
const io = Server.listen(server); // io server
const port = 3000;

let rooms = []; // 방 번호 저장하는 배열, 실제로는 DB를 사용해서 DB와 통신해야 할 것 같다는 생각이 강하게 든다.

function getRandomNumber(min, max) {
  do {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } while (rooms[num]);
  return num;
}

app.get("/", (req, res) => {
  res.send("<h1>Socket.io Server is running</h1>");
});

server.listen(3000, () => {
  console.log(`server running at port:${port}`);
});

io.on("connection", (socket) => {
  socket.on("matchStart", (data) => {}); // 매칭 시작 ~ 매칭 중

  socket.on("matchFind", (data) => {}); // 매칭이 완료된 후, 방 코드 생성 후 할당까지 완료함. 클라이언트 쪽에서 이 때 채팅방으로 넘어가야함

  socket.on("chatting", (data) => {}); // 채팅 이벤트

  socket.on("roomQuit", (data) => {}); // 채팅 종료.
});
