import { Mode, to16bit } from "./addressing";
import CPU from "./cpu";
import { ADC, SBC } from "./impl/arithmetic";
import { ASL, LSR, ROL, ROR } from "./impl/bitshift";
import { BCC, BCS, BEQ, BMI, BNE, BPL, BVC, BVS } from "./impl/branch";
import { CLC, CLD, CLV, SEC, SED, SEI } from "./impl/flag-control";
import { DEC, DEX, DEY, INC, INX, INY } from "./impl/increment";
import { LDX, LDA, LDY } from "./impl/load";
import { AND, CMP, CPX, CPY, EOR, ORA } from "./impl/logic";
import { PHA, PHP, PLA, PLP } from "./impl/stack";
import { STY, STA, STX } from "./impl/store";
import { TAX, TAY, TSX, TXA, TXS, TYA } from "./impl/transfer";

type AddressingMethod = (cpu: CPU) => number | void;
type Instruction = {
  name: string;
  methods: { [mode: string]: AddressingMethod };
};
type Opcode = [Instruction, Mode];

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
      const ptr = to16bit(args[0], args[1]);

      const lo = cpu.memory.read(ptr);
      const hi = cpu.memory.read((ptr & 0xff00) | ((ptr + 1) & 0xff));
      cpu.pc = to16bit(lo, hi);

      cpu.delay = 5;
    },
  },
};

const JSR = {
  name: "JSR",
  methods: {
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      cpu.push((cpu.pc + 2) >> 8);
      cpu.push((cpu.pc + 2) & 0xff);
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
      const value = cpu.memory.read(args[0], true);
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

const NOP = {
  name: "NOP",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.pc++;
      cpu.delay = 2;
    },
  },
};

const opcodeMatrix: Record<number, Opcode> = {
  0x01: [ORA, Mode.IndexedIndirect],
  0x05: [ORA, Mode.ZeroPage],
  0x06: [ASL, Mode.ZeroPage],
  0x08: [PHP, Mode.Implied],
  0x09: [ORA, Mode.Immediate],
  0x0a: [ASL, Mode.Accumulator],
  0x0d: [ORA, Mode.Absolute],
  0x0e: [ASL, Mode.Absolute],
  0x10: [BPL, Mode.Relative],
  0x11: [ORA, Mode.IndirectIndexed],
  0x15: [ORA, Mode.ZeroPageX],
  0x16: [ASL, Mode.ZeroPageX],
  0x18: [CLC, Mode.Implied],
  0x19: [ORA, Mode.AbsoluteY],
  0x1d: [ORA, Mode.AbsoluteX],
  0x20: [JSR, Mode.Absolute],
  0x21: [AND, Mode.IndexedIndirect],
  0x24: [BIT, Mode.ZeroPage],
  0x25: [AND, Mode.ZeroPage],
  0x26: [ROL, Mode.ZeroPage],
  0x28: [PLP, Mode.Implied],
  0x29: [AND, Mode.Immediate],
  0x2a: [ROL, Mode.Accumulator],
  0x2c: [BIT, Mode.Absolute],
  0x2d: [AND, Mode.Absolute],
  0x2e: [ROL, Mode.Absolute],
  0x30: [BMI, Mode.Relative],
  0x31: [AND, Mode.IndirectIndexed],
  0x35: [AND, Mode.ZeroPageX],
  0x36: [ROL, Mode.ZeroPageX],
  0x38: [SEC, Mode.Implied],
  0x39: [AND, Mode.AbsoluteY],
  0x3d: [AND, Mode.AbsoluteX],
  0x40: [RTI, Mode.Implied],
  0x41: [EOR, Mode.IndexedIndirect],
  0x45: [EOR, Mode.ZeroPage],
  0x46: [LSR, Mode.ZeroPage],
  0x48: [PHA, Mode.Implied],
  0x49: [EOR, Mode.Immediate],
  0x4a: [LSR, Mode.Accumulator],
  0x4c: [JMP, Mode.Absolute],
  0x4d: [EOR, Mode.Absolute],
  0x4e: [LSR, Mode.Absolute],
  0x50: [BVC, Mode.Relative],
  0x51: [EOR, Mode.IndirectIndexed],
  0x55: [EOR, Mode.ZeroPageX],
  0x56: [LSR, Mode.ZeroPageX],
  0x5d: [EOR, Mode.AbsoluteX],
  0x60: [RTS, Mode.Implied],
  0x61: [ADC, Mode.IndexedIndirect],
  0x65: [ADC, Mode.ZeroPage],
  0x66: [ROR, Mode.ZeroPage],
  0x68: [PLA, Mode.Implied],
  0x69: [ADC, Mode.Immediate],
  0x6a: [ROR, Mode.Accumulator],
  0x6c: [JMP, Mode.Indirect],
  0x6d: [ADC, Mode.Absolute],
  0x6e: [ROR, Mode.Absolute],
  0x70: [BVS, Mode.Relative],
  0x71: [ADC, Mode.IndirectIndexed],
  0x75: [ADC, Mode.ZeroPageX],
  0x76: [ROR, Mode.ZeroPageX],
  0x78: [SEI, Mode.Implied],
  0x79: [ADC, Mode.AbsoluteY],
  0x7d: [ADC, Mode.AbsoluteX],
  0x7e: [ROR, Mode.AbsoluteX],
  0x81: [STA, Mode.IndexedIndirect],
  0x84: [STY, Mode.ZeroPage],
  0x85: [STA, Mode.ZeroPage],
  0x86: [STX, Mode.ZeroPage],
  0x88: [DEY, Mode.Implied],
  0x8a: [TXA, Mode.Implied],
  0x8c: [STY, Mode.Absolute],
  0x8d: [STA, Mode.Absolute],
  0x8e: [STX, Mode.Absolute],
  0x90: [BCC, Mode.Relative],
  0x91: [STA, Mode.IndirectIndexed],
  0x94: [STY, Mode.ZeroPageX],
  0x95: [STA, Mode.ZeroPageX],
  0x96: [STX, Mode.ZeroPageY],
  0x98: [TYA, Mode.Implied],
  0x99: [STA, Mode.AbsoluteY],
  0x9a: [TXS, Mode.Implied],
  0x9d: [STA, Mode.AbsoluteX],
  0xa4: [LDY, Mode.ZeroPage],
  0xa6: [LDX, Mode.ZeroPage],
  0xa8: [TAY, Mode.Implied],
  0xa9: [LDA, Mode.Immediate],
  0xac: [LDY, Mode.Absolute],
  0xad: [LDA, Mode.Absolute],
  0xae: [LDX, Mode.Absolute],
  0xa0: [LDY, Mode.Immediate],
  0xa1: [LDA, Mode.IndexedIndirect],
  0xa2: [LDX, Mode.Immediate],
  0xa5: [LDA, Mode.ZeroPage],
  0xaa: [TAX, Mode.Implied],
  0xb0: [BCS, Mode.Relative],
  0xb1: [LDA, Mode.IndirectIndexed],
  0xb4: [LDY, Mode.ZeroPageX],
  0xb5: [LDA, Mode.ZeroPageX],
  0xb6: [LDX, Mode.ZeroPageY],
  0xb8: [CLV, Mode.Implied],
  0xb9: [LDA, Mode.AbsoluteY],
  0xba: [TSX, Mode.Implied],
  0xbc: [LDY, Mode.AbsoluteX],
  0xbd: [LDA, Mode.AbsoluteX],
  0xbe: [LDX, Mode.AbsoluteY],
  0xc0: [CPY, Mode.Immediate],
  0xc1: [CMP, Mode.IndexedIndirect],
  0xc4: [CPY, Mode.ZeroPage],
  0xc5: [CMP, Mode.ZeroPage],
  0xc6: [DEC, Mode.ZeroPage],
  0xc8: [INY, Mode.Implied],
  0xc9: [CMP, Mode.Immediate],
  0xca: [DEX, Mode.Implied],
  0xcc: [CPY, Mode.Absolute],
  0xcd: [CMP, Mode.Absolute],
  0xce: [DEC, Mode.Absolute],
  0xd0: [BNE, Mode.Relative],
  0xd1: [CMP, Mode.IndirectIndexed],
  0xd5: [CMP, Mode.ZeroPageX],
  0xd6: [DEC, Mode.ZeroPageX],
  0xd8: [CLD, Mode.Implied],
  0xd9: [CMP, Mode.AbsoluteY],
  0xdd: [CMP, Mode.AbsoluteX],
  0xde: [DEC, Mode.AbsoluteX],
  0xe0: [CPX, Mode.Immediate],
  0xe1: [SBC, Mode.IndexedIndirect],
  0xe4: [CPX, Mode.ZeroPage],
  0xe5: [SBC, Mode.ZeroPage],
  0xe6: [INC, Mode.ZeroPage],
  0xe8: [INX, Mode.Implied],
  0xe9: [SBC, Mode.Immediate],
  0xea: [NOP, Mode.Implied],
  0xec: [CPX, Mode.Absolute],
  0xed: [SBC, Mode.Absolute],
  0xee: [INC, Mode.Absolute],
  0xf0: [BEQ, Mode.Relative],
  0xf1: [SBC, Mode.IndirectIndexed],
  0xf5: [SBC, Mode.ZeroPageX],
  0xf6: [INC, Mode.ZeroPageX],
  0xf8: [SED, Mode.Implied],
  0xf9: [SBC, Mode.AbsoluteY],
  0xfd: [SBC, Mode.AbsoluteX],
  0xfe: [INC, Mode.AbsoluteX],
};

export function decode(this: CPU, opcode: number): AddressingMethod | null {
  if (opcode in opcodeMatrix) {
    const [instruction, method] = opcodeMatrix[opcode];
    return instruction.methods[method];
  }
  return null;
}
