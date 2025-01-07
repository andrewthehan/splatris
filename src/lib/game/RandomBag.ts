// adapted from https://stackoverflow.com/a/2450976
export function shuffle<T>(array: T[]): T[] {
  const copy = array.slice();
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [copy[currentIndex], copy[randomIndex]] = [copy[randomIndex], copy[currentIndex]];
  }

  return copy;
}

// https://tetris.fandom.com/wiki/Random_Generator
export class RandomBagIterator<T, R> {
  values: T[];
  private queue: [T, R][];
  transform: (t: T) => R;

  constructor(values: T[], transform: (t: T) => R = (t) => t as unknown as R) {
    this.values = values;
    this.transform = transform;

    this.queue = [];
  }

  private queueNextBag() {
    if (this.values.length === 0) {
      throw new Error('Nothing to queue.');
    }

    this.queue = [
      ...this.queue,
      ...shuffle(this.values).map((t) => [t, this.transform(t)] as [T, R]),
    ];
  }

  next(): R {
    if (this.queue.length === 0) {
      this.queueNextBag();
    }

    const [t, r] = this.queue.shift()!!;
    return r;
  }

  peek(n: number): R[] {
    if (this.values.length === 0) {
      return [];
    }

    while (this.queue.length < n) {
      this.queueNextBag();
    }

    return this.queue.slice(0, n).map(([t, r]) => r);
  }

  add(value: T) {
    this.values = [...this.values, value];
  }

  removeIf(condition: (t: T) => boolean) {
    this.values = this.values.filter((t) => !condition(t));
    this.queue = this.queue.filter(([t, r]) => !condition(t));
  }
}
