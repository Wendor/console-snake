import { createTerminal } from 'terminal-kit';
import { Point } from './types/Point';
import { PointType } from './types/PointType';
import { Coord } from './types/Coord';

export class Table {
  private map: number[][] = [];
  private changes: Point[] = [];
  private term = createTerminal();
  private frames: number = 0;
  private fps: number = 0;
  private lastTime: Date = new Date();
  private size: Coord;
  private score = 0;

  constructor(size: Coord = { x: 16, y: 16 }) {
    this.size = size;
    this.map = (new Array(size.y)).fill([]).map((): number[] => (new Array(size.x)).fill(0));

    this.map.forEach((yVal, y) => {
      yVal.forEach((xVal, x) => {
        this.changes.push({ x, y, type: xVal});
      });
    });

    this.term.clear();
    this.term.hideCursor(true);
  }

  public exit() {
    this.term.hideCursor(false);
  }

  public update() {
    const currentDate = new Date();
    if (currentDate.getSeconds() !== this.lastTime.getSeconds()) {
      this.fps = this.frames;
      this.frames = 0;
    }
    this.lastTime = new Date();
    this.frames++;

    while (this.changes.length) {
      const point = this.changes.shift();
      if (!point) break;
      this.term.moveTo(1 + point.x * 2, 1 + point.y);
      if (point.type == PointType.none) this.term.bgBlue('  ');
      if (point.type == PointType.snake) this.term.bgRed('  ');
      if (point.type == PointType.food) this.term.bgGreen('  ');
    }
    this.term.moveTo(1, 1 + this.map.length);
    this.term('fps: ' + this.fps + '    score: ' + this.score);
  }

  public getPointType(coord: Coord) {
    if (this.map[coord.y] == undefined || this.map[coord.y][coord.x] == undefined) {
      return PointType.wall;
    }
    return this.map[coord.y][coord.x];
  }

  public setPoint(point: Point) {
    this.changes.push(point);
    this.map[point.y][point.x] = point.type;
  }

  public upScore() {
    this.score++;
  }

  public getSize(): Coord {
    return this.size;
  }
}
