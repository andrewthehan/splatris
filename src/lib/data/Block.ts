import type { PositionMap } from './PositionMap';
import type { Tile } from './Tile';

export type Block = {
  tiles: PositionMap<Tile>;
};
