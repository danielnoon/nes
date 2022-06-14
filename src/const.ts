export const PRG_BANK_SIZE = 16384;
export const CHR_BANK_SIZE = 8192;
export const ROM_START_ADDRESS = 0x8000;
export const NMI_VECTOR = 0xfffa;
export const RESET_VECTOR = 0xfffc;
export const IRQ_VECTOR = 0xfffe;
export const STACK_BASE = 0x0100;
export const OAM_BASE = 0x4000;
export const OAM_SIZE = 0x00ff;
export const SECONDARY_OAM_BASE = 0x4100;
export const SECONDARY_OAM_SIZE = 0x0020;

export const MASK = {
  n: 0b10000000,
  v: 0b01000000,
  r: 0b00100000,
  b: 0b00010000,
  d: 0b00001000,
  i: 0b00000100,
  z: 0b00000010,
  c: 0b00000001,
};
