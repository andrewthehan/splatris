<script lang="ts">
  import { ORIGIN, add, type Position } from '$lib/data/Position';
  import { PositionMapWrapper, type PositionMap } from '$lib/data/PositionMap';
  import type { Tile } from '$lib/data/Tile';
  import { flip } from 'svelte/animate';
  import { type CrossfadeParams, type TransitionConfig } from 'svelte/transition';

  const {
    tiles,
    color,
    size,
    transition,
    baseZIndex = 0,
    fillPercent = 1,
    offset = ORIGIN,
  }: {
    tiles: PositionMap<Tile>;
    color: (tile: Tile) => string;
    size: number;
    transition: [
      (node: any, params: CrossfadeParams & { key: any }) => () => TransitionConfig,
      (node: any, params: CrossfadeParams & { key: any }) => () => TransitionConfig,
    ];
    baseZIndex?: number;
    fillPercent?: number;
    offset?: Position;
  } = $props();

  const [send, receive] = $derived(transition);

  const tilesWrapper = $derived(new PositionMapWrapper(tiles));
  const sortedTiles = $derived(
    tilesWrapper
      .entries()
      .toSorted(([positionA, tileA], [positionB, tileB]) => tileA.id.localeCompare(tileB.id))
  );
</script>

<div class="container">
  {#each sortedTiles as [position, tile] (tile.id)}
    {@const actualPosition = add(position, offset)}
    <div
      class="cell"
      animate:flip
      style="
        left: {actualPosition.x * size}px;
        bottom: {actualPosition.y * size}px;
        width: {size}px;
        height: {size}px;
        z-index: {baseZIndex - position.y};
      "
    >
      <div
        in:receive={{ key: tile.id }}
        out:send={{ key: tile.id }}
        class="tile"
        style="
          width: {size * fillPercent}px;
          height: {size * fillPercent}px;
          background: {color(tile)};
        "
      >
        <!-- {tile.id.substring(0, 4)} -->
      </div>
    </div>
  {/each}
</div>

<style>
  .container {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .cell {
    position: absolute;

    transition-property: top, bottom, left, right;
    transition-duration: 0.05s;
    transition-timing-function: ease-in;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .tile {
    position: absolute;

    border-radius: var(--border-radius);
    border: var(--border);
    box-shadow: var(--box-shadow);
  }
</style>
