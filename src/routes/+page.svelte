<script lang="ts">
  import CenterContainer from '$lib/components/CenterContainer.svelte';
  import Tiles from '$lib/components/Tiles.svelte';
  import { createPlayer, type Player } from '$lib/data/Player';
  import { add, floor, newPosition } from '$lib/data/Position';
  import { PositionMapWrapper, type PositionMap } from '$lib/data/PositionMap';
  import { createTile, type Tile } from '$lib/data/Tile';
  import { PlayerController } from '$lib/game/PlayerController';
  import { createBlockBag } from '$lib/game/Tetrominoes';
  import { keyboardControl } from '$lib/input/KeyboardInput';
  import {
    Action,
    type ActionData,
    type AddPlayerData,
    type StartGameData,
    type UpdatePlayerData,
    type UpdateTilesData,
  } from '$lib/network/Action';
  import { listenForConnections, listenForData, onClose, open, sendData } from '$lib/network/p2p';
  import { getTransition } from '$lib/transitions/blockToTileTransition';
  import Peer, { type DataConnection } from 'peerjs';
  import { onMount } from 'svelte';

  const peer = $state(new Peer());
  let connection = $state<DataConnection>();
  let peerId = $state(open(peer));
  let peerIdToConnect = $state('');

  onMount(() => waitForConnect());

  async function waitForConnect() {
    makeConnection(await listenForConnections(peer));
    startGame();
    addPlayer(createPlayer({ hue: 180 }));
  }

  function makeConnection(c: DataConnection) {
    connection = c;
    onClose(connection, () => {
      connection = undefined;
      tilesWrapper.clear();
      players.splice(0, players.length);
      controlledPlayer = null;

      waitForConnect();
    });
    listenForData<ActionData>(connection, handleData);
  }

  function handleData(data: ActionData) {
    switch (data.action) {
      case Action.START_GAME:
        const startGameData = data as StartGameData;
        Object.assign(tiles, startGameData.tiles);

        addPlayer(createPlayer({ hue: 0 }));
        break;
      case Action.ADD_PLAYER:
        const addPlayerData = data as AddPlayerData;
        players.push(addPlayerData.player);
        break;
      case Action.UPDATE_PLAYER:
        const updatePlayerData = data as UpdatePlayerData;
        const index = players.findIndex((p) => p.id === updatePlayerData.player.id);
        if (index !== -1) {
          Object.assign(players[index], updatePlayerData.player);
        }
        break;
      case Action.UPDATE_TILES:
        const updateTilesData = data as UpdateTilesData;
        Object.assign(tiles, updateTilesData.tiles);
        break;
    }
  }

  const cellSize = $state(50);
  const gridSize = $state(12);

  const tiles = $state<PositionMap<Tile>>({});
  const tilesWrapper = $derived(new PositionMapWrapper(tiles));

  const players = $state<Player[]>([]);
  let controlledPlayer = $state<Player | null>(null);

  const blockBag = $derived(createBlockBag(controlledPlayer));
  const controller = $derived(
    controlledPlayer == null
      ? null
      : new PlayerController(
          controlledPlayer,
          blockBag,
          tiles,
          players,
          (partialPlayer) => {
            sendData<UpdatePlayerData>(connection!!, {
              action: Action.UPDATE_PLAYER,
              player: partialPlayer,
            });
          },
          (updatedTiles) => {
            sendData<UpdateTilesData>(connection!!, {
              action: Action.UPDATE_TILES,
              tiles: updatedTiles,
            });
          },
        ),
  );

  const tileTransition = $derived(getTransition(players));

  function startGame() {
    if (connection == null) return;

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        tilesWrapper.set(
          newPosition(x, y),
          createTile({
            ownerId: undefined,
          }),
        );
      }
    }

    sendData<StartGameData>(connection, {
      action: Action.START_GAME,
      tiles,
    });
  }

  function addPlayer(player: Player) {
    if (connection == null) return;

    controlledPlayer = player;
    controlledPlayer.block = blockBag.next();
    controlledPlayer.offset = floor(tilesWrapper.center());

    players.push(controlledPlayer);
    sendData<AddPlayerData>(connection, {
      action: Action.ADD_PLAYER,
      player: controlledPlayer,
    });
  }
</script>

<svelte:body on:keydown={controller == null ? null : (e) => keyboardControl(e, controller)} />

{#if connection == null}
  <section class="connect">
    {#await peerId}
      <p class="peer-id">Connecting...</p>
    {:then peerId}
      <p class="peer-id">ID: {peerId}</p>
      <input type="text" bind:value={peerIdToConnect} placeholder="Enter friend's ID to connect" />
      <button onclick={() => makeConnection(peer.connect(peerIdToConnect))}>Connect</button>
    {/await}
  </section>
{:else}
  <section class="container">
    <section class="grid">
      <CenterContainer positions={tilesWrapper.positions()} size={cellSize}>
        {#snippet children(centerOffset)}
          <Tiles
            size={cellSize}
            {tiles}
            {players}
            offset={centerOffset}
            transition={tileTransition}
          />
          {#each players as player}
            <Tiles
              size={cellSize}
              tiles={player.block.tiles}
              {players}
              offset={add(centerOffset, player.offset)}
              transition={tileTransition}
              fillPercent={0.8}
              --border-radius="3px"
              --border="1px solid white"
              --box-shadow="0 8px 16px black"
            />
          {/each}
        {/snippet}
      </CenterContainer>
    </section>
  </section>
{/if}

<style>
  .container {
    flex: 1;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: stretch;
  }

  .grid {
    flex: 1;
  }

  .connect {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .connect .peer-id {
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .connect input {
    margin-bottom: 1rem;
    padding: 0.5rem;
    font-size: 1rem;
  }

  .connect button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
  }
</style>
