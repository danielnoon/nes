import { CHR_BANK_SIZE, PRG_BANK_SIZE } from "./const";
import { None, Option, Some } from "./types/option";
import { Result, Ok, Err } from "./types/result";

enum Mirroring {
  Horizontal,
  Vertical,
}

export interface Cartridge {
  title: Option<string>;
  trainer: ArrayBuffer;
  prg_banks: ArrayBuffer[];
  chr_banks: ArrayBuffer[];
  mirroring: Mirroring;
  mapper: number;
}

interface ParseError {
  message: string;
}

export function parse(rom: ArrayBuffer): Result<Cartridge, ParseError> {
  const view = new Uint8Array(rom);

  if (
    view[0] !== 0x4e ||
    view[1] !== 0x45 ||
    view[2] !== 0x53 ||
    view[3] !== 0x1a
  ) {
    return new Err({
      message: "Invalid header",
    });
  }

  const trainerPresent = !!(view[6] & 0x06);
  const mirroring = view[6] & 0x01 ? Mirroring.Vertical : Mirroring.Horizontal;
  const mapper = (view[7] >> 4) | (view[6] & 0x0f);

  const n_prg_banks = view[4];
  const n_chr_banks = view[5];

  const prg_banks = [];
  const chr_banks = [];

  let ptr = trainerPresent ? 528 : 16;

  for (let i = 0; i < n_prg_banks; i++) {
    const bank = rom.slice(ptr, ptr + PRG_BANK_SIZE);
    prg_banks.push(bank);
    ptr += PRG_BANK_SIZE;
  }

  for (let i = 0; i < n_chr_banks; i++) {
    const bank = rom.slice(ptr, ptr + CHR_BANK_SIZE);
    chr_banks.push(bank);
    ptr += CHR_BANK_SIZE;
  }

  ptr += 8224;

  const title =
    ptr < rom.byteLength
      ? new Some(String.fromCharCode(...view.slice(ptr, ptr + 21)))
      : new None();

  return new Ok({
    title,
    trainer: trainerPresent ? rom.slice(16, 528) : new ArrayBuffer(0),
    prg_banks,
    chr_banks,
    mirroring,
    mapper,
  });
}
