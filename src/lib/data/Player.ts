import { ORIGIN, type Position } from '$lib/data/Position';
import type { Block } from './Block';
import type { Identifiable } from './Identifiable';

export type Player = Identifiable & {
  name: string;
  hue: number;

  isLobbyAdmin: boolean;
  isReady: boolean;
  block: Block;
  offset: Position;
};

export function createPlayer(
  configurableFields: Omit<Omit<Omit<Player, 'block'>, 'offset'>, 'isReady'>
): Player {
  return {
    ...configurableFields,
    isReady: false,
    block: { tiles: {} },
    offset: ORIGIN,
  };
}
