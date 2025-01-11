import type { PartialWithId } from '$lib/data/PartialWithId';
import type { Player } from '$lib/data/Player';
import type { PositionMap } from '$lib/data/PositionMap';
import type { Tile } from '$lib/data/Tile';

export enum Action {
  JOIN_REQUEST = 'JOIN_REQUEST',
  ACCEPT_PLAYER = 'ACCEPT_PLAYER',
  UPDATE_PLAYER = 'UPDATE_PLAYER',
  START_GAME = 'START_GAME',
  UPDATE_TILES = 'UPDATE_TILES',
}

export type ActionData =
  | JoinRequestData
  | AcceptPlayerData
  | UpdatePlayerData
  | StartGameData
  | UpdateTilesData;

export interface JoinRequestData {
  action: Action.JOIN_REQUEST;
  player: Player;
}

export interface AcceptPlayerData {
  action: Action.ACCEPT_PLAYER;
  otherPlayers: Player[];
}

export interface UpdatePlayerData {
  action: Action.UPDATE_PLAYER;
  player: PartialWithId<Player>;
}

export interface StartGameData {
  action: Action.START_GAME;
  tiles: PositionMap<Tile>;
}

export interface UpdateTilesData {
  action: Action.UPDATE_TILES;
  tiles: PositionMap<Tile>;
}
