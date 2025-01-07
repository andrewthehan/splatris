import type { Block } from '$lib/data/Block';
import { createPlayer, type Player } from '$lib/data/Player';
import { add, type Position } from '$lib/data/Position';
import { PositionMapWrapper, type PositionMap } from '$lib/data/PositionMap';
import type { Tile } from '$lib/data/Tile';
import { necessaryKick } from '$lib/game/Kick';
import type { RandomBagIterator } from '$lib/game/RandomBag';
import { rotateClockwise, rotateCounterClockwise } from '$lib/game/Rotation';
import { TetrominoShape } from '$lib/game/Tetrominoes';

export class PlayerController {
  private static readonly DEFAULT_PLAYER: Player = createPlayer({ hue: 0 });

  constructor(
    public player: Player,
    private blockBag: RandomBagIterator<TetrominoShape, Block>,
    private tiles: PositionMap<Tile>,
    private players: Player[],
  ) {}

  private isCollision(newPositions: Position[]): boolean {
    return !this.getValidPositions().hasAll(newPositions);
  }

  move(direction: Position) {
    const newOffset = add(this.player.offset, direction);
    const newPositions = new PositionMapWrapper(this.player.block.tiles)
      .positions()
      .map((p) => add(p, newOffset));
    if (!this.isCollision(newPositions)) {
      this.player.offset = newOffset;
    }
  }

  getValidPositions(): PositionMapWrapper<{}> {
    const validPositions = new PositionMapWrapper(this.tiles).clone();
    this.players
      .filter((p) => p.id !== this.player.id)
      .flatMap((player) =>
        new PositionMapWrapper(player.block.tiles)
          .positions()
          .map((position) => add(position, player.offset)),
      )
      .forEach((p) => validPositions.delete(p));
    return validPositions;
  }

  rotateClockwise() {
    const newBlock = rotateClockwise(this.player.block);
    try {
      this.player.offset = add(
        this.player.offset,
        necessaryKick(newBlock, this.player.offset, this.getValidPositions()),
      );
      this.player.block = newBlock;
    } catch (e) {
      console.error(e);
    }
  }

  rotateCounterClockwise() {
    const newBlock = rotateCounterClockwise(this.player.block);
    try {
      this.player.offset = add(
        this.player.offset,
        necessaryKick(newBlock, this.player.offset, this.getValidPositions()),
      );
      this.player.block = newBlock;
    } catch (e) {
      console.error(e);
    }
  }

  place() {
    new PositionMapWrapper(this.player.block.tiles)
      .mapPositions((p) => add(p, this.player.offset))
      .entries()
      .forEach(([p, blockTile]) => {
        const wrapper = new PositionMapWrapper(this.tiles);
        const tile = wrapper.get(p)!!;
        if (tile.ownerId === this.player.id) {
          wrapper.set(p, { ...tile, ownerId: undefined });
        } else {
          wrapper.set(p, { ...tile, id: blockTile.id, ownerId: blockTile.ownerId });
        }
      });
    while (true) {
      this.player.block = this.blockBag.next();
      let rotations = 0;
      while (rotations < 4) {
        try {
          this.player.offset = add(
            this.player.offset,
            necessaryKick(this.player.block, this.player.offset, this.getValidPositions()),
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
    return new PositionMapWrapper(this.player.block.tiles)
      .positions()
      .map((p) => add(p, this.player.offset));
  }
}
