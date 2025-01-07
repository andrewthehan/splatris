export class Position {
  static readonly ORIGIN = new Position(0, 0);
  static readonly UP = new Position(0, 1);
  static readonly DOWN = new Position(0, -1);
  static readonly LEFT = new Position(-1, 0);
  static readonly RIGHT = new Position(1, 0);

  constructor(
    readonly x: number,
    readonly y: number,
  ) {}

  static serialize(p: Position): string {
    return JSON.stringify(p);
  }

  static deserialize(s: string): Position {
    const { x, y } = JSON.parse(s);
    return new Position(x, y);
  }

  static areAdjacent(a: Position, b: Position): boolean {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
  }

  add(other: Position): Position {
    return new Position(this.x + other.x, this.y + other.y);
  }

  subtract(other: Position): Position {
    return new Position(this.x - other.x, this.y - other.y);
  }

  multiply(n: number): Position {
    return new Position(this.x * n, this.y * n);
  }

  divide(n: number): Position {
    return new Position(this.x / n, this.y / n);
  }

  floor(): Position {
    return new Position(Math.floor(this.x), Math.floor(this.y));
  }

  ceil(): Position {
    return new Position(Math.ceil(this.x), Math.ceil(this.y));
  }

  round(): Position {
    return new Position(Math.round(this.x), Math.round(this.y));
  }

  up(n: number): Position {
    return new Position(this.x, this.y + n);
  }

  down(n: number): Position {
    return new Position(this.x, this.y - n);
  }

  left(n: number): Position {
    return new Position(this.x - n, this.y);
  }

  right(n: number): Position {
    return new Position(this.x + n, this.y);
  }

  getAdjacent(): Position[] {
    return [this.up(1), this.down(1), this.left(1), this.right(1)];
  }

  distanceTo(other: Position): number {
    return Math.sqrt(Math.abs(this.x - other.x) ** 2 + Math.abs(this.y - other.y) ** 2);
  }

  equals(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }
}
