<script lang="ts">
  import { BoundingBox } from '$lib/math/BoundingBox';
  import { Position } from '$lib/math/Position';
  import type { Snippet } from 'svelte';

  const {
    positions,
    size,
    children,
  }: {
    positions: Position[];
    size: number;
    children: Snippet<[Position]>;
  } = $props();

  const box = $derived(BoundingBox.fromPositions(positions));

  let container = $state<HTMLDivElement>();
  const { width, height } = $derived(container?.getBoundingClientRect() ?? { width: 0, height: 0 });

  const centerOffset = $derived(
    new Position(width, height).divide(size).divide(2).subtract(box.center),
  );
</script>

<div class="container" bind:this={container}>
  {#if container != null}
    {@render children(centerOffset)}
  {/if}
</div>

<style>
  .container {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
</style>
