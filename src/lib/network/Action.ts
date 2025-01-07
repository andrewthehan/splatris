import type { Player } from '$lib/data/Player';
import type { PositionMap } from '$lib/data/PositionMap';
import type { Tile } from '$lib/data/Tile';

export enum Action {
  START_GAME = 'START_GAME',
  ADD_PLAYER = 'ADD_PLAYER',
  UPDATE_PLAYER = 'UPDATE_PLAYER',
  UPDATE_TILES = 'UPDATE_TILES',
}
