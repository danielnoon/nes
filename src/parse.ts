import { CHR_BANK_SIZE, PRG_BANK_SIZE } from "./const";
import { None, Option, Some } from "./types/option";
import { Result, Ok, Err } from "./types/result";

export interface ROM {
  title: Option<string>;
  trainer: ArrayBuffer;
  prg_banks: ArrayBuffer[];
  chr_banks: ArrayBuffer[];
}

interface ParseError {
  message: string;
}

export function parse(rom: ArrayBuffer): Result<ROM, ParseError> {
  const view = new Uint8Array(rom);

  const trainerPresent = !!(view[6] & 0x06);

  console.log(`Trainer present: ${trainerPresent}`);

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
  });
}
