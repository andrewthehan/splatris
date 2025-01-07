import { v4 as uuidv4 } from 'uuid';

export type Tile = {
  readonly id: string;
  ownerId: string | undefined;
};

export function createTile(allFieldsExceptId: Omit<Tile, 'id'>): Tile {
  return {
    id: uuidv4(),
    ...allFieldsExceptId,
  };
}
