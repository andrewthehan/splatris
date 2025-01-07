<script lang="ts">
  import CenterContainer from '$lib/components/CenterContainer.svelte';
  import Tiles from '$lib/components/Tiles.svelte';
  import { createPlayer } from '$lib/data/Player';
  import type { Tile } from '$lib/data/Tile';
  import { startAi } from '$lib/input/AiInput';
  import { keyboardControl } from '$lib/input/KeyboardInput';
  import { Position } from '$lib/math/Position';
  import { PositionMap } from '$lib/math/PositionMap';
  import { onMount } from 'svelte';
  import { SvelteMap } from 'svelte/reactivity';
  import { crossfade } from 'svelte/transition';
  import { v4 as uuidv4 } from 'uuid';
  import { GamePlayer } from './GamePlayer.svelte';

  const cellSize = $state(80);
  const gridSize = $state(8);

  let tiles = $state(new PositionMap<Tile>(() => new SvelteMap()));

  const blockToTileTransition = crossfade({
    duration: 200,
    fallback(node, params) {
      if (
        players.some((player) =>
          player.block.tiles.values().some((blockTile) => blockTile.id === (params as any).key),
        )
      ) {
        return {
          duration: 200,
          css: (t) => `
            transform: scale(${t});
            opacity: ${t};
          `,
        };
      }
      return {
        duration: 200,
        css: (t) => `
          opacity: ${t};
          z-index: -1;
        `,
      };
    },
  });

  const players = $state<GamePlayer[]>([]);

  onMount(() => {
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const tile = {
          id: uuidv4(),
          owner: null,
        };
        tiles.set(new Position(x, y), tile);
      }
    }

    players.push(new GamePlayer(createPlayer({ hue: 0 }), tiles, players));
    players.push(new GamePlayer(createPlayer({ hue: 120 }), tiles, players));
    players.push(new GamePlayer(createPlayer({ hue: 240 }), tiles, players));

    players.forEach((player) => (player.offset = tiles.center().floor()));
    players.forEach((player) => (player.offset = tiles.center().floor()));

    players.slice(1).forEach((player) => startAi(player, tiles));
  });
</script>

<svelte:body onkeydown={(e) => keyboardControl(e, players[0])} />

<section class="container">
  <section class="grid">
    <CenterContainer positions={tiles.positions()} size={cellSize}>
      {#snippet children(centerOffset)}
        <Tiles size={cellSize} {tiles} offset={centerOffset} transition={blockToTileTransition} />
        {#each players as player}
          <Tiles
            size={cellSize}
            tiles={player.block.tiles}
            offset={centerOffset.add(player.offset)}
            transition={blockToTileTransition}
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
</style>
