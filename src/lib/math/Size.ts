export class Size {
  static readonly EMPTY = new Size(0, 0);

  constructor(
    readonly width: number,
    readonly height: number,
  ) {}
}
