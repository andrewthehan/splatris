<script lang="ts">
  import type { Tile } from '$lib/data/Tile';
  import { Position } from '$lib/math/Position';
  import { PositionMap } from '$lib/math/PositionMap';
  import { blur, fade, fly, scale } from 'svelte/transition';

  const {
    tiles,
    size,
    fillPercent = 1,
    offset = Position.ORIGIN,
  }: {
    tiles: PositionMap<Tile>;
    size: number;
    fillPercent?: number;
    offset?: Position;
  } = $props();

  const sortedTiles = $derived(tiles.entries());
  // TODO: check if this is needed
  // $derived(
  //   tiles
  //     .entries()
  //     .toSorted(([positionA], [positionB]) =>
  //       positionA.x !== positionB.x ? positionB.x - positionA.x : positionB.y - positionA.y,
  //     ),
  // );
</script>

<div class="container">
  {#each sortedTiles as [position, tile] (tile.id)}
    {@const actualPosition = position.add(offset)}
    <div
      class="cell"
      in:scale|global
      out:scale|global
      style="
        left: {actualPosition.x * size}px;
        bottom: {actualPosition.y * size}px;
        width: {size}px;
        height: {size}px;
      "
    >
      <div
        class="tile"
        style="
          width: {size * fillPercent}px;
          height: {size * fillPercent}px;
          background: {tile.owner == null ? `hsl(0, 0%, 20%)` : `hsl(${tile.owner.hue}, 70%, 70%)`};
        "
      ></div>
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
