import type { Player } from './Player';

export type Tile = {
  id: string;
  owner: Player | null;
};
