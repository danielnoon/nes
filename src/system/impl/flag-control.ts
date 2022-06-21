import { Mode } from "../addressing";
import CPU from "../cpu";

export const SEI = {
  name: "SEI",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.i = true;
      cpu.pc += 1;
      cpu.delay = 2;
    },
  },
};

export const SED = {
  name: "SED",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.d = true;
      cpu.pc += 1;
      cpu.delay = 2;
    },
  },
};

export const CLD = {
  name: "CLD",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.d = false;
      cpu.pc += 1;
      cpu.delay = 2;
    },
  },
};

export const SEC = {
  name: "SEC",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.c = true;
      cpu.pc += 1;
      cpu.delay = 2;
    },
  },
};

export const CLC = {
  name: "CLC",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.c = false;
      cpu.pc += 1;
      cpu.delay = 2;
    },
  },
};

export const CLV = {
  name: "CLV",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.v = false;
      cpu.pc += 1;
      cpu.delay = 2;
    },
  },
};
