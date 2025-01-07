import type { Block } from '$lib/data/Block';
import { necessaryKick } from '$lib/data/Kick';
import type { Player } from '$lib/data/Player';
import { rotateClockwise, rotateCounterClockwise } from '$lib/data/Rotation';
import { createBlockBag } from '$lib/data/Tetrominoes';
import type { Tile } from '$lib/data/Tile';
import { Position } from '$lib/math/Position';
import { PositionMap } from '$lib/math/PositionMap';

export class GamePlayer {
  private static readonly DEFAULT_PLAYER: Player = { id: '', hue: 0 };

  private blockBag = $state(createBlockBag(GamePlayer.DEFAULT_PLAYER));
  block = $state<Block>({ owner: GamePlayer.DEFAULT_PLAYER, tiles: new PositionMap() });
  offset: Position = $state(Position.ORIGIN);

  constructor(
    public player: Player,
    private tiles: PositionMap<Tile>,
    private players: GamePlayer[],
  ) {
    this.blockBag = createBlockBag(player);
    this.block = this.blockBag.next();
  }

  private isCollision(newPositions: Position[]): boolean {
    return !this.getValidPositions().hasAll(newPositions);
  }

  move(direction: Position) {
    const newOffset = this.offset.add(direction);
    const newPositions = this.block.tiles.positions().map((p) => p.add(newOffset));
    if (!this.isCollision(newPositions)) {
      this.offset = newOffset;
    }
  }

  getValidPositions(): PositionMap<{}> {
    const validPositions = this.tiles.clone();
    this.players
      .filter((p) => p.player.id !== this.player.id)
      .flatMap((p) => p.getPositions())
      .forEach((p) => validPositions.delete(p));
    return validPositions;
  }

  rotateClockwise() {
    const newBlock = rotateClockwise(this.block);
    try {
      this.offset = this.offset.add(necessaryKick(newBlock, this.offset, this.getValidPositions()));
      this.block = newBlock;
    } catch (e) {
      console.error(e);
    }
  }

  rotateCounterClockwise() {
    const newBlock = rotateCounterClockwise(this.block);
    try {
      this.offset = this.offset.add(necessaryKick(newBlock, this.offset, this.getValidPositions()));
      this.block = newBlock;
    } catch (e) {
      console.error(e);
    }
  }

  place() {
    this.block.tiles
      .mapPositions((p) => p.add(this.offset))
      .entries()
      .forEach(([p, blockTile]) => {
        const tile = this.tiles.get(p)!!;
        this.tiles.set(p, { ...tile, id: blockTile.id, owner: blockTile.owner });
      });
    while (true) {
      this.block = this.blockBag.next();
      let rotations = 0;
      while (rotations < 4) {
        try {
          this.offset = this.offset.add(
            necessaryKick(this.block, this.offset, this.getValidPositions()),
          );
          return;
        } catch (e) {
          this.rotateClockwise();
          ++rotations;
        }
      }
    }
  }

  getPositions(): Position[] {
    return this.block.tiles.positions().map((p) => p.add(this.offset));
  }
}
