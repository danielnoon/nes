import EventBus from "../EventBus";
import PPU from "./ppu";

export interface Mapper {
  read(address: number): number;
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
      return 0b10000001;
    }

    if (address >= 0x4000 && address < 0x6000) {
      return Math.floor((address - 0x4000) / 0x100) + 0x40;
    }

    return this.memory[address];
  }

  write(address: number, value: number): void {
    // TODO: implement mapper logic
    try {
      Atomics.store(this.memory, address, value);
    } catch (e) {
      console.error("Error writing to memory at address: " + address);
      throw e;
    }
  }
}
