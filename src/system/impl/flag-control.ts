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
