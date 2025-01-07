export type Position = {
  readonly x: number;
  readonly y: number;
};

export const ORIGIN: Position = newPosition(0, 0);
export const UP: Position = newPosition(0, 1);
export const DOWN: Position = newPosition(0, -1);
export const LEFT: Position = newPosition(-1, 0);
export const RIGHT: Position = newPosition(1, 0);

export function newPosition(x: number, y: number): Position {
  return { x, y };
}

export function serializePosition(p: Position): string {
  return JSON.stringify(p);
}

export function deserializePosition(s: string): Position {
  const { x, y } = JSON.parse(s);
  return { x, y };
}

export function areAdjacent(a: Position, b: Position): boolean {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
}

export function add(a: Position, b: Position): Position {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function subtract(a: Position, b: Position): Position {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function multiply(p: Position, n: number): Position {
  return { x: p.x * n, y: p.y * n };
}

export function divide(p: Position, n: number): Position {
  return { x: p.x / n, y: p.y / n };
}

export function floor(p: Position): Position {
  return { x: Math.floor(p.x), y: Math.floor(p.y) };
}

export function ceil(p: Position): Position {
  return { x: Math.ceil(p.x), y: Math.ceil(p.y) };
}

export function round(p: Position): Position {
  return { x: Math.round(p.x), y: Math.round(p.y) };
}

export function up(p: Position, n: number): Position {
  return { x: p.x, y: p.y + n };
}

export function down(p: Position, n: number): Position {
  return { x: p.x, y: p.y - n };
}

export function left(p: Position, n: number): Position {
  return { x: p.x - n, y: p.y };
}

export function right(p: Position, n: number): Position {
  return { x: p.x + n, y: p.y };
}

export function getAdjacent(p: Position): Position[] {
  return [up(p, 1), down(p, 1), left(p, 1), right(p, 1)];
}

export function distanceTo(a: Position, b: Position): number {
  return Math.sqrt(Math.abs(a.x - b.x) ** 2 + Math.abs(a.y - b.y) ** 2);
}

export function equals(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}
