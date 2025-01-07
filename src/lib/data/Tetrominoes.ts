import { PositionMap } from '$lib/math/PositionMap';
import { SvelteMap } from 'svelte/reactivity';
import { Position } from '../math/Position';
import type { Block, BlockTile } from './Block';
import type { Player } from './Player';
import { RandomBagIterator } from './RandomBag';
import { createTile } from './Tile';

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

export function createBlockBag(owner: Player) {
  return new RandomBagIterator<TetrominoShape, Block>(
    Object.values(TetrominoShape) as TetrominoShape[],
    (shape) => ({
      owner,
      tiles: Tetrominoes[shape].reduce(
        (map, position, i) => map.set(position, createTile({ owner })),
        new PositionMap<BlockTile>(() => new SvelteMap()),
      ),
    }),
  );
}
