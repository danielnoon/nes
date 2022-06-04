import { Mode } from "../addressing";
import CPU from "../cpu";

export const INX = {
  name: "INX",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.x += 1;
      cpu.pc += 1;
      cpu.delay = 2;
      cpu.z = cpu.x === 0;
      cpu.n = (cpu.x & 0x80) !== 0;
    },
  },
};

export const INY = {
  name: "INY",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.y += 1;
      cpu.pc += 1;
      cpu.delay = 2;
      cpu.z = cpu.y === 0;
      cpu.n = (cpu.y & 0x80) !== 0;
    },
  },
};

export const DEX = {
  name: "DEX",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.x -= 1;
      cpu.pc += 1;
      cpu.delay = 2;
      cpu.z = cpu.x === 0;
      cpu.n = (cpu.x & 0x80) !== 0;
    },
  },
};

export const DEY = {
  name: "DEY",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.y -= 1;
      cpu.pc += 1;
      cpu.delay = 2;
      cpu.z = cpu.y === 0;
      cpu.n = (cpu.y & 0x80) !== 0;
    },
  },
};

export const INC = {
  name: "INC",
  methods: {
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      const value = (cpu.memory.read(args[0]) + 1) & 0xff;
      cpu.memory.write(args[0], value);
      cpu.pc += 2;
      cpu.delay = 5;
      cpu.z = value === 0;
      cpu.n = (value & 0x80) !== 0;
    },
  },
};
