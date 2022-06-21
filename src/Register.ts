type Name = [name: string, length: number];

type InternalName = {
  name: string;
  length: number;
  offset: number;
};

export class Register {
  private _bits = 0;
  private mask = 0xff;

  private nMap = new Map<string, InternalName>();

  constructor(length: number, ...names: Name[]) {
    this.mask = (1 << length) - 1;

    let offset = 0;

    for (const name of names) {
      this.nMap.set(name[0], {
        name: name[0],
        length: name[1],
        offset: offset,
      });

      offset += name[1];
    }
  }

  set bits(value: number) {
    this._bits = value & this.mask;
  }

  get bits(): number {
    return this._bits;
  }

  set(name: string, value: number) {
    const attr = this.nMap.get(name);

    if (attr === undefined) {
      return;
    }

    const mask = (1 << attr.length) - 1;
    this.bits =
      (this.bits & ~(mask << attr.offset)) | ((value & mask) << attr.offset);
  }

  get(name: string): number {
    const attr = this.nMap.get(name);

    if (attr === undefined) {
      return 0;
    }

    const mask = (1 << attr.length) - 1;
    return (this.bits >> attr.offset) & mask;
  }
}
