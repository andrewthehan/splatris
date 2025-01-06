<script lang="ts">
  import CenterContainer from '$lib/components/CenterContainer.svelte';
  import Tiles from '$lib/components/Tiles.svelte';
  import type { Block } from '$lib/data/Block';
  import { Position } from '$lib/math/Position';
  import { PositionMap } from '$lib/math/PositionMap';
  import { rotateClockwise, rotateCounterClockwise } from '$lib/data/Rotation';
  import { Tetrominoes, TetrominoShape } from '$lib/data/Tetrominoes';
  import type { Tile } from '$lib/data/Tile';
  import { v4 as uuidv4 } from 'uuid';

  const tiles = new PositionMap<Tile>(Position.serialize, Position.deserialize);

  const size = $state(70);

  let block: Block = $state({
    tiles: Tetrominoes[TetrominoShape.I].reduce(
      (map, position, i) => {
        map.set(position, { id: i.toString(), color: 'hsla(0, 0%, 0%, 60%)' });
        return map;
      },
      new PositionMap<Tile>(Position.serialize, Position.deserialize),
    ),
  });

  for (let x = 0; x < 6; x++) {
    for (let y = 0; y < 6; y++) {
      const tile = {
        id: uuidv4(),
        color: `hsl(${(x * 6 + y) * 10}, 80%, 70%)`,
      };
      tiles.set(new Position(x, y), tile);
    }
  }

  let offset = $state(tiles.center().floor());

  function handleKeydown(event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowUp':
        if (tiles.hasAll(block.tiles.positions().map((p) => p.add(offset.up(1))))) {
          offset = offset.up(1);
        }
        break;
      case 'ArrowDown':
        if (tiles.hasAll(block.tiles.positions().map((p) => p.add(offset.down(1))))) {
          offset = offset.down(1);
        }
        break;
      case 'ArrowLeft':
        if (tiles.hasAll(block.tiles.positions().map((p) => p.add(offset.left(1))))) {
          offset = offset.left(1);
        }
        break;
      case 'ArrowRight':
        if (tiles.hasAll(block.tiles.positions().map((p) => p.add(offset.right(1))))) {
          offset = offset.right(1);
        }
        break;
      case 'KeyZ':
        block = rotateClockwise(block, offset, tiles);
        break;
      case 'KeyX':
        block = rotateCounterClockwise(block, offset, tiles);
        break;
      default:
        console.log(event.key);
    }
  }

  $effect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

<section class="container">
  <section class="grid">
    <CenterContainer positions={tiles.positions()} {size}>
      {#snippet children(centerOffset)}
        <Tiles {tiles} {size} offset={centerOffset} />
        <Tiles tiles={block.tiles} {size} offset={centerOffset.add(offset)} />
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
