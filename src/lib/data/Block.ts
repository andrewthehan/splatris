import type { PositionMap } from '../math/PositionMap';
import type { Tile } from './Tile';

export type Block = {
  tiles: PositionMap<Tile>;
};
