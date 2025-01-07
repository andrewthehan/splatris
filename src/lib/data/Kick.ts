import { Position } from '$lib/math/Position';
import { PositionMap } from '$lib/math/PositionMap';
import { type Block } from './Block';

const DIRECTIONS = [Position.UP, Position.RIGHT, Position.DOWN, Position.LEFT];

export function necessaryKick<T>(
  block: Block,
  offset: Position,
  validPositions: PositionMap<T>,
  maxDistance = 4,
): Position {
  if (validPositions.hasAll(block.tiles.positions().map((p) => p.add(offset)))) {
    return Position.ORIGIN;
  }

  let kickDistance = 1;
  while (kickDistance <= maxDistance) {
    for (const direction of DIRECTIONS) {
      const kick = direction.multiply(kickDistance);
      const kickedBlock = block.tiles.mapPositions((p) => p.add(kick));
      if (validPositions.hasAll(kickedBlock.positions().map((p) => p.add(offset)))) {
        return kick;
      }
    }
    ++kickDistance;
  }

  throw new Error('Failed to find kick to move block into a valid position');
}
