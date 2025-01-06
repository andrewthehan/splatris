import type { Block } from './Block';
import { BoundingBox } from '../math/BoundingBox';
import { Position } from '../math/Position';
import { PositionMap } from '../math/PositionMap';
import type { Tile } from './Tile';

const KICKS = [
  Position.ORIGIN,
  Position.UP,
  Position.RIGHT,
  Position.DOWN,
  Position.LEFT,
  Position.UP.multiply(2),
  Position.RIGHT.multiply(2),
  Position.DOWN.multiply(2),
  Position.LEFT.multiply(2),
];

function performRotation<T>(
  block: Block,
  offset: Position,
  validPositions: PositionMap<T>,
  rotateFn: (position: Position, pivot: Position) => Position,
): Block {
  const pivot = block.tiles.center();
  const rotatedBlock = block.tiles.mapPositions((position) => rotateFn(position, pivot));

  for (const kick of KICKS) {
    const kickedBlock: PositionMap<Tile> = rotatedBlock.mapPositions((p) => p.add(kick));
    if (validPositions.hasAll(kickedBlock.positions().map((p) => p.add(offset)))) {
      return { tiles: kickedBlock };
    }
  }

  return block;
}

function adjustForNonIntegerPivot(
  position: Position,
  size: { width: number; height: number },
): Position {
  const rounded = position.floor();
  if (size.width % 2 !== size.height % 2) {
    return rounded.add(new Position(size.width % 2, size.height % 2));
  }
  return rounded;
}

export function rotateClockwise<T>(
  block: Block,
  offset: Position,
  validPositions: PositionMap<T>,
): Block {
  const size = BoundingBox.fromPositions(block.tiles.positions()).size;
  return performRotation(block, offset, validPositions, (position, pivot) => {
    const relative = position.subtract(pivot);
    const rotated = new Position(pivot.x - relative.y, pivot.y + relative.x);
    return adjustForNonIntegerPivot(rotated, size);
  });
}

export function rotateCounterClockwise<T>(
  block: Block,
  offset: Position,
  validPositions: PositionMap<T>,
): Block {
  const size = BoundingBox.fromPositions(block.tiles.positions()).size;
  return performRotation(block, offset, validPositions, (position, pivot) => {
    const relative = position.subtract(pivot);
    const rotated = new Position(pivot.x + relative.y, pivot.y - relative.x);
    return adjustForNonIntegerPivot(rotated, size);
  });
}
