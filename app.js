import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { getRandomNumber } from "./lib/getRandomNumber.js";
import { User } from "./lib/User.js";
import { matchFound } from "./lib/matchFound.js";

const app = express();
const server = createServer(app); // express server
const io = new Server(server); // io server
const port = 3000;

let rooms = []; // 방 번호 저장하는 배열, 실제로는 DB를 사용해서 DB와 통신해야 한다.
let matchQueue = []; // 매칭중인 유저들을 저장하는 배열, 레디스에 저장해야한다.

io.on("connection", (socket) => {
  console.log("SOMEONE HAS CONNECTED!! SOCKET ID is ", socket.id);

  // 매칭 시작 ~ 매칭 중
  socket.on("matchStart", (nickname) => {
    console.log("match start!");
    socket.nickname = nickname;
    matchQueue.push(new User(socket, socket.nickname));
    socket.emit("matchStartResponse");
  });

  // 매칭 취소
  socket.on("matchQuit", () => {
    matchQueue.filter((user) => user.socket.id !== socket.id); // 매칭 취소한 유저 정보만 삭제
    socket.emit("matchQuitResponse");
  });

  // 메세지 전송시 발생하는 이벤트
  socket.on("messageSend", (data) => {
    console.log("messeage: " + data);
    io.sockets.to(socket.roomNumber).emit("message", data);
  });

  // 채팅 종료
  socket.on("roomQuit", (data) => {
    socket.disconnect(socket.roomNumber); // 방 퇴장.
    socket.emit("matchFound");
    console.log(io.sockets.in(roomNumber).length);
  });
});

app.get("/", (req, res) => {
  res.send("<h1>Socket.io Server is running</h1>");
});

server.listen(3000, () => {
  console.log(`server running at port:${port}`);
});

/* 
매칭을 수행하는 함수, setInterval 함수를 이용하여 무한 반복되는 함수.
matchQueue에 존재하는 유저 2명의 정보를 FIFO 순으로 추출하고,
임의의 roomNumber를 생성하여 각 유저의 socket에 matchFind 이벤트를 발생시킨다.
이 때, roomNumber는 1~1000 사이의 난수로 지정된다. 
*/
setInterval(() => {
  if (matchQueue == undefined || matchQueue.length < 2) return; // 길이 2 이하면 아무것도 수행 안함.

  while (matchQueue.length > 1) {
    let roomNumber = getRandomNumber(rooms);
    for (let num = 0; num < 2; num++) {
      let user = matchQueue.shift();
      matchFound(user, roomNumber);
    }
  }
}, 3000);

/**
 *     io.to(socket.id).emit("test", {
      message: "매칭 시작",
    });
 */
