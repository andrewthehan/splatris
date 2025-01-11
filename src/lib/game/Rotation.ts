import { PositionMapWrapper } from '$lib/data/PositionMap';
import { add, floor, newPosition, subtract, type Position } from '../data/Position';
import { BoundingBox } from '../math/BoundingBox';
import type { Block } from '../data/Block';

function performRotation<T>(
  block: Block,
  rotateFn: (position: Position, pivot: Position) => Position
): Block {
  const blockWrapper = new PositionMapWrapper(block.tiles);
  const pivot = blockWrapper.center();
  return {
    ...block,
    tiles: blockWrapper.mapPositions((position) => rotateFn(position, pivot)).unwrap(),
  };
}

function adjustForNonIntegerPivot(
  position: Position,
  size: { width: number; height: number }
): Position {
  const rounded = floor(position);
  if (size.width % 2 !== size.height % 2) {
    return add(rounded, newPosition(size.width % 2, size.height % 2));
  }
  return rounded;
}

export function rotateClockwise<T>(block: Block): Block {
  const blockWrapper = new PositionMapWrapper(block.tiles);
  const size = BoundingBox.fromPositions(blockWrapper.positions()).size;
  return performRotation(block, (position, pivot) => {
    const relative = subtract(position, pivot);
    const rotated = newPosition(pivot.x - relative.y, pivot.y + relative.x);
    return adjustForNonIntegerPivot(rotated, size);
  });
}

export function rotateCounterClockwise<T>(block: Block): Block {
  const blockWrapper = new PositionMapWrapper(block.tiles);
  const size = BoundingBox.fromPositions(blockWrapper.positions()).size;
  return performRotation(block, (position, pivot) => {
    const relative = subtract(position, pivot);
    const rotated = newPosition(pivot.x + relative.y, pivot.y - relative.x);
    return adjustForNonIntegerPivot(rotated, size);
  });
}
