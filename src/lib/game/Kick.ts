import { add, DOWN, LEFT, multiply, ORIGIN, type Position, RIGHT, UP } from '$lib/data/Position';
import { PositionMapWrapper } from '$lib/data/PositionMap';
import { type Block } from '../data/Block';

const DIRECTIONS = [UP, RIGHT, DOWN, LEFT];

export function necessaryKick<T>(
  block: Block,
  offset: Position,
  validPositions: PositionMapWrapper<T>,
  maxDistance = 4
): Position {
  const blockTiles = new PositionMapWrapper(block.tiles);

  if (validPositions.hasAll(blockTiles.positions().map((p) => add(p, offset)))) {
    return ORIGIN;
  }

  let kickDistance = 1;
  while (kickDistance <= maxDistance) {
    for (const direction of DIRECTIONS) {
      const kick = multiply(direction, kickDistance);
      const kickedBlock = blockTiles.mapPositions((p) => add(p, kick));
      if (validPositions.hasAll(kickedBlock.positions().map((p) => add(p, offset)))) {
        return kick;
      }
    }
    ++kickDistance;
  }

  throw new Error('Failed to find kick to move block into a valid position');
}
