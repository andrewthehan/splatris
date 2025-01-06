import { Position } from './Position';
import { Size } from './Size';

export class BoundingBox {
  private static readonly EMPTY = new BoundingBox(Position.ORIGIN, Size.EMPTY);

  constructor(
    readonly origin: Position,
    readonly size: Size,
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

    return new BoundingBox(new Position(minX, minY), new Size(width, height));
  }

  get center(): Position {
    return new Position(this.size.width, this.size.height).divide(2).add(this.origin);
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
