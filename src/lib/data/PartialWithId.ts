import type { Identifiable } from './Identifiable';

export type PartialWithId<T extends Identifiable> = Pick<T, 'id'> & Partial<T>;
