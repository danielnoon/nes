import { Mode } from "../addressing";
import CPU from "../cpu";

export const PHA = {
  name: "PHA",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.push(cpu.a);
      cpu.pc += 1;
      cpu.delay = 3;
    },
  },
};

export const PLA = {
  name: "PLA",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.a = cpu.pop();
      cpu.pc += 1;
      cpu.delay = 4;
      cpu.z = cpu.a === 0;
      cpu.n = (cpu.a & 0x80) !== 0;
    },
  },
};

export const PLP = {
  name: "PLP",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.p = cpu.pop();
      cpu.pc += 1;
      cpu.delay = 4;
    },
  },
};

export const PHP = {
  name: "PHP",
  methods: {
    [Mode.Implied](cpu: CPU) {
      cpu.push(cpu.p | 0x30);
      cpu.pc += 1;
      cpu.delay = 3;
    },
  },
};
