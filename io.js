import { Server } from "socket.io";
import { globals } from "./globals.js";

const createSocket = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("SOMEONE HAS CONNECTED!! SOCKET ID is ", socket.id);
    socket.roomNumber = 0;
    socket.status = globals.status["INLOBBY"];
    // 매칭 시작
    socket.on("matchStart", (data) => matchStart(socket, data));

    // 매칭 취소
    socket.on("matchQuit", () => matchQuit(socket));

    // 채팅 전송
    socket.on("messageSend", (data) => messageSend(socket, data, io));

    // 채팅 퇴장
    socket.on("roomQuit", () => roomQuit(socket, io));

    // 소켓 연결 종료
    socket.on("disconnect", () => disconnected(socket));
  });
};

function matchStart(socket) {
  if (socket.status != globals.status["INLOBBY"] && socket.roomNumber != 0)
    return;

  socket.status = globals.status["MATCHING"];
  globals.matchQueue.push(socket);
}

function matchQuit(socket) {
  globals.matchQueue = globals.matchQueue.filter(
    (user) => user.id !== socket.id
  ); // 매칭 취소한 유저 정보만 삭제
  socket.status = globals.status["INLOBBY"];
}

function messageSend(socket, data, io) {
  console.log(
    "messeage: " +
      data.message +
      ", and room number is " +
      socket.roomNumber +
      " and animal is " +
      data.animal
  );
  io.sockets.to(socket.roomNumber).emit("message", {
    message: data.message,
    sender: socket.id,
    nickname: data.nickname,
    animal: data.animal,
  }); // flutter 쪽에서 메세지의 전송자에 따라 다르게 구성해야함.
}

function roomQuit(socket, io) {
  let roomNumber = socket.roomNumber;
  socket.leave(socket.roomNumber); // 방 퇴장.
  socket.status = globals.status["INLOBBY"];
  socket.roomNumber = 0;
  io.sockets.to(roomNumber).emit("partnerRoomQuit");

  console.log(
    socket.nickname +
      " 님이 퇴장했습니다. " +
      roomNumber +
      " 방에 남은 인원수: " +
      io.sockets.adapter.rooms.get(roomNumber)?.size
  );
}

function disconnected(socket) {
  console.log(socket.id + " has disconnected from socket");
}
export default createSocket;
