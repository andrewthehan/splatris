export type RandomEvent<T> = {
  probability: number;
  result: T;
};

// adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
export function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export function rollChance(successChance: number): boolean {
  return Math.random() < successChance;
}

export function rollEven<T>(results: T[]): T {
  return results[randomInt(0, results.length)];
}

export function rollByParts<T>(events: { result: T; part: number }[]): T {
  const totalParts = events.map((event) => event.part).reduce((a, b) => a + b, 0);

  return roll(
    events.map((event) => ({
      result: event.result,
      probability: event.part / totalParts,
    })),
  );
}

export function roll<T>(events: RandomEvent<T>[]): T {
  const totalProbability = events.map((event) => event.probability).reduce((a, b) => a + b, 0);

  if (Math.abs(totalProbability - 1) > 1e-5) {
    throw new Error(`Sum of probability of events doesn't equal 1.0: ${totalProbability}`);
  }

  const chance = Math.random();
  let probabilities = 0;
  for (const event of events) {
    probabilities += event.probability;
    if (probabilities > chance) {
      return event.result;
    }
  }

  throw new Error('The function should have returned.');
}
