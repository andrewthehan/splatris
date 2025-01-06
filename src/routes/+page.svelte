<script lang="ts">
  import CenterContainer from '$lib/components/CenterContainer.svelte';
  import Tiles from '$lib/components/Tiles.svelte';
  import type { Block, BlockTile } from '$lib/data/Block';
  import { necessaryKick } from '$lib/data/Kick';
  import type { Player } from '$lib/data/Player';
  import { RandomBagIterator } from '$lib/data/RandomBag';
  import { rotateClockwise, rotateCounterClockwise } from '$lib/data/Rotation';
  import { Tetrominoes, TetrominoShape } from '$lib/data/Tetrominoes';
  import type { Tile } from '$lib/data/Tile';
  import { Position } from '$lib/math/Position';
  import { PositionMap } from '$lib/math/PositionMap';
  import { rollEven } from '$lib/math/Random';
  import { v4 as uuidv4 } from 'uuid';

  const size = $state(100);

  const tiles = $state(new PositionMap<Tile>());

  const player: Player = $state({
    name: 'Player',
    hue: 0,
  });

  const enemy: Player = $state({
    name: 'Enemy',
    hue: 180,
  });

  const blockBag = $state(
    new RandomBagIterator<TetrominoShape, Block>(
      Object.values(TetrominoShape) as TetrominoShape[],
      (shape) => ({
        owner: player,
        tiles: Tetrominoes[shape].reduce(
          (map, position, i) =>
            map.set(position, {
              id: uuidv4(),
              owner: player,
            }),
          new PositionMap<BlockTile>(),
        ),
      }),
    ),
  );

  let block: Block = $state(blockBag.next());

  for (let x = 0; x < 6; x++) {
    for (let y = 0; y < 6; y++) {
      const tile = {
        id: uuidv4(),
        owner: rollEven([player, enemy, null]),
      };
      tiles.set(new Position(x, y), tile);
    }
  }

  let offset = $state(tiles.center().floor());

  function controlBlock(event: KeyboardEvent) {
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
        block = rotateClockwise(block);
        break;
      case 'KeyX':
        block = rotateCounterClockwise(block);
        break;
      case 'Space':
        block = blockBag.next();
        break;
      default:
        console.log(event.key);
    }
    offset = offset.add(necessaryKick(block, offset, tiles));
  }
</script>

<svelte:body onkeydown={controlBlock} />

<section class="container">
  <section class="grid">
    <CenterContainer positions={tiles.positions()} {size}>
      {#snippet children(centerOffset)}
        <Tiles {tiles} {size} offset={centerOffset} />
        <Tiles
          tiles={block.tiles}
          {size}
          fillPercent={0.8}
          offset={centerOffset.add(offset)}
          --border-radius="3px"
          --border="1px solid white"
          --box-shadow="0 8px 16px black"
        />
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
