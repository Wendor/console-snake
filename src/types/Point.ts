import { Coord } from "./Coord";
import { PointType } from "./PointType";

export interface Point extends Coord {
  type: PointType;
}
