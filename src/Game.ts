import readline from 'readline';
import { sleep } from "./Helpers";
import { Snake } from './Snake';
import { Table } from "./Table";
import { Direction } from './types/Direction';

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

export class Game {
  private table: Table;
  private snake: Snake;
  private interval: ReturnType<typeof setInterval>|undefined;

  constructor() {
    this.table = new Table();
    this.snake = new Snake(this.table);
    process.stdout.on( 'resize' , () => this.restart());
  }

  public run() {
    process.stdin.on('keypress', (str, key) => this.keyHandler(str, key));
    this.interval = setInterval(() => {
      this.snake.update();
      this.table.update();
    }, 15);
  }

  private async keyHandler(_str: any, key: any) {
      if (key.ctrl == true && key.name == 'c') {
        this.table.exit();
        if (this.interval) {
          clearInterval(this.interval);
        }
        process.exit(0);
      }
      if (key.name == 'up') this.snake.setDirection(Direction.up);
      if (key.name == 'left') this.snake.setDirection(Direction.left);
      if (key.name == 'right') this.snake.setDirection(Direction.right);
      if (key.name == 'down') this.snake.setDirection(Direction.down);
      if (key.name == 'space' && !this.snake.isLive()) {
        this.restart();
      }
  }

  private restart() {
    this.table = new Table();
    this.snake = new Snake(this.table);
  }
}
