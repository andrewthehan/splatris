import { v4 as uuidv4 } from 'uuid';

export type Player = {
  id: string;
  hue: number;
};

export function createPlayer(allFieldsExceptId: Omit<Player, 'id'>): Player {
  return {
    id: uuidv4(),
    ...allFieldsExceptId,
  };
}
