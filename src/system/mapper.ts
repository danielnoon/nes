import EventBus from "../EventBus";
import { to16bit } from "./addressing";
import PPU from "./ppu";

export interface Mapper {
  read(address: number): number;
  read16(address: number): number;
  write(address: number, value: number): void;
}

export class Mapper0 implements Mapper {
  constructor(
    private memory: Uint8Array,
    private ppu: PPU,
    private bus: EventBus
  ) {}

  read(address: number): number {
    // TODO: implement mapper logic

    if (address === 0x2002) {
      return this.ppu.getStatus();
    }

    if (address === 0x2004) {
      return this.ppu.getOAMData();
    }

    if (address === 0x2007) {
      return this.ppu.getData();
    }

    if (address >= 0x4000 && address < 0x6000) {
      return Math.floor((address - 0x4000) / 0x100) + 0x40;
    }

    return this.memory[address];
  }

  read16(address: number): number {
    return to16bit(this.read(address), this.read(address + 1));
  }

  write(address: number, value: number): void {
    // TODO: implement mapper logic

    if (address === 0x2000) {
      this.ppu.setControl(value);
      return;
    }

    if (address === 0x2001) {
      this.ppu.setMask(value);
      return;
    }

    if (address === 0x2003) {
      this.ppu.setOAMAddress(value);
      return;
    }

    if (address === 0x2004) {
      this.ppu.setOAMData(value);
      return;
    }

    if (address === 0x2005) {
      this.ppu.setScroll(value);
      return;
    }

    if (address === 0x2006) {
      this.ppu.setAddress(value);
      return;
    }

    if (address === 0x2007) {
      this.ppu.setData(value);
      return;
    }

    if (address === 0x4014) {
      this.ppu.runOAMDMA(value << 8, this.memory);
      return;
    }

    try {
      Atomics.store(this.memory, address, value);
    } catch (e) {
      console.error("Error writing to memory at address: " + address);
      throw e;
    }
  }
}
