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
      const value = cpu.memory.read(args[0]);
      cpu.a |= value;
      cpu.pc += 2;
      cpu.delay = 3;
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
      const value = cpu.memory.read(args[0]);
      cpu.a ^= value;
      cpu.pc += 2;
      cpu.delay = 3;
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
  },
};
