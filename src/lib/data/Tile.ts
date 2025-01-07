import type { Player } from './Player';
import { v4 as uuidv4 } from 'uuid';

export type Tile = {
  readonly id: string;
  owner: Player | null;
};

export function createTile(allFieldsExceptId: Omit<Tile, 'id'>): Tile {
  return {
    id: uuidv4(),
    ...allFieldsExceptId,
  };
}
