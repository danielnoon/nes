import { Mode, to16bit } from "../addressing";
import CPU from "../cpu";

export const STA = {
  name: "STA",
  methods: {
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      cpu.memory.write(to16bit(args[0], args[1]), cpu.a);
      cpu.pc += 3;
      cpu.delay = 4;
    },
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      cpu.memory.write(args[0], cpu.a, true);
      cpu.pc += 2;
      cpu.delay = 3;
    },
    [Mode.ZeroPageX](cpu: CPU) {
      const args = cpu.args(1);
      cpu.memory.write(args[0] + cpu.x, cpu.a, true);
      cpu.pc += 2;
      cpu.delay = 4;
    },
    [Mode.AbsoluteX](cpu: CPU) {
      const args = cpu.args(2);
      cpu.memory.write(to16bit(args[0], args[1]) + cpu.x, cpu.a);
      cpu.pc += 3;
      cpu.delay = 5;
    },
    [Mode.AbsoluteY](cpu: CPU) {
      const args = cpu.args(2);
      cpu.memory.write(to16bit(args[0], args[1]) + cpu.y, cpu.a);
      cpu.pc += 3;
      cpu.delay = 5;
    },
    [Mode.IndirectIndexed](cpu: CPU) {
      const args = cpu.args(1);
      const addr = cpu.memory.read16(args[0]);
      cpu.memory.write(addr + cpu.y, cpu.a);
      cpu.pc += 2;
      cpu.delay = 6;
    },
    [Mode.IndexedIndirect](cpu: CPU) {
      const args = cpu.args(1);
      const addr = cpu.memory.read16(args[0] + cpu.x, true);
      cpu.memory.write(addr, cpu.a);
      cpu.pc += 2;
      cpu.delay = 5;
    },
  },
};

export const STX = {
  name: "STX",
  methods: {
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      cpu.memory.write(args[0], cpu.x, true);
      cpu.pc += 2;
      cpu.delay = 3;
    },
    [Mode.ZeroPageY](cpu: CPU) {
      const args = cpu.args(1);
      cpu.memory.write(args[0] + cpu.y, cpu.x, true);
      cpu.pc += 2;
      cpu.delay = 4;
    },
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      cpu.memory.write(to16bit(args[0], args[1]), cpu.x);
      cpu.pc += 3;
      cpu.delay = 4;
    },
  },
};

export const STY = {
  name: "STY",
  methods: {
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      cpu.memory.write(args[0], cpu.y, true);
      cpu.pc += 2;
      cpu.delay = 3;
    },
    [Mode.ZeroPageX](cpu: CPU) {
      const args = cpu.args(1);
      cpu.memory.write(args[0] + cpu.x, cpu.y, true);
      cpu.pc += 2;
      cpu.delay = 4;
    },
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      cpu.memory.write(to16bit(args[0], args[1]), cpu.y);
      cpu.pc += 3;
      cpu.delay = 4;
    },
  },
};
