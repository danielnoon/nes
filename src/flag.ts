type Names = [
  _0: string,
  _1: string,
  _2: string,
  _3: string,
  _4: string,
  _5: string,
  _6: string,
  _7: string
];

function v(n: number) {
  return { value: n };
}

export class Flag {
  private _0 = v(0);
  private _1 = v(0);
  private _2 = v(0);
  private _3 = v(0);
  private _4 = v(0);
  private _5 = v(0);
  private _6 = v(0);
  private _7 = v(0);

  private nMap = new Map<string, number>();

  constructor(names: Names) {
    for (let i = 0; i < 8; i++) {
      this.nMap.set(names[i], i);
    }
  }

  setRegister(value: number) {
    this._0.value = (value >> 0) & 1;
    this._1.value = (value >> 1) & 1;
    this._2.value = (value >> 2) & 1;
    this._3.value = (value >> 3) & 1;
    this._4.value = (value >> 4) & 1;
    this._5.value = (value >> 5) & 1;
    this._6.value = (value >> 6) & 1;
    this._7.value = (value >> 7) & 1;
  }

  getRegister(): number {
    return (
      (this._0.value << 0) |
      (this._1.value << 1) |
      (this._2.value << 2) |
      (this._3.value << 3) |
      (this._4.value << 4) |
      (this._5.value << 5) |
      (this._6.value << 6) |
      (this._7.value << 7)
    );
  }

  setValue(name: string, value: number) {
    const index = this.nMap.get(name);
    if (index === undefined) {
      throw new Error(`Unknown flag name: ${name}`);
    }
    (this as any)[`_${index}`].value = value;
  }

  getValue(name: string): number {
    const index = this.nMap.get(name);
    if (index === undefined) {
      throw new Error(`Unknown flag name: ${name}`);
    }
    return (this as any)[`_${index}`].value;
  }
}
