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
  import { randomInt } from '$lib/math/Random';
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
  import { flip } from 'svelte/animate';
  import { SvelteSet } from 'svelte/reactivity';

  const peer = $state(new Peer());
  const peerId = $state(open(peer));
  let connection = $state<DataConnection>();
  let peerIdToConnect = $state('');

  let playerHue = $state(randomInt(0, 360));
  let playerName = $state('');

  onMount(() => waitForConnect());

  async function waitForConnect() {
    makeConnection(await listenForConnections(peer));
    startGame();
    addPlayer(
      createPlayer({
        name: playerName.trim().length === 0 ? await peerId : playerName.trim(),
        hue: playerHue,
      }),
    );
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

  async function handleData(data: ActionData) {
    switch (data.action) {
      case Action.START_GAME:
        const startGameData = data as StartGameData;
        Object.assign(tiles, startGameData.tiles);

        addPlayer(
          createPlayer({
            name: playerName.trim().length === 0 ? await peerId : playerName.trim(),
            hue: playerHue,
          }),
        );
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
              tiles: new PositionMapWrapper(updatedTiles)
                .mapObjects((position, { oldTile, newTile }) => newTile)
                .unwrap(),
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

  const totalTiles = $derived(Object.keys(tiles).length);
  const playerScores = $derived(
    players
      .map((player) => ({
        player,
        score: Object.values(tiles).filter((tile) => tile.ownerId === player.id).length,
      }))
      .sort((a, b) => b.score - a.score),
  );

  const keysPressed = $state(new SvelteSet<string>());

  function handleKeyDown(event: KeyboardEvent) {
    if (controller == null) return;

    if (keysPressed.has(event.code)) return;

    if (keyboardControl(event, controller)) {
      keysPressed.add(event.code);
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    keysPressed.delete(event.code);
  }
</script>

<svelte:body on:keydown={handleKeyDown} on:keyup={handleKeyUp} />

{#if connection == null || controlledPlayer == null}
  <section class="connect">
    {#await peerId}
      <p class="peer-id">Connecting...</p>
    {:then peerId}
      <div class="name-input">
        <label for="name">Enter your name:</label>
        <input type="text" id="name" bind:value={playerName} placeholder="Your name" />
      </div>
      <div class="color-picker">
        <label for="hue">Choose your color:</label>
        <input type="range" id="hue" min="0" max="360" bind:value={playerHue} />
        <div class="color-preview" style="background-color: hsl({playerHue}, 80%, 50%)"></div>
      </div>
      <p class="peer-id">ID: {peerId}</p>
      <input type="text" bind:value={peerIdToConnect} placeholder="Enter friend's ID to connect" />
      <button onclick={() => makeConnection(peer.connect(peerIdToConnect))}>Connect</button>
    {/await}
  </section>
{:else}
  <section class="container">
    <section class="side-panel">
      <section class="scoreboard">
        {#each playerScores as { player, score } (player.id)}
          <div class="score" animate:flip>
            <span class="player" style:color="hsl({player.hue}, 80%, 50%)">{player.name}</span>: {score}
            ({((score / totalTiles) * 100).toFixed(2)}%)
          </div>
        {/each}
      </section>
    </section>
    <section class="grid">
      <CenterContainer positions={tilesWrapper.positions()} size={cellSize}>
        {#snippet children(centerOffset)}
          <Tiles
            size={cellSize}
            color={(tile) =>
              tile.ownerId == null
                ? `hsl(0, 0%, 90%)`
                : `hsl(${players.find((p) => p.id === tile.ownerId)!!.hue}, 80%, 60%)`}
            {tiles}
            offset={centerOffset}
            transition={tileTransition}
            baseZIndex={0}
          />
          {#each players as player}
            <Tiles
              size={cellSize}
              tiles={player.block.tiles}
              color={(tile) =>
                tile.ownerId == null
                  ? `hsl(0, 0%, 90%)`
                  : `hsl(${players.find((p) => p.id === tile.ownerId)!!.hue}, 80%, 50%)`}
              offset={add(centerOffset, player.offset)}
              transition={tileTransition}
              baseZIndex={2 + (player === controlledPlayer ? 2 : 0)}
              fillPercent={0.7}
              --border-radius="4px"
              --border="4px solid white"
              --box-shadow="0 0 2px 2px black"
            />
          {/each}
        {/snippet}
      </CenterContainer>
    </section>
    <section class="keys-pressed">
      <div class="keys">
        {#each Array.from(keysPressed) as key}
          <span class="key">{key}</span>
        {/each}
      </div>
      <h3 class="keys-pressed-label">Keys Pressed</h3>
    </section>
  </section>
{/if}

<style>
  .container {
    flex: 1;
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: stretch;
  }

  .side-panel {
    display: flex;
    flex-flow: column;
    align-items: stretch;
  }

  .grid {
    flex: 1;
  }

  .scoreboard {
    display: flex;
    flex-flow: column;
    align-items: center;
    margin: 1rem;
    width: 256px;
  }

  .score {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .player {
    font-weight: bold;
  }

  .connect {
    flex: 1;
    display: flex;
    flex-flow: column;
    align-items: stretch;
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

  .color-picker {
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
  }

  .color-picker label {
    margin-right: 1rem;
  }

  .color-picker input[type='range'] {
    margin-right: 1rem;
    margin-top: 0;
    margin-bottom: 0;
  }

  .color-preview {
    width: 2rem;
    height: 2rem;
    border: 1px solid black;
  }

  .name-input {
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
  }

  .name-input label {
    margin-right: 1rem;
  }

  .name-input input[type='text'] {
    padding: 0.5rem;
    font-size: 1rem;
    margin: 0;
  }

  .keys-pressed {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    background: rgba(0, 0, 0, 0.5);
    padding: 1rem;
    border-radius: 0.5rem;

    display: flex;
    flex-flow: column;
    align-items: center;
  }

  .keys-pressed-label {
    margin: 0;
    color: white;
  }

  .keys {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 15rem;
  }

  .key {
    background: #333;
    padding: 0.25rem 0.5rem;
    margin: 0.25rem;
    border-radius: 0.25rem;
  }
</style>
