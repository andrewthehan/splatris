import { v4 as uuidv4 } from 'uuid';
import type { Identifiable } from './Identifiable';

export type Tile = Identifiable & {
  ownerId: string | undefined;
};

export function createTile(allFieldsExceptId: Omit<Tile, keyof Identifiable>): Tile {
  return {
    id: uuidv4(),
    ...allFieldsExceptId,
  };
}
