import { DOWN, LEFT, RIGHT, UP } from '$lib/data/Position';
import type { PlayerController } from '../../routes/PlayerController';

export function keyboardControl(event: KeyboardEvent, player: PlayerController) {
  switch (event.code) {
    case 'ArrowUp':
      player.move(UP);
      break;
    case 'ArrowDown':
      player.move(DOWN);
      break;
    case 'ArrowLeft':
      player.move(LEFT);
      break;
    case 'ArrowRight':
      player.move(RIGHT);
      break;
    case 'KeyZ':
      player.rotateClockwise();
      break;
    case 'KeyX':
      player.rotateCounterClockwise();
      break;
    case 'Space':
      player.place();
      break;
  }
}
