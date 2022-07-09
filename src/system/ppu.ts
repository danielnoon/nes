import {
  OAM_BASE,
  OAM_SIZE,
  SECONDARY_OAM_BASE,
  SECONDARY_OAM_SIZE,
} from "../const";
import EventBus from "../EventBus";
import { Register } from "../Register";
import palette, { getColor } from "./palette";

function loopy() {
  return new Register(
    16,
    ["coarse_x", 5],
    ["coarse_y", 5],
    ["nametable_x", 1],
    ["nametable_y", 1],
    ["fine_y", 3],
    ["unused", 1]
  );
}

function oamEntry(data: number) {}

class Tile {
  public id = 0;
  public attr = 0;
  public low = 0;
  public high = 0;
}

class BGShifter {
  // #region Registers
  private _pattern_low = 0;
  set pattern_low(value: number) {
    this._pattern_low = value & 0xffff;
  }
  get pattern_low() {
    return this._pattern_low;
  }

  private _pattern_high = 0;
  set pattern_high(value: number) {
    this._pattern_high = value & 0xffff;
  }
  get pattern_high() {
    return this._pattern_high;
  }

  private _attr_low = 0;
  set attr_low(value: number) {
    this._attr_low = value & 0xffff;
  }
  get attr_low() {
    return this._attr_low;
  }

  private _attr_high = 0;
  set attr_high(value: number) {
    this._attr_high = value & 0xffff;
  }
  get attr_high() {
    return this._attr_high;
  }
  // #endregion

  loadPattern(low: number, high: number) {
    this.pattern_low = (this.pattern_low & 0xff00) | (low & 0xff);
    this.pattern_high = (this.pattern_high & 0xff00) | (high & 0xff);
  }

  loadAttr(attrVal: number) {
    this.attr_low = (this.attr_low & 0xff00) | (attrVal & 0b01 ? 0xff : 0x00);
    this.attr_high = (this.attr_high & 0xff00) | (attrVal & 0b10 ? 0xff : 0x00);
  }

  shift() {
    this.pattern_low <<= 1;
    this.pattern_high <<= 1;
    this.attr_low <<= 1;
    this.attr_high <<= 1;
  }

  current(fineX: number): [pixel: number, palette: number] {
    const mux = 0x8000 >> fineX;

    const px0 = (this.pattern_low & mux) > 0 ? 1 : 0;
    const px1 = (this.pattern_high & mux) > 0 ? 1 : 0;

    const px = (px0 | (px1 << 1)) & 0b11;

    const attr0 = (this.attr_low & mux) > 0 ? 1 : 0;
    const attr1 = (this.attr_high & mux) > 0 ? 1 : 0;

    const attr = (attr0 | (attr1 << 1)) & 0b11;

    return [px, attr];
  }
}

export default class PPU {
  private vramAddr = loopy();
  private tramAddr = loopy();
  private fineX = 0;

  private bgNext = new Tile();

  private shifters = new BGShifter();

  private tick = 0;
  private dot = 0;
  private oddFrame = true;
  private vblank = false;
  private frame = 0;
  private addressWrite = 0;
  private oamAddress = 0;
  private xScroll = 0;
  private yScroll = 0;
  private scrollWrite = 0;
  private spriteCount = 0;

  private get scanline() {
    return Math.floor(this.tick / 341) - 1;
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

  getMemory(addr: number) {
    if (addr >= 0x3000 && addr < 0x3f00) {
      addr -= 0x1000;
    }
    if (addr >= 0x3f20 && addr < 0x3fff) {
      addr = 0x3f00 + (addr & 0x1f);
    }
    return Atomics.load(this.memory, addr);
  }

  setMemory(addr: number, value: number) {
    if (addr >= 0x3000 && addr < 0x3f00) {
      addr -= 0x1000;
    }
    if (addr >= 0x3f20 && addr < 0x3fff) {
      addr = 0x3f00 + (addr & 0x1f);
    }
    try {
      Atomics.store(this.memory, addr, value);
    } catch {
      console.warn(`Failed to write to memory at ${addr.toString(16)}`);
    }
  }

  // #region Data Bus
  setControl(value: number) {
    this._nametableBase = value & 3;
    this._vramIncrement = (value >> 2) & 1;
    this._spriteTableAddr = (value >> 3) & 1;
    this._backgroundTableAddr = (value >> 4) & 1;
    this._spriteSize = (value >> 5) & 1;
    this._mode = (value >> 6) & 3;
    this._nmi = (value >> 7) & 1;

    this.tramAddr.set("nametable_x", value & 1);
    this.tramAddr.set("nametable_y", (value >> 1) & 1);
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
      this.tramAddr.bits = (this.tramAddr.bits & 0x00ff) | (value << 8);
      this.addressWrite = 1;
    } else {
      this.tramAddr.bits = (this.tramAddr.bits & 0xff00) | value;
      this.vramAddr.bits = this.tramAddr.bits;
      this.addressWrite = 0;
    }
  }

  setData(value: number) {
    this.setMemory(this.vramAddr.bits, value);
    this.vramAddr.bits += this.vramIncrement;
  }

  getData() {
    const value = this.getMemory(this.vramAddr.bits);
    this.vramAddr.bits += this.vramIncrement;
    return value;
  }

  setScroll(value: number) {
    if (this.scrollWrite === 0) {
      this.fineX = value & 0x07;
      this.tramAddr.set("coarse_x", value >> 3);
      this.scrollWrite = 1;
    } else {
      this.tramAddr.set("fine_y", value & 0x07);
      this.tramAddr.set("coarse_y", value >> 3);
      this.scrollWrite = 0;
    }
  }

  setOAMAddress(value: number) {
    this.oamAddress = value;
  }

  setOAMData(value: number) {
    this.setMemory(OAM_BASE + this.oamAddress, value);
    this.oamAddress += 1;
  }

  getOAMData() {
    return this.getMemory(OAM_BASE + this.oamAddress);
  }

  runOAMDMA(address: number, cpu: Uint8Array) {
    for (let i = 0; i < 256; i++) {
      this.setMemory(OAM_BASE + i, Atomics.load(cpu, address + i));
    }
  }
  // #endregion

  incrementScrollX() {
    if (!(this._showBackground || this._showSprites)) return;

    if (this.vramAddr.get("coarse_x") === 31) {
      this.vramAddr.set("coarse_x", 0);
      this.vramAddr.set("nametable_x", this.vramAddr.get("nametable_x") ^ 1);
    } else {
      this.vramAddr.set("coarse_x", this.vramAddr.get("coarse_x") + 1);
    }
  }

  incrementScrollY() {
    if (!(this._showBackground || this._showSprites)) return;

    if (this.vramAddr.get("fine_y") === 7) {
      this.vramAddr.set("fine_y", 0);
      if (this.vramAddr.get("coarse_y") === 29) {
        this.vramAddr.set("coarse_y", 0);
        this.vramAddr.set("nametable_y", this.vramAddr.get("nametable_y") ^ 1);
      } else if (this.vramAddr.get("coarse_y") === 31) {
        this.vramAddr.set("coarse_y", 0);
      } else {
        this.vramAddr.set("coarse_y", this.vramAddr.get("coarse_y") + 1);
      }
    } else {
      this.vramAddr.set("fine_y", this.vramAddr.get("fine_y") + 1);
    }
  }

  transferAddressX() {
    if (!(this._showBackground || this._showSprites)) return;

    this.vramAddr.set("nametable_x", this.tramAddr.get("nametable_x"));
    this.vramAddr.set("coarse_x", this.tramAddr.get("coarse_x"));
  }

  transferAddressY() {
    if (!(this._showBackground || this._showSprites)) return;

    this.vramAddr.set("nametable_y", this.tramAddr.get("nametable_y"));
    this.vramAddr.set("coarse_y", this.tramAddr.get("coarse_y"));
    this.vramAddr.set("fine_y", this.tramAddr.get("fine_y"));
  }

  loadBackgroundShifters() {
    if (!(this._showBackground || this._showSprites)) return;
  }

  getTileId() {
    return this.getMemory(0x2000 | (this.vramAddr.bits & 0x0fff));
  }

  getTileAttr() {
    const addr =
      0x23c0 |
      (this.vramAddr.get("nametable_y") << 11) |
      (this.vramAddr.get("nametable_x") << 10) |
      ((this.vramAddr.get("coarse_y") >> 2) << 3) |
      (this.vramAddr.get("coarse_x") >> 2);

    return this.getMemory(addr);
  }

  getTile(high: boolean) {
    const addr =
      this.backgroundTableAddr |
      (this.bgNext.id << 4) |
      this.vramAddr.get("fine_y");

    return this.getMemory(addr + (high ? 8 : 0));
  }

  doScanlineOp(dot: number) {
    switch (dot % 8) {
      case 0:
        this.shifters.loadPattern(this.bgNext.low, this.bgNext.high);
        this.shifters.loadAttr(this.bgNext.attr);
        this.bgNext.id = this.getTileId();
        break;
      case 2: {
        let attr = this.getTileAttr();
        if (this.vramAddr.get("coarse_y") & 0x02) attr >>= 4;
        if (this.vramAddr.get("coarse_x") & 0x02) attr >>= 2;
        this.bgNext.attr = attr & 0x03;
        break;
      }
      case 4:
        this.bgNext.low = this.getTile(false);
        break;
      case 6:
        this.bgNext.high = this.getTile(true);
        break;
      case 7:
        this.incrementScrollX();
        break;
    }
  }

  getColor(paletteId: number, index: number) {
    const id = this.getMemory(0x3f00 | (paletteId << 2) | index) & 0x3f;
    return getColor(id);
  }

  cycle() {
    let bgColor = 0;
    let spriteColor = 0;

    if (this.scanline >= -1 && this.scanline <= 239) {
      if (this.scanline === -1 && this.lineCycle === 1) {
        this.vblank = false;
      }

      if (
        (this.lineCycle >= 2 && this.lineCycle <= 257) ||
        (this.lineCycle >= 321 && this.lineCycle <= 337)
      ) {
        this.shifters.shift();
        this.doScanlineOp(this.lineCycle - 2);
      }

      if (this.scanline >= 0 && this.lineCycle >= 1 && this.lineCycle <= 256) {
        const [pixel, palette] = this.shifters.current(this.fineX);

        if (this._showBackground) {
          bgColor = this.getColor(palette, pixel);
        }

        this.dot += 1;
      }

      if (this.lineCycle === 256) {
        this.incrementScrollY();
      }

      if (this.lineCycle === 257) {
        this.transferAddressX();
      }

      // if (this.lineCycle === 257 && this.scanline >= 0) {
      //   this.memory.fill(
      //     0xff,
      //     SECONDARY_OAM_BASE,
      //     SECONDARY_OAM_BASE + SECONDARY_OAM_SIZE
      //   );

      //   this.spriteCount = 0;

      //   let nOAMEntry = 0;
      //   while (nOAMEntry < 64 && this.spriteCount < 9) {}
      // }

      try {
        Atomics.store(this.framebuffer, this.dot, bgColor);
      } catch (e) {}

      if (
        this.scanline === -1 &&
        this.lineCycle >= 280 &&
        this.lineCycle <= 304
      ) {
        this.transferAddressY();
        this.dot = 0;
      }
    }

    if (this.scanline === 241 && this.lineCycle === 1) {
      this.oddFrame = !this.oddFrame;
      this.vblank = true;
      if (this._nmi) {
        this.bus.send("nmi");
      }
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
