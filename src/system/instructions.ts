import { Mode, to16bit } from "./addressing";
import CPU from "./cpu";
import { ADC } from "./impl/arithmetic";
import { ASL, LSR, ROL, ROR } from "./impl/bitshift";
import { BCC, BCS, BEQ, BMI, BNE, BPL } from "./impl/branch";
import { CLC, CLD, SEI } from "./impl/flag-control";
import { DEX, DEY, INC, INX, INY } from "./impl/increment";
import { LDX, LDA, LDY } from "./impl/load";
import { AND, CMP, CPX, CPY, EOR, ORA } from "./impl/logic";
import { PHA, PHP, PLA, PLP } from "./impl/stack";
import { STY, STA, STX } from "./impl/store";
import { TAX, TAY, TSX, TXA, TXS, TYA } from "./impl/transfer";

type AddressingMethod = (cpu: CPU) => number | void;

const JMP = {
  name: "JMP",
  methods: {
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      cpu.pc = to16bit(args[0], args[1]);
      cpu.delay = 3;
    },
    [Mode.Indirect](cpu: CPU) {
      const args = cpu.args(2);
      const addr = to16bit(args[0], args[1]);
      cpu.pc = cpu.memory.read(addr);
      cpu.pc |= cpu.memory.read(addr + 1) << 8;
      cpu.delay = 5;
    },
  },
};

const JSR = {
  name: "JSR",
  methods: {
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      cpu.push(cpu.pc >> 8);
      cpu.push((cpu.pc & 0xff) + 2);
      cpu.pc = to16bit(args[0], args[1]);
      cpu.delay = 6;
    },
  },
};

const RTS = {
  name: "RTS",
  methods: {
    [Mode.Implied](cpu: CPU) {
      const low = cpu.pop();
      const high = cpu.pop();
      cpu.pc = to16bit(low, high) + 1;
      cpu.delay = 6;
    },
  },
};

const BIT = {
  name: "BIT",
  methods: {
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      const value = cpu.memory.read(args[0]);
      cpu.z = (value & cpu.a) === 0;
      cpu.n = (value & 0x80) !== 0;
      cpu.v = (value & 0x40) !== 0;
      cpu.pc += 2;
      cpu.delay = 3;
    },
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]));
      cpu.z = (value & cpu.a) === 0;
      cpu.n = (value & 0x80) !== 0;
      cpu.v = (value & 0x40) !== 0;
      cpu.pc += 3;
      cpu.delay = 4;
    },
  },
};

const RTI = {
  name: "RTI",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.p = cpu.pop() | 0x20;
      cpu.pc = to16bit(cpu.pop(), cpu.pop());
      cpu.delay = 6;
    },
  },
};

const opcodeMatrix: Record<number, AddressingMethod> = {
  0x06: ASL.methods[Mode.ZeroPage],
  0x08: PHP.methods[Mode.Implied],
  0x09: ORA.methods[Mode.Immediate],
  0x0d: ORA.methods[Mode.Absolute],
  0x10: BPL.methods[Mode.Relative],
  0x18: CLC.methods[Mode.Implied],
  0x20: JSR.methods[Mode.Absolute],
  0x24: BIT.methods[Mode.ZeroPage],
  0x28: PLP.methods[Mode.Implied],
  0x29: AND.methods[Mode.Immediate],
  0x2a: ROL.methods[Mode.Accumulator],
  0x2c: BIT.methods[Mode.Absolute],
  0x30: BMI.methods[Mode.Relative],
  0x40: RTI.methods[Mode.Implied],
  0x45: EOR.methods[Mode.ZeroPage],
  0x46: LSR.methods[Mode.ZeroPage],
  0x48: PHA.methods[Mode.Implied],
  0x49: EOR.methods[Mode.Immediate],
  0x4a: LSR.methods[Mode.Accumulator],
  0x4c: JMP.methods[Mode.Absolute],
  0x60: RTS.methods[Mode.Implied],
  0x65: ADC.methods[Mode.ZeroPage],
  0x66: ROR.methods[Mode.ZeroPage],
  0x68: PLA.methods[Mode.Implied],
  0x69: ADC.methods[Mode.Immediate],
  0x6a: ROR.methods[Mode.Accumulator],
  0x6c: JMP.methods[Mode.Indirect],
  0x78: SEI.methods[Mode.Implied],
  0x84: STY.methods[Mode.ZeroPage],
  0x85: STA.methods[Mode.ZeroPage],
  0x86: STX.methods[Mode.ZeroPage],
  0x88: DEY.methods[Mode.Implied],
  0x8a: TXA.methods[Mode.Implied],
  0x8c: STY.methods[Mode.Absolute],
  0x8d: STA.methods[Mode.Absolute],
  0x8e: STX.methods[Mode.Absolute],
  0x90: BCC.methods[Mode.Relative],
  0x91: STA.methods[Mode.IndirectIndexed],
  0x95: STA.methods[Mode.ZeroPageX],
  0x98: TYA.methods[Mode.Implied],
  0x99: STA.methods[Mode.AbsoluteY],
  0x9a: TXS.methods[Mode.Implied],
  0x9d: STA.methods[Mode.AbsoluteX],
  0xa6: LDX.methods[Mode.ZeroPage],
  0xa8: TAY.methods[Mode.Implied],
  0xa9: LDA.methods[Mode.Immediate],
  0xac: LDY.methods[Mode.Absolute],
  0xad: LDA.methods[Mode.Absolute],
  0xa0: LDY.methods[Mode.Immediate],
  0xa2: LDX.methods[Mode.Immediate],
  0xa5: LDA.methods[Mode.ZeroPage],
  0xaa: TAX.methods[Mode.Implied],
  0xb0: BCS.methods[Mode.Relative],
  0xb1: LDA.methods[Mode.IndirectIndexed],
  0xba: TSX.methods[Mode.Implied],
  0xbd: LDA.methods[Mode.AbsoluteX],
  0xc0: CPY.methods[Mode.Immediate],
  0xc8: INY.methods[Mode.Implied],
  0xc9: CMP.methods[Mode.Immediate],
  0xca: DEX.methods[Mode.Implied],
  0xd0: BNE.methods[Mode.Relative],
  0xd8: CLD.methods[Mode.Implied],
  0xe0: CPX.methods[Mode.Immediate],
  0xe6: INC.methods[Mode.ZeroPage],
  0xe8: INX.methods[Mode.Implied],
  0xee: INC.methods[Mode.Absolute],
  0xf0: BEQ.methods[Mode.Relative],
};

export function decode(this: CPU, opcode: number): AddressingMethod | null {
  if (opcode in opcodeMatrix) {
    return opcodeMatrix[opcode];
  }
  return null;
}
