import type { Player } from '$lib/data/Player';
import { PositionMapWrapper } from '$lib/data/PositionMap';
import { quadIn } from 'svelte/easing';
import { crossfade } from 'svelte/transition';

export function getTransition(players: Player[]) {
  return crossfade({
    duration: 200,
    easing: quadIn,
    fallback(node, params) {
      if (
        players.some((player) =>
          new PositionMapWrapper(player.block.tiles)
            .values()
            .some((blockTile) => blockTile.id === (params as any).key),
        )
      ) {
        return {
          duration: 200,
          css: (t) => `
            transform: scale(${t});
            opacity: ${t};
          `,
        };
      }
      return {
        duration: 200,
        css: (t) => `
          opacity: ${t};
          z-index: -1;
        `,
      };
    },
  });
}
