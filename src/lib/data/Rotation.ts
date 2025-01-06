import { BoundingBox } from '../math/BoundingBox';
import { Position } from '../math/Position';
import type { Block } from './Block';

function performRotation<T>(
  block: Block,
  rotateFn: (position: Position, pivot: Position) => Position,
): Block {
  const pivot = block.tiles.center();
  return { ...block, tiles: block.tiles.mapPositions((position) => rotateFn(position, pivot)) };
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

export function rotateClockwise<T>(block: Block): Block {
  const size = BoundingBox.fromPositions(block.tiles.positions()).size;
  return performRotation(block, (position, pivot) => {
    const relative = position.subtract(pivot);
    const rotated = new Position(pivot.x - relative.y, pivot.y + relative.x);
    return adjustForNonIntegerPivot(rotated, size);
  });
}

export function rotateCounterClockwise<T>(block: Block): Block {
  const size = BoundingBox.fromPositions(block.tiles.positions()).size;
  return performRotation(block, (position, pivot) => {
    const relative = position.subtract(pivot);
    const rotated = new Position(pivot.x + relative.y, pivot.y - relative.x);
    return adjustForNonIntegerPivot(rotated, size);
  });
}
