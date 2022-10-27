import { Coord } from "./types/Coord";
import { Table } from "./Table";
import { Direction } from "./types/Direction";
import { rand } from "./Helpers";
import { PointType } from "./types/PointType";

export class Snake {
  private table: Table;
  private body: Coord[] = [];
  private direction: Direction;
  private speed: number = 200;
  private lastTick?: Date;
  private live = true;

  constructor(table: Table) {
    this.table = table;
    this.direction = rand(4);

    const size = this.table.getSize();
    this.body.push({
      x: Math.floor(size.x / 2),
      y: Math.floor(size.y / 2),
    });
  }

  private getHead() {
    return this.body.slice(-1)[0];
  }

  private cutTail(): Coord {
    return this.body.shift() || { x: 0, y: 0 };
  }

  public setDirection(direcrtion: Direction) {
    if (!this.live) return;

    if (this.direction == Direction.up && direcrtion == Direction.down) return;
    if (this.direction == Direction.down && direcrtion == Direction.up) return;
    if (this.direction == Direction.left && direcrtion == Direction.right) return;
    if (this.direction == Direction.right && direcrtion == Direction.left) return;

    this.direction = direcrtion;
  }

  public update() {
    const currentDate = new Date();

    // first tick
    if (!this.lastTick) {
      this.lastTick = new Date();
      const size = this.table.getSize();
      this.spawnFood(Math.floor(size.x * size.y / 128));
      this.tick();
    }

    const timeDiff = currentDate.getTime() - this.lastTick.getTime();
    if (timeDiff > this.speed) {
      this.lastTick = currentDate;
      this.tick();
    }
  }

  private tick() {
    if (!this.live) return;

    const head = this.getHead();

    let coord = { ...head };
    if (this.direction == Direction.up) coord.y -= 1;
    if (this.direction == Direction.right) coord.x += 1;
    if (this.direction == Direction.down) coord.y += 1;
    if (this.direction == Direction.left) coord.x -= 1;

    /*
    const size = this.table.getSize();
    if (coord.x >= size.x) coord.x = 0;
    if (coord.x < 0) coord.x = size.x - 1;
    if (coord.y >= size.y) coord.y = 0;
    if (coord.y < 0) coord.y = size.y - 1;
    */

    const coordPointType = this.table.getPointType(coord);
    if (coordPointType == PointType.none) {
      const tail = this.cutTail();
      this.table.setPoint({
        ...tail,
        type: PointType.none,
      });
    }
    if (coordPointType == PointType.food) {
      this.spawnFood();
      this.table.upScore();
    }
    if (coordPointType == PointType.snake || coordPointType == PointType.wall) {
      this.live = false;
      return;
    }
    this.body.push(coord);
    this.table.setPoint({ ...coord, type: PointType.snake });
  }

  private spawnFood(count = 1) {
    const size = this.table.getSize();
    let i =  0;
    while (i < count) {
      const coord = { x: rand(size.x), y: rand(size.y)};
      if (this.table.getPointType(coord) == PointType.none) {
        i++;
        this.table.setPoint({ ...coord, type: PointType.food });
      }
    }
  }

  public isLive() {
    return this.live;
  }
}
