import { Mode, to16bit } from "../addressing";
import CPU from "../cpu";

export const LSR = {
  name: "LSR",
  methods: {
    [Mode.Accumulator](cpu: CPU) {
      cpu.c = (cpu.a & 1) !== 0;
      cpu.a = (cpu.a >> 1) & 0x7f;
      cpu.pc += 1;
      cpu.delay = 2;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      const original = cpu.memory.read(args[0]);

      cpu.c = (original & 1) !== 0;
      const value = (original >> 1) & 0x7f;
      cpu.memory.write(args[0], value);

      cpu.pc += 2;
      cpu.delay = 5;
      cpu.z = value === 0;
      cpu.n = (value & 0x80) !== 0;
    },
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      const original = cpu.memory.read(to16bit(args[0], args[1]));

      cpu.c = (original & 1) !== 0;
      const value = (original >> 1) & 0x7f;
      cpu.memory.write(to16bit(args[0], args[1]), value);

      cpu.pc += 3;
      cpu.delay = 6;
      cpu.z = value === 0;
      cpu.n = (value & 0x80) !== 0;
    },
  },
};

export const ASL = {
  name: "ASL",
  methods: {
    [Mode.Accumulator](cpu: CPU) {
      const original = cpu.a;
      cpu.c = (original & 0x80) !== 0;
      cpu.a = (original << 1) & 0xff;
      cpu.pc += 1;
      cpu.delay = 2;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      const original = cpu.memory.read(args[0]);

      cpu.c = (original & 0x80) !== 0;
      const value = (original << 1) & 0xff;
      cpu.memory.write(args[0], value);

      cpu.pc += 2;
      cpu.delay = 5;
      cpu.z = value === 0;
      cpu.n = (value & 0x80) !== 0;
    },
  },
};

export const ROR = {
  name: "ROR",
  methods: {
    [Mode.Accumulator](cpu: CPU) {
      const original = cpu.a;
      cpu.c = (original & 1) !== 0;
      cpu.a = (original >> 1) | (cpu.c ? 0x80 : 0);
      cpu.pc += 1;
      cpu.delay = 2;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      const original = cpu.memory.read(args[0]);

      cpu.c = (original & 1) !== 0;
      const value = (original >> 1) | (cpu.c ? 0x80 : 0);
      cpu.memory.write(args[0], value);

      cpu.pc += 2;
      cpu.delay = 6;
      cpu.z = value === 0;
      cpu.n = (value & 0x80) !== 0;
    },
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      const original = cpu.memory.read(to16bit(args[0], args[1]));

      cpu.c = (original & 1) !== 0;
      const value = (original >> 1) | (cpu.c ? 0x80 : 0);
      cpu.memory.write(to16bit(args[0], args[1]), value);

      cpu.pc += 3;
      cpu.delay = 7;
      cpu.z = value === 0;
      cpu.n = (value & 0x80) !== 0;
    },
  },
};

export const ROL = {
  name: "ROL",
  methods: {
    [Mode.Accumulator](cpu: CPU) {
      const original = cpu.a;
      cpu.c = (original & 0x80) !== 0;
      cpu.a = (original << 1) | (cpu.c ? 1 : 0);
      cpu.pc += 1;
      cpu.delay = 2;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      const original = cpu.memory.read(args[0]);

      cpu.c = (original & 0x80) !== 0;
      const value = (original << 1) | (cpu.c ? 1 : 0);
      cpu.memory.write(args[0], value);

      cpu.pc += 2;
      cpu.delay = 6;
      cpu.z = value === 0;
      cpu.n = (value & 0x80) !== 0;
    },
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      const original = cpu.memory.read(to16bit(args[0], args[1]));

      cpu.c = (original & 0x80) !== 0;
      const value = (original << 1) | (cpu.c ? 1 : 0);
      cpu.memory.write(to16bit(args[0], args[1]), value);

      cpu.pc += 3;
      cpu.delay = 7;
      cpu.z = value === 0;
      cpu.n = (value & 0x80) !== 0;
    },
  },
};
