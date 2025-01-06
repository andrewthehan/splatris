<script lang="ts">
  import { Position } from '$lib/data/Position';
  import { PositionMap } from '$lib/data/PositionMap';
  import type { Tile } from '$lib/data/Tile';

  const {
    tiles,
    size,
    offset = Position.ORIGIN,
  }: {
    tiles: PositionMap<Tile>;
    size: number;
    offset?: Position;
  } = $props();
</script>

<div class="container">
  {#each tiles.entries() as [position, tile] (tile.id)}
    {@const actualPosition = position.add(offset)}
    <div
      class="tile"
      style="
        left: {actualPosition.x * size}px;
        bottom: {actualPosition.y * size}px;
        width: {size}px;
        height: {size}px;
        background-color: {tile.color};
      "
    ></div>
  {/each}
</div>

<style>
  .container {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .tile {
    position: absolute;

    transition-property: top, bottom, left, right;
    transition-duration: 0.05s;
    transition-timing-function: ease-in;

    outline: 1px solid white;
  }
</style>
