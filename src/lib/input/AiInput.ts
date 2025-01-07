import { type Tile } from '$lib/data/Tile';
import { Position } from '$lib/math/Position';
import { PositionMap } from '$lib/math/PositionMap';
import { rollChance } from '$lib/math/Random';
import { GamePlayer } from '../../routes/GamePlayer.svelte';

function findClosestPosition(
  positions: Position[],
  haystack: Position[],
): { position: Position; distance: number } {
  return haystack.reduce(
    (closest, position) => {
      const distance = Math.min(...positions.map((p) => p.distanceTo(position)));
      return distance < closest.distance ? { position, distance } : closest;
    },
    { position: Position.ORIGIN, distance: Infinity },
  );
}

export function startAi(enemy: GamePlayer, tiles: PositionMap<Tile>) {
  let movesSincePlacement = 0;

  function enemyMove() {
    const currentPositions = enemy.getPositions();
    const shouldPlace = currentPositions.some((p) => tiles.get(p)?.owner?.id !== enemy.player.id);

    if (shouldPlace) {
      enemy.place();
      movesSincePlacement = 0;
      return;
    }

    if (movesSincePlacement > 3 && rollChance(0.2)) {
      if (rollChance(0.5)) {
        enemy.rotateClockwise();
      } else {
        enemy.rotateCounterClockwise();
      }
      return;
    }

    const directions = [Position.UP, Position.DOWN, Position.LEFT, Position.RIGHT];
    if (rollChance(0.2)) {
      enemy.move(directions[Math.floor(Math.random() * directions.length)]);
      ++movesSincePlacement;
      return;
    }

    const targetPositions = tiles
      .entries()
      .filter(([_, tile]) => tile.owner?.id !== enemy.player.id)
      .map(([p, _]) => p);

    if (targetPositions.length > 0) {
      const { position: closestTarget } = findClosestPosition(
        enemy.getPositions(),
        targetPositions,
      );
      const targetDirection = directions.reduce(
        (closest, direction) => {
          const { distance } = findClosestPosition(
            [closestTarget],
            enemy.getPositions().map((p) => p.add(direction)),
          );
          return distance < closest.distance ? { direction, distance } : closest;
        },
        { direction: Position.ORIGIN, distance: Infinity },
      ).direction;

      enemy.move(targetDirection);
      ++movesSincePlacement;
    }
  }

  function scheduleNextMove() {
    setTimeout(() => {
      enemyMove();
      scheduleNextMove();
    }, 200);
  }
  scheduleNextMove();
}
