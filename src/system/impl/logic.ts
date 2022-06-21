import { Mode, to16bit } from "../addressing";
import CPU from "../cpu";

export const ORA = {
  name: "ORA",
  methods: {
    [Mode.Immediate](cpu: CPU) {
      const args = cpu.args(1);
      cpu.a |= args[0];
      cpu.pc += 2;
      cpu.delay = 2;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      const value = cpu.memory.read(args[0], true);
      cpu.a |= value;
      cpu.pc += 2;
      cpu.delay = 3;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.ZeroPageX](cpu: CPU) {
      const args = cpu.args(1);
      const value = cpu.memory.read(args[0] + cpu.x, true);
      cpu.a |= value;
      cpu.pc += 2;
      cpu.delay = 4;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]));
      cpu.a |= value;
      cpu.pc += 3;
      cpu.delay = 4;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.AbsoluteX](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]) + cpu.x);
      cpu.a |= value;
      cpu.pc += 3;
      cpu.delay = 4;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.AbsoluteY](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]) + cpu.y);
      cpu.a |= value;
      cpu.pc += 3;
      cpu.delay = 4;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.IndexedIndirect](cpu: CPU) {
      const args = cpu.args(1);
      const addr = cpu.memory.read16(args[0] + cpu.x);
      const value = cpu.memory.read(addr);
      cpu.a |= value;
      cpu.pc += 2;
      cpu.delay = 6;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.IndirectIndexed](cpu: CPU) {
      const args = cpu.args(1);
      const addr = cpu.memory.read16(args[0], true);
      const value = cpu.memory.read(addr + cpu.y);
      cpu.a |= value;
      cpu.pc += 2;
      cpu.delay = 5;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
  },
};

export const EOR = {
  name: "EOR",
  methods: {
    [Mode.Immediate](cpu: CPU) {
      const args = cpu.args(1);
      cpu.a ^= args[0];
      cpu.pc += 2;
      cpu.delay = 2;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      const value = cpu.memory.read(args[0], true);
      cpu.a ^= value;
      cpu.pc += 2;
      cpu.delay = 3;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.ZeroPageX](cpu: CPU) {
      const args = cpu.args(1);
      const value = cpu.memory.read(args[0] + cpu.x, true);
      cpu.a ^= value;
      cpu.pc += 2;
      cpu.delay = 4;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]));
      cpu.a ^= value;
      cpu.pc += 3;
      cpu.delay = 4;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.AbsoluteX](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]) + cpu.x);
      cpu.a ^= value;
      cpu.pc += 3;
      cpu.delay = 4;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.AbsoluteY](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]) + cpu.y);
      cpu.a ^= value;
      cpu.pc += 3;
      cpu.delay = 4;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.IndexedIndirect](cpu: CPU) {
      const args = cpu.args(1);
      const addr = cpu.memory.read16(args[0] + cpu.x);
      const value = cpu.memory.read(addr);
      cpu.a ^= value;
      cpu.pc += 2;
      cpu.delay = 6;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.IndirectIndexed](cpu: CPU) {
      const args = cpu.args(1);
      const addr = cpu.memory.read16(args[0], true);
      const value = cpu.memory.read(addr + cpu.y);
      cpu.a ^= value;
      cpu.pc += 2;
      cpu.delay = 5;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
  },
};

export const AND = {
  name: "AND",
  methods: {
    [Mode.Immediate](cpu: CPU) {
      const args = cpu.args(1);
      cpu.a &= args[0];
      cpu.pc += 2;
      cpu.delay = 2;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      const value = cpu.memory.read(args[0], true);
      cpu.a &= value;
      cpu.pc += 2;
      cpu.delay = 3;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.ZeroPageX](cpu: CPU) {
      const args = cpu.args(1);
      const value = cpu.memory.read(args[0] + cpu.x, true);
      cpu.a &= value;
      cpu.pc += 2;
      cpu.delay = 4;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]));
      cpu.a &= value;
      cpu.pc += 3;
      cpu.delay = 4;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.AbsoluteX](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]) + cpu.x);
      cpu.a &= value;
      cpu.pc += 3;
      cpu.delay = 4;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.AbsoluteY](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]) + cpu.y);
      cpu.a &= value;
      cpu.pc += 3;
      cpu.delay = 4;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.IndexedIndirect](cpu: CPU) {
      const args = cpu.args(1);
      const addr = cpu.memory.read16(args[0] + cpu.x);
      const value = cpu.memory.read(addr);
      cpu.a &= value;
      cpu.pc += 2;
      cpu.delay = 6;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.IndirectIndexed](cpu: CPU) {
      const args = cpu.args(1);
      const addr = cpu.memory.read16(args[0], true);
      const value = cpu.memory.read(addr + cpu.y);
      cpu.a &= value;
      cpu.pc += 2;
      cpu.delay = 5;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
  },
};

export const CMP = {
  name: "CMP",
  methods: {
    [Mode.Immediate](cpu: CPU) {
      const args = cpu.args(1);
      const value = args[0];
      const result = cpu.a - value;
      cpu.pc += 2;
      cpu.delay = 2;
      cpu.z = result === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = cpu.a >= value;
    },
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      const value = cpu.memory.read(args[0], true);
      const result = cpu.a - value;
      cpu.pc += 2;
      cpu.delay = 3;
      cpu.z = result === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = cpu.a >= value;
    },
    [Mode.ZeroPageX](cpu: CPU) {
      const args = cpu.args(1);
      const value = cpu.memory.read(args[0] + cpu.x, true);
      const result = cpu.a - value;
      cpu.pc += 2;
      cpu.delay = 4;
      cpu.z = result === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = cpu.a >= value;
    },
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]));
      const result = cpu.a - value;
      cpu.pc += 3;
      cpu.delay = 4;
      cpu.z = result === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = cpu.a >= value;
    },
    [Mode.AbsoluteX](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]) + cpu.x);
      const result = cpu.a - value;
      cpu.pc += 3;
      cpu.delay = 4;
      cpu.z = result === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = cpu.a >= value;
    },
    [Mode.AbsoluteY](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]) + cpu.y);
      const result = cpu.a - value;
      cpu.pc += 3;
      cpu.delay = 4;
      cpu.z = result === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = cpu.a >= value;
    },
    [Mode.IndexedIndirect](cpu: CPU) {
      const args = cpu.args(1);
      const addr = cpu.memory.read16(args[0] + cpu.x);
      const value = cpu.memory.read(addr);
      const result = cpu.a - value;
      cpu.pc += 2;
      cpu.delay = 6;
      cpu.z = result === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = cpu.a >= value;
    },
    [Mode.IndirectIndexed](cpu: CPU) {
      const args = cpu.args(1);
      const addr = cpu.memory.read16(args[0], true);
      const value = cpu.memory.read(addr + cpu.y);
      const result = cpu.a - value;
      cpu.pc += 2;
      cpu.delay = 5;
      cpu.z = result === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = cpu.a >= value;
    },
  },
};

export const CPX = {
  name: "CPX",
  methods: {
    [Mode.Immediate](cpu: CPU) {
      const args = cpu.args(1);
      const value = args[0];
      const result = cpu.x - value;
      cpu.pc += 2;
      cpu.delay = 2;
      cpu.z = result === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = cpu.x >= value;
    },
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      const value = cpu.memory.read(args[0], true);
      const result = cpu.x - value;
      cpu.pc += 2;
      cpu.delay = 3;
      cpu.z = result === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = cpu.x >= value;
    },
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]));
      const result = cpu.x - value;
      cpu.pc += 3;
      cpu.delay = 4;
      cpu.z = result === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = cpu.x >= value;
    },
  },
};

export const CPY = {
  name: "CPY",
  methods: {
    [Mode.Immediate](cpu: CPU) {
      const args = cpu.args(1);
      const value = args[0];
      const result = cpu.y - value;
      cpu.pc += 2;
      cpu.delay = 2;
      cpu.z = result === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = cpu.y >= value;
    },
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      const value = cpu.memory.read(args[0], true);
      const result = cpu.y - value;
      cpu.pc += 2;
      cpu.delay = 3;
      cpu.z = result === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = cpu.y >= value;
    },
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]));
      const result = cpu.y - value;
      cpu.pc += 3;
      cpu.delay = 4;
      cpu.z = result === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = cpu.y >= value;
    },
  },
};
