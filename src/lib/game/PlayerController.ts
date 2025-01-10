import type { Block } from '$lib/data/Block';
import { type Player } from '$lib/data/Player';
import { add, type Position } from '$lib/data/Position';
import { PositionMapWrapper, type PositionMap } from '$lib/data/PositionMap';
import type { Tile } from '$lib/data/Tile';
import { necessaryKick } from '$lib/game/Kick';
import type { RandomBagIterator } from '$lib/game/RandomBag';
import { rotateClockwise, rotateCounterClockwise } from '$lib/game/Rotation';
import { TetrominoShape } from '$lib/game/Tetrominoes';
import type { PartialPlayer } from '$lib/network/Action';

export class PlayerController {
  constructor(
    public player: Player,
    private blockBag: RandomBagIterator<TetrominoShape, Block>,
    private tiles: PositionMap<Tile>,
    private players: Player[],
    private onPlayerChange: (player: PartialPlayer) => void,
    private onTileChange: (tileChanges: PositionMap<{ oldTile: Tile; newTile: Tile }>) => void,
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
      this.onPlayerChange({ id: this.player.id, offset: this.player.offset });
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

      this.onPlayerChange({
        id: this.player.id,
        offset: this.player.offset,
        block: this.player.block,
      });
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

      this.onPlayerChange({
        id: this.player.id,
        offset: this.player.offset,
        block: this.player.block,
      });
    } catch (e) {
      console.error(e);
    }
  }

  place() {
    const placedBlock = new PositionMapWrapper(this.player.block.tiles).mapPositions((p) =>
      add(p, this.player.offset),
    );
    const tilesWrapper = new PositionMapWrapper(this.tiles);

    const tileChanges = placedBlock.mapObjects((p, blockTile) => {
      const oldTile = tilesWrapper.get(p)!!;
      const newTile =
        oldTile.ownerId === this.player.id
          ? { ...oldTile, ownerId: undefined }
          : { ...oldTile, id: blockTile.id, ownerId: blockTile.ownerId };
      return { oldTile, newTile };
    });

    tileChanges.entries().forEach(([p, { oldTile, newTile }]) => tilesWrapper.set(p, newTile));
    this.onTileChange(tileChanges.unwrap());

    while (true) {
      this.player.block = this.blockBag.next();
      let rotations = 0;
      while (rotations < 4) {
        try {
          this.player.offset = add(
            this.player.offset,
            necessaryKick(this.player.block, this.player.offset, this.getValidPositions()),
          );
          this.onPlayerChange({
            id: this.player.id,
            offset: this.player.offset,
            block: this.player.block,
          });
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
