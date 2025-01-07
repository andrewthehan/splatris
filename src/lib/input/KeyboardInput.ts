import type { GamePlayer } from '../../routes/GamePlayer.svelte';
import { Position } from '$lib/math/Position';

export function keyboardControl(event: KeyboardEvent, player: GamePlayer) {
  switch (event.code) {
    case 'ArrowUp':
      player.move(Position.UP);
      break;
    case 'ArrowDown':
      player.move(Position.DOWN);
      break;
    case 'ArrowLeft':
      player.move(Position.LEFT);
      break;
    case 'ArrowRight':
      player.move(Position.RIGHT);
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
