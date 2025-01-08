import type { Player } from '$lib/data/Player';
import type { PositionMap } from '$lib/data/PositionMap';
import type { Tile } from '$lib/data/Tile';

export enum Action {
  START_GAME = 'START_GAME',
  ADD_PLAYER = 'ADD_PLAYER',
  UPDATE_PLAYER = 'UPDATE_PLAYER',
  UPDATE_TILES = 'UPDATE_TILES',
}

export type ActionData = StartGameData | AddPlayerData | UpdatePlayerData | UpdateTilesData;

export interface StartGameData {
  action: Action.START_GAME;
  tiles: PositionMap<Tile>;
}

export interface AddPlayerData {
  action: Action.ADD_PLAYER;
  player: Player;
}

export interface UpdatePlayerData {
  action: Action.UPDATE_PLAYER;
  player: Player;
}

export interface UpdateTilesData {
  action: Action.UPDATE_TILES;
  tiles: PositionMap<Tile>;
}
