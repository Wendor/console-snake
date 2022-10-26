import { createTerminal } from 'terminal-kit';
import readline from 'readline';
import { exit } from 'process';

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

const term = createTerminal();

const tableXSize = 8;
const tableYSize = 16;

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
const rand = (max: number) => Math.floor(Math.random() * max);


const map: boolean[][] = (new Array(tableXSize)).fill([]).map((): boolean[] => (new Array(tableYSize)).fill(false));
const last: { x: number, y: number, val: boolean } = { x: 0, y: 0, val: false };

process.stdin.on('keypress', (str, key) => {
  if (last.x + 1 < tableXSize) {
    last.x += 1;
  } else {
    last.x = 0;
    last.y += 1;
  }
  if (last.y + 1 > tableYSize) {
    last.y = 0;
  }
  //last.x = last.x + 1 < tableXSize ? last.x + 1 : 0;
  //last.y = last.y + 1 < tableXSize ? last.y + 1 : 0;
  //last.val = 1;
  map[last.x][last.y] = !map[last.x][last.y];

  if (key.ctrl == true && key.name == 'c') {
    term.hideCursor(false);
    process.exit(0);
  }
  return;
});

(async () => {
  term.clear();
  term.hideCursor();
  while(true) {
    term.moveTo(0,0);
    for (let x in map) {
      for (let y in map[x]) {
        if (!map[x][y]) {
          term.bgBlue('  ');
        } else {
          term.bgRed('  ');
        }
      }
      term('\n');
    }
    term(JSON.stringify(last) + '\n');
    await sleep(10);
    term.moveTo(1, 1);
  }
})();
