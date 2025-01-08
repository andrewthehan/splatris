import { PositionMapWrapper } from '$lib/data/PositionMap';
import { type Tile } from '$lib/data/Tile';
import { rollChance } from '$lib/math/Random';
import { PlayerController } from '../game/PlayerController';
import { add, distanceTo, DOWN, LEFT, ORIGIN, RIGHT, UP, type Position } from '../data/Position';

function findClosestPosition(
  positions: Position[],
  haystack: Position[],
): { position: Position; distance: number } {
  return haystack.reduce(
    (closest, position) => {
      const distance = Math.min(...positions.map((p) => distanceTo(p, position)));
      return distance < closest.distance ? { position, distance } : closest;
    },
    { position: ORIGIN, distance: Infinity },
  );
}

export function startAi(controller: PlayerController, tiles: PositionMapWrapper<Tile>) {
  let movesSincePlacement = 0;

  function takeAction() {
    const currentPositions = controller.getPositions();
    const unowned = currentPositions.filter((p) => tiles.get(p)?.ownerId !== controller.player.id);
    const owned = currentPositions.filter((p) => tiles.get(p)?.ownerId === controller.player.id);

    const shouldPlace = movesSincePlacement > 10 || unowned.length > owned.length;

    if (shouldPlace) {
      controller.place();
      movesSincePlacement = 0;
      return;
    }

    if (movesSincePlacement > 3 && rollChance(0.2)) {
      if (rollChance(0.5)) {
        controller.rotateClockwise();
      } else {
        controller.rotateCounterClockwise();
      }
      return;
    }

    const directions = [UP, DOWN, LEFT, RIGHT];
    if (rollChance(0.4)) {
      controller.move(directions[Math.floor(Math.random() * directions.length)]);
      ++movesSincePlacement;
      return;
    }

    const targetPositions = tiles
      .entries()
      .filter(([_, tile]) => tile.ownerId !== controller.player.id)
      .map(([p, _]) => p);

    if (targetPositions.length > 0) {
      const { position: closestTarget } = findClosestPosition(
        controller.getPositions(),
        targetPositions,
      );
      const targetDirection = directions.reduce(
        (closest, direction) => {
          const { distance } = findClosestPosition(
            [closestTarget],
            controller.getPositions().map((p) => add(p, direction)),
          );
          return distance < closest.distance ? { direction, distance } : closest;
        },
        { direction: ORIGIN, distance: Infinity },
      ).direction;

      controller.move(targetDirection);
      ++movesSincePlacement;
    }
  }

  function scheduleNextAction() {
    setTimeout(() => {
      takeAction();
      scheduleNextAction();
    }, 200);
  }
  scheduleNextAction();
}
