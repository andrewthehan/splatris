import { ORIGIN, type Position } from '$lib/data/Position';
import { v4 as uuidv4 } from 'uuid';
import type { Block } from './Block';

export type Player = {
  id: string;

  name: string;
  hue: number;

  block: Block;
  offset: Position;
};

export function createPlayer(
  configurableFields: Omit<Omit<Omit<Player, 'id'>, 'block'>, 'offset'>,
): Player {
  return {
    ...configurableFields,
    id: uuidv4(),
    block: { tiles: {} },
    offset: ORIGIN,
  };
}