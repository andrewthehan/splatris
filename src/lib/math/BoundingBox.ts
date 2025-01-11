import { add, divide, newPosition, ORIGIN, type Position } from '../data/Position';
import { EMPTY, type Size } from './Size';

export class BoundingBox {
  private static readonly EMPTY = new BoundingBox(ORIGIN, EMPTY);

  constructor(
    readonly origin: Position,
    readonly size: Size
  ) {}

  static fromPositions(positions: Position[]): BoundingBox {
    if (positions.length === 0) {
      return BoundingBox.EMPTY;
    }

    const xs = positions.map((position) => position.x);
    const ys = positions.map((position) => position.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const width = Math.max(...xs) - minX + 1;
    const height = Math.max(...ys) - minY + 1;

    return new BoundingBox(newPosition(minX, minY), { width, height });
  }

  get center(): Position {
    return add(divide(newPosition(this.size.width, this.size.height), 2), this.origin);
  }

  get top(): number {
    return this.origin.y + this.size.height;
  }

  get bottom(): number {
    return this.origin.y;
  }

  get left(): number {
    return this.origin.x;
  }

  get right(): number {
    return this.origin.x + this.size.width;
  }
}
