import Controller from "../controller";
import EventBus from "../EventBus";
import { to16bit } from "./addressing";
import PPU from "./ppu";

export interface Mapper {
  read(address: number, zeroPage?: boolean): number;
  read16(address: number, zeroPage?: boolean): number;
  write(address: number, value: number, zeroPage?: boolean): void;
}

export class Mapper0 implements Mapper {
  constructor(
    private memory: Uint8Array,
    private ppu: PPU,
    private bus: EventBus,
    private controller: Controller
  ) {}

  read(address: number, zeroPage = false): number {
    // TODO: implement mapper logic

    if (zeroPage) address &= 0xff;

    if (address >= 0x0000 && address <= 0x1fff) {
      return Atomics.load(this.memory, address % 0x0800);
    }

    if (address === 0x2002) {
      return this.ppu.getStatus();
    }

    if (address === 0x2004) {
      return this.ppu.getOAMData();
    }

    if (address === 0x2007) {
      return this.ppu.getData();
    }

    if (address === 0x4016) {
      return this.controller.getController1();
    }

    if (address === 0x4017) {
      return this.controller.getController2();
    }

    if (address >= 0x4000 && address < 0x6000) {
      return Math.floor((address - 0x4000) / 0x100) + 0x40;
    }

    return this.memory[address];
  }

  read16(address: number, zeroPage = false): number {
    return to16bit(
      this.read(address),
      this.read((address + 1) & (zeroPage ? 0xff : 0xffff))
    );
  }

  write(address: number, value: number, zeroPage = false): void {
    // TODO: implement mapper logic

    if (zeroPage) address &= 0xff;

    if (address >= 0x0000 && address <= 0x1fff) {
      Atomics.store(this.memory, address % 0x0800, value);
    }

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

    if (address === 0x4016) {
      this.controller.pollControllers();
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
