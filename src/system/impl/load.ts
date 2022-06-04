import { Mode, to16bit } from "../addressing";
import CPU from "../cpu";

export const LDA = {
  name: "LDA",
  methods: {
    [Mode.Immediate](cpu: CPU) {
      const args = cpu.args(1);
      cpu.a = args[0];
      cpu.pc += 2;
      cpu.delay = 2;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      cpu.a = cpu.memory.read(to16bit(args[0], args[1]));
      cpu.pc += 3;
      cpu.delay = 4;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      cpu.a = cpu.memory.read(args[0]);
      cpu.pc += 2;
      cpu.delay = 3;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.ZeroPageX](cpu: CPU) {
      const args = cpu.args(1);
      cpu.a = cpu.memory.read(args[0] + cpu.x);
      cpu.pc += 2;
      cpu.delay = 4;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.ZeroPageY](cpu: CPU) {
      const args = cpu.args(1);
      cpu.a = cpu.memory.read(args[0] + cpu.y);
      cpu.pc += 2;
      cpu.delay = 4;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.AbsoluteX](cpu: CPU) {
      const args = cpu.args(2);
      cpu.a = cpu.memory.read(to16bit(args[0], args[1]) + cpu.x);
      cpu.pc += 3;
      cpu.delay = 4;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.AbsoluteY](cpu: CPU) {
      const args = cpu.args(2);
      cpu.a = cpu.memory.read(to16bit(args[0], args[1]) + cpu.y);
      cpu.pc += 3;
      cpu.delay = 4;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
    [Mode.IndirectIndexed](cpu: CPU) {
      const args = cpu.args(1);
      const low = cpu.memory.read(args[0]);
      const high = cpu.memory.read(args[0] + 1);
      const addr = to16bit(low, high);

      cpu.a = cpu.memory.read(addr + cpu.y);
      cpu.pc += 2;
      cpu.delay = 6;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
  },
};

export const LDX = {
  name: "LDX",
  methods: {
    [Mode.Immediate](cpu: CPU) {
      const args = cpu.args(1);
      cpu.x = args[0];
      cpu.pc += 2;
      cpu.delay = 2;
      cpu.z = cpu.x === 0;
      cpu.n = (cpu.x & 0x80) !== 0;
    },
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      cpu.x = cpu.memory.read(to16bit(args[0], args[1]));
      cpu.pc += 3;
      cpu.delay = 4;
      cpu.z = cpu.x === 0;
      cpu.n = (cpu.x & 0x80) !== 0;
    },
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      cpu.x = cpu.memory.read(args[0]);
      cpu.pc += 2;
      cpu.delay = 3;
      cpu.z = cpu.x === 0;
      cpu.n = (cpu.x & 0x80) !== 0;
    },
  },
};

export const LDY = {
  name: "LDY",
  methods: {
    [Mode.Immediate](cpu: CPU) {
      const args = cpu.args(1);
      cpu.y = args[0];
      cpu.pc += 2;
      cpu.delay = 2;
      cpu.z = cpu.y === 0;
      cpu.n = (cpu.y & 0x80) !== 0;
    },
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      cpu.y = cpu.memory.read(to16bit(args[0], args[1]));
      cpu.pc += 3;
      cpu.delay = 4;
      cpu.z = cpu.y === 0;
      cpu.n = (cpu.y & 0x80) !== 0;
    },
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      cpu.y = cpu.memory.read(args[0]);
      cpu.pc += 2;
      cpu.delay = 3;
      cpu.z = cpu.y === 0;
      cpu.n = (cpu.y & 0x80) !== 0;
    },
  },
};
