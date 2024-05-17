import { matchFound } from "./matchFound.js";
import { getRandomNumber } from "./getRandomNumber.js";
import { globals } from "../globals.js";
/* 
매칭을 수행하는 함수, setInterval 함수를 이용하여 무한 반복.
matchQueue에 존재하는 유저 2명의 정보를 FIFO 순으로 추출하고,
임의의 roomNumber를 생성하여 각 유저의 socket에 matchFind 이벤트를 발생시킨다.
이 때, roomNumber는 1~1000 사이의 난수로 지정된다. 
*/
export function performMatching() {
  if (globals.matchQueue == undefined || globals.matchQueue.length < 2) return; // 길이 2 이하면 아무것도 수행 안함.
  while (globals.matchQueue.length > 1) {
    let roomNumber = getRandomNumber();
    for (let num = 0; num < 2; num++) {
      let user = globals.matchQueue.shift();
      matchFound(user, roomNumber);
    }
  }
}
