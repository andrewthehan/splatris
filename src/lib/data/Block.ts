import type { PositionMap } from '../math/PositionMap';
import type { Player } from './Player';
import type { Tile } from './Tile';

export type Block = {
  owner: Player;
  tiles: PositionMap<BlockTile>;
};

export type BlockTile = {} & Tile;
