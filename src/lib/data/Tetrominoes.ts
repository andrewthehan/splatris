import { Position } from '../math/Position';

export enum TetrominoShape {
  I = 'I',
  J = 'J',
  L = 'L',
  O = 'O',
  S = 'S',
  T = 'T',
  Z = 'Z',
}

export const Tetrominoes: Record<TetrominoShape, Position[]> = {
  [TetrominoShape.I]: [
    new Position(-1, 0),
    new Position(0, 0),
    new Position(1, 0),
    new Position(2, 0),
  ],
  [TetrominoShape.J]: [
    new Position(-1, 1),
    new Position(-1, 0),
    new Position(0, 0),
    new Position(1, 0),
  ],
  [TetrominoShape.L]: [
    new Position(1, 1),
    new Position(-1, 0),
    new Position(0, 0),
    new Position(1, 0),
  ],
  [TetrominoShape.O]: [
    new Position(0, 1),
    new Position(1, 1),
    new Position(0, 0),
    new Position(1, 0),
  ],
  [TetrominoShape.S]: [
    new Position(0, 1),
    new Position(1, 1),
    new Position(-1, 0),
    new Position(0, 0),
  ],
  [TetrominoShape.T]: [
    new Position(0, 1),
    new Position(-1, 0),
    new Position(0, 0),
    new Position(1, 0),
  ],
  [TetrominoShape.Z]: [
    new Position(-1, 1),
    new Position(0, 1),
    new Position(0, 0),
    new Position(1, 0),
  ],
};
