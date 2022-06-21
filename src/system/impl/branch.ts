import { signed } from "../../util";
import { Mode } from "../addressing";
import CPU from "../cpu";

export const BNE = {
  name: "BNE",
  methods: {
    [Mode.Relative](cpu: CPU) {
      const args = cpu.args(1);

      if (!cpu.z) {
        cpu.pc += signed(args[0]) + 2;
        cpu.delay = 3;
      } else {
        cpu.pc += 2;
        cpu.delay = 2;
      }
    },
  },
};

export const BMI = {
  name: "BMI",
  methods: {
    [Mode.Relative](cpu: CPU) {
      const args = cpu.args(1);

      if (cpu.n) {
        cpu.pc += signed(args[0]) + 2;
        cpu.delay = 3;
      } else {
        cpu.pc += 2;
        cpu.delay = 2;
      }
    },
  },
};

export const BPL = {
  name: "BPL",
  methods: {
    [Mode.Relative](cpu: CPU) {
      const args = cpu.args(1);

      if (!cpu.n) {
        cpu.pc += signed(args[0]) + 2;
        cpu.delay = 3;
      } else {
        cpu.pc += 2;
        cpu.delay = 2;
      }
    },
  },
};

export const BEQ = {
  name: "BEQ",
  methods: {
    [Mode.Relative](cpu: CPU) {
      const args = cpu.args(1);

      if (cpu.z) {
        cpu.pc += signed(args[0]) + 2;
        cpu.delay = 3;
      } else {
        cpu.pc += 2;
        cpu.delay = 2;
      }
    },
  },
};

export const BCC = {
  name: "BCC",
  methods: {
    [Mode.Relative](cpu: CPU) {
      const args = cpu.args(1);

      if (!cpu.c) {
        cpu.pc += signed(args[0]) + 2;
        cpu.delay = 3;
      } else {
        cpu.pc += 2;
        cpu.delay = 2;
      }
    },
  },
};

export const BCS = {
  name: "BCS",
  methods: {
    [Mode.Relative](cpu: CPU) {
      const args = cpu.args(1);

      if (cpu.c) {
        cpu.pc += signed(args[0]) + 2;
        cpu.delay = 3;
      } else {
        cpu.pc += 2;
        cpu.delay = 2;
      }
    },
  },
};

export const BVC = {
  name: "BVC",
  methods: {
    [Mode.Relative](cpu: CPU) {
      const args = cpu.args(1);

      if (!cpu.v) {
        cpu.pc += signed(args[0]) + 2;
        cpu.delay = 3;
      } else {
        cpu.pc += 2;
        cpu.delay = 2;
      }
    },
  },
};

export const BVS = {
  name: "BVS",
  methods: {
    [Mode.Relative](cpu: CPU) {
      const args = cpu.args(1);

      if (cpu.v) {
        cpu.pc += signed(args[0]) + 2;
        cpu.delay = 3;
      } else {
        cpu.pc += 2;
        cpu.delay = 2;
      }
    },
  },
};
