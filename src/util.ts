import { enumerate } from "itertools";
import { CHR_BANK_SIZE, PRG_BANK_SIZE, ROM_START_ADDRESS } from "./const";
import { ROM } from "./parse";

export function copyPrgBanks(rom: ROM, cpumem: SharedArrayBuffer) {
  const view = new Uint8Array(cpumem);

  for (const [i, bank] of enumerate(rom.prg_banks)) {
    const bank_view = new Uint8Array(bank);
    view.set(bank_view, ROM_START_ADDRESS + PRG_BANK_SIZE * i);
  }
}

export function copyChrBanks(rom: ROM, ppumem: SharedArrayBuffer) {
  const view = new Uint8Array(ppumem);

  for (const [i, bank] of enumerate(rom.chr_banks)) {
    const bank_view = new Uint8Array(bank);
    view.set(bank_view, 0x0000 + CHR_BANK_SIZE * i);
  }
}

export function signed(value: number): number {
  return value & 0x80 ? value - 0x100 : value;
}

export function printFlags(register: number): string {
  const flags = ["c", "z", "i", "d", "b", "r", "v", "n"];

  return flags.map((flag, i) => (register & (1 << i) ? flag : "-")).join("");
}
