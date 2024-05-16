export function matchFound(user, roomNumber) {
  // 매칭 완료. matching 함수와 이어지는 이벤트이며, matchFind는 서버 내부에서 발생시키는 이벤트다.
  user.socket.join(roomNumber);

  user.socket.roomNumber = roomNumber;
  console.log(user.nickname);

  // 클라이언트에서 이 이벤트 받으면 Navigator.push로 화면 넘어가야함.
  user.socket.emit("matchFound", roomNumber);
}
