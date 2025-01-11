<script lang="ts">
  import { divide, newPosition, type Position, subtract } from '$lib/data/Position';
  import { BoundingBox } from '$lib/math/BoundingBox';
  import { EMPTY, type Size } from '$lib/math/Size';
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
  let containerSize: Size = $state(EMPTY);

  const centerOffset = $derived(
    subtract(
      divide(divide(newPosition(containerSize.width, containerSize.height), size), 2),
      box.center
    )
  );

  $effect(() => {
    const currentContainer = container;
    if (currentContainer == null) return;

    const resizeObserver = new ResizeObserver(() => {
      containerSize = currentContainer.getBoundingClientRect();
    });

    resizeObserver.observe(currentContainer);

    return () => {
      resizeObserver.disconnect();
    };
  });
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
