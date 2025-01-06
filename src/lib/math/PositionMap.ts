import { Position } from './Position';

export class PositionMap<T> {
  readonly objects: Map<string, T> = new Map();

  key(p: Position): string {
    return Position.serialize(p);
  }

  positions(): Position[] {
    return Array.from(this.objects.keys()).map(Position.deserialize);
  }

  values(): T[] {
    return Array.from(this.objects.values());
  }

  entries(): [Position, T][] {
    return Array.from(this.objects.entries()).map(([key, value]) => {
      return [Position.deserialize(key), value];
    });
  }

  set(p: Position, obj: T): PositionMap<T> {
    this.objects.set(this.key(p), obj);
    return this;
  }

  has(p: Position): boolean {
    return this.objects.has(this.key(p));
  }

  hasAll(positions: Position[]): boolean {
    return positions.every((p) => this.has(p));
  }

  get(p: Position): T | undefined {
    return this.objects.get(this.key(p));
  }

  delete(p: Position): boolean {
    return this.objects.delete(this.key(p));
  }

  clear(): void {
    this.objects.clear();
  }

  getAdjacent(p: Position): T[] {
    return p
      .getAdjacent()
      .filter((p) => this.has(p))
      .map((p) => this.get(p)!!);
  }

  getAdjacentPositions(): Position[] {
    return this.positions().flatMap((p) => p.getAdjacent().filter((p) => !this.has(p)));
  }

  center(): Position {
    const keys = this.positions();

    const xs = keys.map((p) => p.x);
    const ys = keys.map((p) => p.y);
    const min = new Position(Math.min(...xs), Math.min(...ys));
    const max = new Position(Math.max(...xs), Math.max(...ys));
    return min.add(max).divide(2);
  }

  mapPositions(block: (p: Position) => Position): PositionMap<T> {
    const map = new PositionMap<T>();
    this.entries().forEach(([p, obj]) => map.set(block(p), obj));
    return map;
  }

  clone(): PositionMap<T> {
    return this.mapPositions((p) => p);
  }

  static merge<T>(target: PositionMap<T>, ...sources: PositionMap<T>[]): PositionMap<T> {
    sources.forEach((map) => map.entries().forEach(([p, obj]) => target.set(p, obj)));
    return target;
  }
}
