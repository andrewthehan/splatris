import {
  add,
  deserializePosition,
  divide,
  getAdjacent,
  newPosition,
  serializePosition,
  type Position,
} from './Position';

export type PositionMap<T> = {
  [position: string]: T;
};

export class PositionMapWrapper<T> {
  constructor(readonly objects: PositionMap<T> = {}) {}

  unwrap(): PositionMap<T> {
    return this.objects;
  }

  key(p: Position): string {
    return serializePosition(p);
  }

  positions(): Position[] {
    return Object.keys(this.objects).map(deserializePosition);
  }

  values(): T[] {
    return Object.values(this.objects);
  }

  entries(): [Position, T][] {
    return Object.entries(this.objects).map(([key, value]) => {
      return [deserializePosition(key), value];
    });
  }

  set(p: Position, obj: T): PositionMapWrapper<T> {
    this.objects[this.key(p)] = obj;
    return this;
  }

  has(p: Position): boolean {
    return this.key(p) in this.objects;
  }

  hasAll(positions: Position[]): boolean {
    return positions.every((p) => this.has(p));
  }

  get(p: Position): T | undefined {
    return this.objects[this.key(p)];
  }

  delete(p: Position): boolean {
    const key = this.key(p);
    if (key in this.objects) {
      delete this.objects[key];
      return true;
    }
    return false;
  }

  clear(): void {
    Object.keys(this.objects).forEach((key) => delete this.objects[key]);
  }

  getAdjacent(p: Position): T[] {
    return getAdjacent(p)
      .filter((p) => this.has(p))
      .map((p) => this.get(p)!!);
  }

  getAdjacentPositions(): Position[] {
    return this.positions().flatMap((p) => getAdjacent(p).filter((p) => !this.has(p)));
  }

  center(): Position {
    const keys = this.positions();

    const xs = keys.map((p) => p.x);
    const ys = keys.map((p) => p.y);
    const min = newPosition(Math.min(...xs), Math.min(...ys));
    const max = newPosition(Math.max(...xs), Math.max(...ys));
    return divide(add(min, max), 2);
  }

  mapPositions(block: (p: Position) => Position): PositionMapWrapper<T> {
    const map = new PositionMapWrapper<T>();
    this.entries().forEach(([p, obj]) => map.set(block(p), obj));
    return map;
  }

  mapObjects<U>(block: (p: Position, obj: T) => U): PositionMapWrapper<U> {
    const map = new PositionMapWrapper<U>();
    this.entries().forEach(([p, obj]) => map.set(p, block(p, obj)));
    return map;
  }

  filter(block: (p: Position, obj: T) => boolean): PositionMapWrapper<T> {
    const map = new PositionMapWrapper<T>();
    this.entries().forEach(([p, obj]) => {
      if (block(p, obj)) {
        map.set(p, obj);
      }
    });
    return map;
  }

  clone(): PositionMapWrapper<T> {
    return this.mapPositions((p) => p);
  }

  static merge<T>(
    target: PositionMapWrapper<T>,
    ...sources: PositionMapWrapper<T>[]
  ): PositionMapWrapper<T> {
    sources.forEach((map) => map.entries().forEach(([p, obj]) => target.set(p, obj)));
    return target;
  }
}
