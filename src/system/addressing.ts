export enum Mode {
  Accumulator, // A
  Immediate, // just the next byte
  Implied, // implied by the instruction
  Relative, // PC + next byte (signed)
  Absolute, // next two bytes
  ZeroPage, // next byte
  ZeroPageX,
  ZeroPageY,
  AbsoluteX,
  AbsoluteY,
  Indirect,
  IndirectX,
  IndirectY,
  IndexedIndirect,
  IndirectIndexed,
}

export function to16bit(low: number, high: number): number {
  const value = low | (high << 8);
  return value & 0xffff;
}
