<script lang="ts">
  import type { Tile } from '$lib/data/Tile';
  import { Position } from '$lib/math/Position';
  import { PositionMap } from '$lib/math/PositionMap';
  import { flip } from 'svelte/animate';
  import { quintOut } from 'svelte/easing';
  import {
    blur,
    crossfade,
    fade,
    fly,
    scale,
    type CrossfadeParams,
    type TransitionConfig,
  } from 'svelte/transition';

  const {
    tiles,
    size,
    transition,
    fillPercent = 1,
    offset = Position.ORIGIN,
  }: {
    tiles: PositionMap<Tile>;
    size: number;
    transition: [
      (node: any, params: CrossfadeParams & { key: any }) => () => TransitionConfig,
      (node: any, params: CrossfadeParams & { key: any }) => () => TransitionConfig,
    ];
    fillPercent?: number;
    offset?: Position;
  } = $props();

  const [send, receive] = $derived(transition);

  const sortedTiles = $derived(
    tiles
      .entries()
      .toSorted(([positionA, tileA], [positionB, tileB]) => tileA.id.localeCompare(tileB.id)),
  );
</script>

<div class="container">
  {#each sortedTiles as [position, tile] (tile.id)}
    {@const actualPosition = position.add(offset)}
    <div
      class="cell"
      animate:flip
      style="
        left: {actualPosition.x * size}px;
        bottom: {actualPosition.y * size}px;
        width: {size}px;
        height: {size}px;
      "
    >
      <div
        in:receive={{ key: tile.id }}
        out:send={{ key: tile.id }}
        class="tile"
        style="
          width: {size * fillPercent}px;
          height: {size * fillPercent}px;
          background: {tile.owner == null ? `hsl(0, 0%, 20%)` : `hsl(${tile.owner.hue}, 70%, 70%)`};
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
