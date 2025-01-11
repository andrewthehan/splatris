import { PositionMapWrapper } from '$lib/data/PositionMap';
import type { Player } from '../data/Player';
import { newPosition, type Position } from '../data/Position';
import { createTile, type Tile } from '../data/Tile';
import type { Block } from '../data/Block';
import { RandomBagIterator } from './RandomBag';

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
  [TetrominoShape.I]: [newPosition(-1, 0), newPosition(0, 0), newPosition(1, 0), newPosition(2, 0)],
  [TetrominoShape.J]: [
    newPosition(-1, 1),
    newPosition(-1, 0),
    newPosition(0, 0),
    newPosition(1, 0),
  ],
  [TetrominoShape.L]: [newPosition(1, 1), newPosition(-1, 0), newPosition(0, 0), newPosition(1, 0)],
  [TetrominoShape.O]: [newPosition(0, 1), newPosition(1, 1), newPosition(0, 0), newPosition(1, 0)],
  [TetrominoShape.S]: [newPosition(0, 1), newPosition(1, 1), newPosition(-1, 0), newPosition(0, 0)],
  [TetrominoShape.T]: [newPosition(0, 1), newPosition(-1, 0), newPosition(0, 0), newPosition(1, 0)],
  [TetrominoShape.Z]: [newPosition(-1, 1), newPosition(0, 1), newPosition(0, 0), newPosition(1, 0)],
};

export function createBlockBag(owner: Player) {
  return new RandomBagIterator<TetrominoShape, Block>(
    Object.values(TetrominoShape) as TetrominoShape[],
    (shape) => ({
      tiles: Tetrominoes[shape]
        .reduce(
          (map, position, i) => map.set(position, createTile({ ownerId: owner?.id })),
          new PositionMapWrapper<Tile>()
        )
        .unwrap(),
    })
  );
}
