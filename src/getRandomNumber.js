import { globals } from "../globals.js";

export function getRandomNumber() {
  let num;
  do {
    num = Math.floor(Math.random() * 1000) + 1;
  } while (globals.rooms[num]);
  globals.rooms.push(num);
  return num;
}
