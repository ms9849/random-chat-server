export function getRandomNumber(rooms) {
  let num;
  do {
    num = Math.floor(Math.random() * 1000) + 1;
  } while (rooms[num]);
  return num;
}
