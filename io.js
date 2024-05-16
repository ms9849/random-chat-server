import { Server } from "socket.io";
import { User } from "./models/User.js";
import { globals } from "./globals.js";

const socketHandler = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("SOMEONE HAS CONNECTED!! SOCKET ID is ", socket.id);

    // 매칭 시작
    socket.on("matchStart", (data) => matchStart(socket, data));

    // 매칭 취소
    socket.on("matchQuit", (data) => matchQuit(socket));

    // 채팅 전송
    socket.on("messageSend", (data) => messageSend(socket, data, io));

    // 채팅 퇴장
    socket.on("roomQuit", (data) => roomQuit(socket));
  });
};

function matchStart(socket, nickname) {
  console.log("match start!");
  socket.nickname = nickname;
  globals.matchQueue.push(new User(socket, socket.nickname));
  socket.emit("matchStartResponse");
}

function matchQuit(socket) {
  globals.matchQueue = globals.matchQueue.filter(
    (user) => user.socket.id !== socket.id
  ); // 매칭 취소한 유저 정보만 삭제
  socket.emit("matchQuitResponse");
}

function messageSend(socket, data, io) {
  console.log("messeage: " + data);
  io.sockets.to(socket.roomNumber).emit("message", data);
}

function roomQuit(socket) {
  socket.leave(socket.roomNumber); // 방 퇴장.
  socket.emit("matchFound");
  console.log(io.sockets.adapter.rooms.get(socket.roomNumber)?.size);
}
export default socketHandler;
