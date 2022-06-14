import { OAM_BASE } from "../const";
import EventBus from "../EventBus";

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;

  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color);
  };

  return (f(0) << 16) | (f(8) << 8) | f(4);
}

export default class PPU {
  private tick = 0;
  private dot = 0;
  private oddFrame = true;
  private vblank = false;
  private frame = 0;
  private currentAddress = 0;
  private addressWrite = 0;
  private oamAddress = 0;
  private xScroll = 0;
  private yScroll = 0;
  private scrollWrite = 0;

  private get scanline() {
    return Math.floor(this.tick / 341);
  }

  private get lineCycle() {
    return this.tick % 341;
  }

  // #region Control Flags
  private _nametableBase = 0;
  private get nametableBase() {
    return [0x2000, 0x2400, 0x2800, 0x2c00][this._nametableBase];
  }
  private _vramIncrement = 0;
  private get vramIncrement() {
    return this._vramIncrement === 0 ? 1 : 32;
  }
  private _spriteTableAddr = 0;
  private get spriteTableAddr() {
    return this._spriteTableAddr === 0 ? 0x0000 : 0x1000;
  }
  private _backgroundTableAddr = 0;
  private get backgroundTableAddr() {
    return this._backgroundTableAddr === 0 ? 0x0000 : 0x1000;
  }
  private _spriteSize = 0;
  private get spriteSize() {
    return this._spriteSize === 0 ? 8 : 16;
  }
  private _mode = 0;
  private _nmi = 0;
  // #endregion

  // #region Mask Flags
  private _grayscale = 0;
  private _showLeftBackground = 0;
  private _showLeftSprites = 0;
  private _showBackground = 0;
  private _showSprites = 0;
  private _emphasizeRed = 0;
  private _emphasizeGreen = 0;
  private _emphasizeBlue = 0;
  // #endregion

  private _sprite0Hit = 0;

  constructor(
    private memory: Uint8Array,
    private bus: EventBus,
    private framebuffer: Uint32Array
  ) {}

  // #region Data Bus
  setControl(value: number) {
    this._nametableBase = value & 3;
    this._vramIncrement = (value >> 2) & 1;
    this._spriteTableAddr = (value >> 3) & 1;
    this._backgroundTableAddr = (value >> 4) & 1;
    this._spriteSize = (value >> 5) & 1;
    this._mode = (value >> 6) & 3;
    this._nmi = (value >> 7) & 1;
  }

  setMask(value: number) {
    this._grayscale = value & 1;
    this._showLeftBackground = (value >> 1) & 1;
    this._showLeftSprites = (value >> 2) & 1;
    this._showBackground = (value >> 3) & 1;
    this._showSprites = (value >> 4) & 1;
    this._emphasizeRed = (value >> 5) & 1;
    this._emphasizeGreen = (value >> 6) & 1;
    this._emphasizeBlue = (value >> 7) & 1;
  }

  getStatus() {
    const status =
      (this.vblank ? 0x80 : 0) |
      (this.oddFrame ? 0x40 : 0) |
      (this._sprite0Hit ? 0x20 : 0);

    this.vblank = false;

    return status;
  }

  setAddress(value: number) {
    if (this.addressWrite === 0) {
      this.currentAddress = value << 8;
      this.addressWrite = 1;
    } else {
      this.currentAddress |= value;
      this.addressWrite = 0;
    }
  }

  setData(value: number) {
    Atomics.store(this.memory, this.currentAddress, value);
    this.currentAddress += this.vramIncrement;
  }

  getData() {
    return Atomics.load(this.memory, this.currentAddress);
  }

  setScroll(value: number) {
    if (this.scrollWrite === 0) {
      this.xScroll = value;
      this.scrollWrite = 1;
    } else {
      this.yScroll = value;
      this.scrollWrite = 0;
    }
  }

  setOAMAddress(value: number) {
    this.oamAddress = value;
  }

  setOAMData(value: number) {
    Atomics.store(this.memory, OAM_BASE + this.oamAddress, value);
    this.oamAddress += 1;
  }

  getOAMData() {
    return Atomics.load(this.memory, OAM_BASE + this.oamAddress);
  }

  runOAMDMA(address: number, cpu: Uint8Array) {
    for (let i = 0; i < 256; i++) {
      Atomics.store(this.memory, OAM_BASE + i, Atomics.load(cpu, address + i));
    }
  }
  // #endregion

  cycle() {
    // TODO: implement one cycle of the PPU
    if (this.scanline === 240 && this.lineCycle === 0) {
      this.oddFrame = !this.oddFrame;
      this.vblank = true;
    }

    if (this.scanline === 261 && this.lineCycle === 1) {
      this.vblank = false;
    }

    this.tick += 1;

    if (this.scanline >= 262) {
      this.tick = 0;
      this.dot = 0;
      this.bus.send("frame", {});
      this.frame += 1;
    }
  }

  realCycle() {
    this.cycle();
    this.cycle();
    this.cycle();
  }
}
