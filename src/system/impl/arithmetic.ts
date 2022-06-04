import { Mode } from "../addressing";
import CPU from "../cpu";

export const ADC = {
  name: "ADC",
  methods: {
    [Mode.Immediate](cpu: CPU) {
      const args = cpu.args(1);
      const value = args[0];
      const result = cpu.a + value + (cpu.c ? 1 : 0);

      cpu.pc += 2;
      cpu.delay = 2;

      cpu.z = result === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & 0x80) === 0 && ((cpu.a ^ result) & 0x80) !== 0;

      cpu.a = result & 0xff;
    },
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      const value = cpu.memory.read(args[0]);
      const result = cpu.a + value + (cpu.c ? 1 : 0);

      cpu.pc += 2;
      cpu.delay = 3;

      cpu.z = result === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & 0x80) === 0 && ((cpu.a ^ result) & 0x80) !== 0;

      cpu.a = result & 0xff;
    },
  },
};
