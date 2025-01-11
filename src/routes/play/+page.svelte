<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import CenterContainer from '$lib/components/CenterContainer.svelte';
  import Tiles from '$lib/components/Tiles.svelte';
  import { GamePhase } from '$lib/data/GamePhase';
  import type { IdMap } from '$lib/data/IdMap';
  import type { PartialWithId } from '$lib/data/PartialWithId';
  import { createPlayer, type Player } from '$lib/data/Player';
  import { add, floor, newPosition } from '$lib/data/Position';
  import { PositionMapWrapper, type PositionMap } from '$lib/data/PositionMap';
  import { createTile, type Tile } from '$lib/data/Tile';
  import { debounce } from '$lib/debounce.svelte';
  import { PlayerController } from '$lib/game/PlayerController';
  import { createBlockBag } from '$lib/game/Tetrominoes';
  import { keyboardControl } from '$lib/input/KeyboardInput';
  import { randomInt } from '$lib/math/Random';
  import {
    Action,
    type AcceptPlayerData,
    type ActionData,
    type JoinRequestData,
    type StartGameData,
    type UpdatePlayerData,
    type UpdateTilesData,
  } from '$lib/network/action';
  import {
    connect,
    disconnect,
    listenForConnections,
    onClose,
    open,
    sendData,
  } from '$lib/network/p2p';
  import { getTransition } from '$lib/transitions/blockToTileTransition';
  import Peer, { type DataConnection } from 'peerjs';
  import { flip } from 'svelte/animate';
  import { SvelteSet } from 'svelte/reactivity';
  import { scale } from 'svelte/transition';

  let gamePhase = $state<GamePhase>(GamePhase.CONNECTING);
  let body = $state<HTMLElement>();

  let peer = $state<Peer>();
  let peerId = $state<string>();

  const connections = $state<IdMap<DataConnection>>({});
  const otherPlayersMap = $state<IdMap<Player>>({});
  let thisPlayer = $state<Player>();

  const allPlayers = $derived([thisPlayer!!, ...Object.values(otherPlayersMap)]);

  const idInQueryParams = $state(page.url.searchParams.get('id') || '');

  let isHueSliderVisible = $state(false);

  $effect(() => {
    if (peer == null) return;

    return () => disconnect(peer!!, Object.values(connections));
  });

  const loading = $state(start());

  async function start() {
    await initializePlayer();
    listenForConnections<ActionData>(peer!!, establishConnection, handleData);
    await joinLobby();

    gamePhase = GamePhase.LOBBY;
  }

  async function initializePlayer() {
    peer = new Peer();
    peerId = await open(peer);

    thisPlayer = createPlayer({
      id: peerId,
      name: `Player ${peerId.substring(0, 4)}`,
      hue: randomInt(0, 360),
      isLobbyAdmin: idInQueryParams.length === 0,
    });
  }

  function becomeLobbyAdmin() {
    thisPlayer!!.isLobbyAdmin = true;

    updatePlayer({
      id: thisPlayer!!.id,
      isLobbyAdmin: thisPlayer!!.isLobbyAdmin,
    });
  }

  async function joinLobby() {
    goto(`?id=${peerId}`, { replaceState: true });

    if (idInQueryParams.length === 0) return;

    try {
      const connection = await connect(peer!!, idInQueryParams, handleData);

      establishConnection(connection);

      sendData<JoinRequestData>([connection], {
        action: Action.JOIN_REQUEST,
        player: thisPlayer!!,
      });
    } catch {
      becomeLobbyAdmin();
    }
  }

  function establishConnection(connection: DataConnection) {
    connections[connection.peer] = connection;
    onClose(connection, () => {
      const playerWasLobbyAdmin = otherPlayersMap[connection.peer]?.isLobbyAdmin == true;

      const clearedTiles = tilesWrapper
        .filter((position, tile) => tile.ownerId === connection.peer)
        .mapObjects((position, tile) => {
          tile.ownerId = undefined;
          return tile;
        })
        .unwrap();
      if (Object.keys(clearedTiles).length > 0) {
        sendData<UpdateTilesData>(Object.values(connections), {
          action: Action.UPDATE_TILES,
          tiles: clearedTiles,
        });
      }

      delete otherPlayersMap[connection.peer];
      delete connections[connection.peer];

      const minPlayerId = allPlayers.map((player) => player.id).toSorted()[0];
      if (playerWasLobbyAdmin && minPlayerId === thisPlayer!!.id) {
        becomeLobbyAdmin();
      }
    });
  }

  async function handleData(data: ActionData) {
    switch (data.action) {
      case Action.JOIN_REQUEST: {
        const joinRequestData = data as JoinRequestData;
        const { player } = joinRequestData;

        const connection = connections[player.id];
        if (connection == null) {
          throw Error("Got a join request from a player we don't have a connection to.");
        }

        sendData<AcceptPlayerData>([connection], {
          action: Action.ACCEPT_PLAYER,
          otherPlayers: allPlayers,
        });

        otherPlayersMap[player.id] = player;
        break;
      }
      case Action.ACCEPT_PLAYER: {
        const acceptPlayerData = data as AcceptPlayerData;
        const { otherPlayers } = acceptPlayerData;

        otherPlayers.forEach(async (player) => {
          otherPlayersMap[player.id] = player;
          if (player.id in connections) {
            return;
          }
          const connection = await connect(peer!!, player.id, handleData);

          establishConnection(connection);
          sendData<JoinRequestData>([connection], {
            action: Action.JOIN_REQUEST,
            player: thisPlayer!!,
          });
        });
        break;
      }
      case Action.UPDATE_PLAYER: {
        const updatePlayerData = data as UpdatePlayerData;
        const { player } = updatePlayerData;

        if (!(player.id in otherPlayersMap)) {
          throw Error("Got an update for a player we don't know about.");
        }
        Object.assign(otherPlayersMap[player.id], player);

        checkStartGame();
        break;
      }
      case Action.START_GAME: {
        const startGameData = data as StartGameData;

        if (gamePhase === GamePhase.PLAYING) break;

        Object.assign(tiles, startGameData.tiles);

        thisPlayer!!.block = blockBag!!.next();
        thisPlayer!!.offset = floor(tilesWrapper.center());
        sendData<UpdatePlayerData>(Object.values(connections), {
          action: Action.UPDATE_PLAYER,
          player: { id: thisPlayer!!.id, block: thisPlayer!!.block, offset: thisPlayer!!.offset },
        });

        gamePhase = GamePhase.PLAYING;
        break;
      }
      case Action.UPDATE_TILES: {
        const updateTilesData = data as UpdateTilesData;
        Object.assign(tiles, updateTilesData.tiles);
        break;
      }
    }
  }

  function checkStartGame() {
    if (!thisPlayer!!.isLobbyAdmin) return;

    if (!thisPlayer!!.isReady) return;
    if (Object.values(otherPlayersMap).some((player) => !player.isReady)) return;

    if (gamePhase !== GamePhase.PLAYING) {
      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          tilesWrapper.set(
            newPosition(x, y),
            createTile({
              ownerId: undefined,
            })
          );
        }
      }

      thisPlayer!!.block = blockBag!!.next();
      thisPlayer!!.offset = floor(tilesWrapper.center());
      sendData<UpdatePlayerData>(Object.values(connections), {
        action: Action.UPDATE_PLAYER,
        player: { id: thisPlayer!!.id, block: thisPlayer!!.block, offset: thisPlayer!!.offset },
      });

      gamePhase = GamePhase.PLAYING;
    }

    sendData<StartGameData>(Object.values(connections), {
      action: Action.START_GAME,
      tiles,
    });
  }

  function updatePlayer(partialPlayer: PartialWithId<Player>) {
    sendData<UpdatePlayerData>(Object.values(connections), {
      action: Action.UPDATE_PLAYER,
      player: partialPlayer,
    });
  }

  const cellSize = $state(50);
  const gridSize = $state(12);

  const tiles = $state<PositionMap<Tile>>({});
  const tilesWrapper = $derived(new PositionMapWrapper(tiles));

  const blockBag = $derived(thisPlayer == null ? null : createBlockBag(thisPlayer));
  const controller = $derived(
    thisPlayer == null
      ? null
      : new PlayerController(
          thisPlayer,
          blockBag!!,
          tiles,
          Object.values(otherPlayersMap),
          (partialPlayer) => {
            sendData<UpdatePlayerData>(Object.values(connections), {
              action: Action.UPDATE_PLAYER,
              player: partialPlayer,
            });
          },
          (updatedTiles) => {
            sendData<UpdateTilesData>(Object.values(connections), {
              action: Action.UPDATE_TILES,
              tiles: new PositionMapWrapper(updatedTiles)
                .mapObjects((position, { oldTile, newTile }) => newTile)
                .unwrap(),
            });
          }
        )
  );

  const totalTiles = $derived(Object.keys(tiles).length);
  const playerScores = $derived(
    allPlayers
      .map((player) => ({
        player,
        score: Object.values(tiles).filter((tile) => tile.ownerId === player.id).length,
      }))
      .sort((a, b) => b.score - a.score)
  );

  $effect(() => {
    if (gamePhase !== GamePhase.PLAYING) return;

    const localBody = body;
    if (localBody == null) return;

    localBody.addEventListener('keydown', handleKeyDown);
    localBody.addEventListener('keyup', handleKeyUp);
    return () => {
      localBody.removeEventListener('keydown', handleKeyDown);
      localBody.removeEventListener('keyup', handleKeyUp);
    };
  });

  const tileTransition = $derived(getTransition(allPlayers));

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

<svelte:window onbeforeunload={() => disconnect(peer!!, Object.values(connections))} />
<svelte:body bind:this={body} />

{#snippet renderLoading()}
  <div class="spinner"></div>

  <style>
    .spinner {
      align-self: center;
      border: 16px solid white;
      border-top: 16px solid transparent;
      border-radius: 50%;
      width: 120px;
      height: 120px;
      animation:
        spin 2s linear infinite,
        rainbow 6s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes rainbow {
      0% {
        border-top-color: red;
      }
      16% {
        border-top-color: orange;
      }
      33% {
        border-top-color: yellow;
      }
      50% {
        border-top-color: green;
      }
      66% {
        border-top-color: blue;
      }
      83% {
        border-top-color: indigo;
      }
      100% {
        border-top-color: violet;
      }
    }
  </style>
{/snippet}

{#snippet renderLobby()}
  <section class="lobby">
    <section>
      <h2>Lobby</h2>
      {#each allPlayers.toSorted((a, b) => {
        if (a.isLobbyAdmin) return -1;
        if (b.isLobbyAdmin) return 1;

        return a.id.localeCompare(b.id);
      }) as player (player.id)}
        {@const isThisPlayer = player.id === thisPlayer!!.id}
        <div class="player" animate:flip in:scale|global>
          <div class="player-lobby-admin" in:scale|global title="Lobby Admin">
            {player.isLobbyAdmin ? '👑' : ''}
          </div>
          <div class="player-hue-container">
            {#if isThisPlayer}
              <button
                class="player-hue"
                style:background-color="hsl({player.hue}, 80%, 50%)"
                onclick={() => (isHueSliderVisible = !isHueSliderVisible)}
                aria-label="Change your color"
              ></button>
              {#if isHueSliderVisible}
                <div style:position="relative">
                  <div class="tooltip">
                    <input
                      type="range"
                      bind:value={thisPlayer!!.hue}
                      min="0"
                      max="360"
                      use:debounce={{
                        effect: () => updatePlayer({ id: thisPlayer!!.id, hue: thisPlayer!!.hue }),
                        latency: 1000,
                      }}
                    />
                  </div>
                </div>
              {/if}
            {:else}
              <div class="player-hue" style:background-color="hsl({player.hue}, 80%, 50%)"></div>
            {/if}
          </div>
          {#if isThisPlayer}
            <input
              class="player-name"
              type="text"
              bind:value={thisPlayer!!.name}
              use:debounce={{
                effect: () => updatePlayer({ id: thisPlayer!!.id, name: thisPlayer!!.name }),
                latency: 1000,
              }}
              placeholder="Your Name"
            />
          {:else}
            <div class="player-name">{player.name}</div>
          {/if}
          <div style:color={player.isReady ? 'green' : 'red'}>
            {player.isReady ? 'Ready' : 'Not ready'}
          </div>
        </div>
      {/each}
    </section>
    <p>Share your URL to invite your friends to join your lobby!</p>

    <!-- <h2>Connections</h2>
    <ul>
      {#each Object.values(connections) as connection}
        <li>{connection.peer}</li>
      {/each}
    </ul> -->
    <button
      class="ready-button"
      onclick={() => {
        thisPlayer!!.isReady = !thisPlayer!!.isReady;
        updatePlayer({ id: thisPlayer!!.id, isReady: thisPlayer!!.isReady });
        checkStartGame();
      }}
    >
      Ready
    </button>
  </section>

  <style>
    .lobby {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .player {
      display: flex;
      align-items: center;
      margin: 0.5rem;
      gap: 0.5rem;
      height: 2rem;
    }

    .player-lobby-admin {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      width: 2rem;
    }

    .player-hue-container {
      display: flex;
      align-items: center;
    }

    .player-name {
      font-size: 1.3rem;
    }

    .player-hue {
      width: 1.3rem;
      height: 1.3rem;
      border: 3px solid white;
      box-shadow: 0 0 2px 2px black;
    }

    .tooltip {
      position: absolute;
      background: white;
      border: 1px solid black;
      padding: 0.5rem;
      z-index: 10;
      display: flex;
      align-items: center;
    }
  </style>
{/snippet}

{#snippet renderPlaying()}
  <div class="playing-container">
    <section class="scoreboard">
      {#each playerScores as { player, score } (player.id)}
        <div class="score" animate:flip>
          <span class="player" style:color="hsl({player.hue}, 80%, 50%)">{player.name}</span>: {score}
          ({((score / totalTiles) * 100).toFixed(2)}%)
        </div>
      {/each}
    </section>
    <section class="grid">
      <CenterContainer positions={tilesWrapper.positions()} size={cellSize}>
        {#snippet children(centerOffset)}
          <Tiles
            size={cellSize}
            color={(tile) =>
              tile.ownerId == null
                ? `hsl(0, 0%, 90%)`
                : `hsl(${allPlayers.find((p) => p.id === tile.ownerId)!!.hue}, 80%, 60%)`}
            {tiles}
            offset={centerOffset}
            transition={tileTransition}
            baseZIndex={0}
          />
          {#each allPlayers as player}
            <Tiles
              size={cellSize}
              tiles={player.block.tiles}
              color={(tile) =>
                tile.ownerId == null
                  ? `hsl(0, 0%, 90%)`
                  : `hsl(${allPlayers.find((p) => p.id === tile.ownerId)!!.hue}, 80%, 50%)`}
              offset={add(centerOffset, player.offset)}
              transition={tileTransition}
              baseZIndex={2 + (player.id === thisPlayer!!.id ? 2 : 0)}
              fillPercent={0.7}
              --border-radius="4px"
              --border="4px solid white"
              --box-shadow="0 0 2px 2px black"
            />
          {/each}
        {/snippet}
      </CenterContainer>
    </section>
  </div>

  <style>
    .playing-container {
      flex: 1;
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
  </style>
{/snippet}

<div class="container">
  {#await loading}
    {@render renderLoading()}
  {:then}
    {#if gamePhase === GamePhase.LOBBY}
      {@render renderLobby()}
    {:else if gamePhase === GamePhase.PLAYING}
      {@render renderPlaying()}
    {/if}
  {/await}
</div>

<style>
  button {
    padding: 0.5rem;
    font-size: 1.2rem;
  }

  .container {
    flex: 1;
    display: flex;
    flex-flow: column;
    align-items: stretch;
  }
</style>
