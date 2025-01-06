<script lang="ts">
  import { Position } from '$lib/math/Position';
  import { PositionMap } from '$lib/math/PositionMap';
  import type { Tile } from '$lib/data/Tile';

  const {
    tiles,
    size,
    opacity = 1,
    offset = Position.ORIGIN,
  }: {
    tiles: PositionMap<Tile>;
    size: number;
    opacity?: number;
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
        background-color: {tile.owner?.color ?? 'hsl(0, 0%, 20%)'};
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

    opacity: var(--opacity);
    outline: var(--outline);
    box-shadow: var(--box-shadow);
  }
</style>
