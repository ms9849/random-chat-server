import { globals } from "../globals.js";

export function matchFound(user, roomNumber) {
  // 매칭 완료. performMatching 함수와 이어지는 이벤트이며, matchFound는 서버 내부에서 발생시키는 이벤트다.

  user.join(roomNumber);
  user.roomNumber = roomNumber;
  user.status = globals.status["CHATTING"];
  console.log(
    "match found. socket id is : " +
      user.id +
      " and room number is " +
      user.roomNumber
  );
  // 클라이언트에서 이 이벤트 받으면 Navigator.push로 화면 넘어가야함.
  user.emit("matchFound", roomNumber);
}
