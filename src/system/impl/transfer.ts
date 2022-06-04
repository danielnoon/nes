import { Mode } from "../addressing";
import CPU from "../cpu";

export const TAX = {
  name: "TAX",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.x = cpu.a;
      cpu.pc += 1;
      cpu.delay = 2;
      cpu.z = cpu.x === 0;
      cpu.n = (cpu.x & 0x80) !== 0;
    },
  },
};

export const TXS = {
  name: "TXS",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.sp = cpu.x;
      cpu.pc += 1;
      cpu.delay = 2;
    },
  },
};

export const TSX = {
  name: "TSX",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.x = cpu.sp;
      cpu.pc += 1;
      cpu.delay = 2;
      cpu.z = cpu.x === 0;
      cpu.n = (cpu.x & 0x80) !== 0;
    },
  },
};

export const TXA = {
  name: "TXA",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.a = cpu.x;
      cpu.pc += 1;
      cpu.delay = 2;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
  },
};

export const TYA = {
  name: "TYA",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.a = cpu.y;
      cpu.pc += 1;
      cpu.delay = 2;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
  },
};

export const TAY = {
  name: "TAY",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.y = cpu.a;
      cpu.pc += 1;
      cpu.delay = 2;
      cpu.z = cpu.y === 0;
      cpu.n = (cpu.y & 0x80) !== 0;
    },
  },
};
