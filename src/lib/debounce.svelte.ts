export function debounce(
  node: HTMLElement,
  params: { effect: (node: HTMLElement) => void; latency: number }
) {
  let timer: number;

  $effect(() => {
    const handler = (e: Event) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        params.effect(node);
      }, params.latency);
    };

    node.addEventListener('input', handler);

    return () => {
      node.removeEventListener('input', handler);
    };
  });
}
