import { unsigned } from "../../util";
import { Mode, to16bit } from "../addressing";
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

      cpu.z = (result & 0xff) === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & 0x80) === 0 && ((cpu.a ^ result) & 0x80) !== 0;

      cpu.a = result & 0xff;
    },
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      const value = cpu.memory.read(args[0], true);
      const result = cpu.a + value + (cpu.c ? 1 : 0);

      cpu.pc += 2;
      cpu.delay = 3;

      cpu.z = (result & 0xff) === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & 0x80) === 0 && ((cpu.a ^ result) & 0x80) !== 0;

      cpu.a = result & 0xff;
    },
    [Mode.ZeroPageX](cpu: CPU) {
      const args = cpu.args(1);
      const value = cpu.memory.read(args[0] + cpu.x, true);
      const result = cpu.a + value + (cpu.c ? 1 : 0);

      cpu.pc += 2;
      cpu.delay = 4;

      cpu.z = (result & 0xff) === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & 0x80) === 0 && ((cpu.a ^ result) & 0x80) !== 0;

      cpu.a = result & 0xff;
    },
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]));
      const result = cpu.a + value + (cpu.c ? 1 : 0);

      cpu.pc += 3;
      cpu.delay = 4;

      cpu.z = (result & 0xff) === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & 0x80) === 0 && ((cpu.a ^ result) & 0x80) !== 0;

      cpu.a = result & 0xff;
    },
    [Mode.AbsoluteX](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]) + cpu.x);
      const result = cpu.a + value + (cpu.c ? 1 : 0);

      cpu.pc += 3;
      cpu.delay = 4;

      cpu.z = (result & 0xff) === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & 0x80) === 0 && ((cpu.a ^ result) & 0x80) !== 0;

      cpu.a = result & 0xff;
    },
    [Mode.AbsoluteY](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]) + cpu.y);
      const result = cpu.a + value + (cpu.c ? 1 : 0);

      cpu.pc += 3;
      cpu.delay = 4;

      cpu.z = (result & 0xff) === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & 0x80) === 0 && ((cpu.a ^ result) & 0x80) !== 0;

      cpu.a = result & 0xff;
    },
    [Mode.IndexedIndirect](cpu: CPU) {
      const args = cpu.args(1);
      const addr = cpu.memory.read16(args[0] + cpu.x);
      const value = cpu.memory.read(addr);
      const result = cpu.a + value + (cpu.c ? 1 : 0);

      cpu.pc += 2;
      cpu.delay = 6;

      cpu.z = (result & 0xff) === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & 0x80) === 0 && ((cpu.a ^ result) & 0x80) !== 0;

      cpu.a = result & 0xff;
    },
    [Mode.IndirectIndexed](cpu: CPU) {
      const args = cpu.args(1);
      const addr = cpu.memory.read16(args[0], true);
      const value = cpu.memory.read(addr + cpu.y);
      const result = cpu.a + value + (cpu.c ? 1 : 0);

      cpu.pc += 2;
      cpu.delay = 5;

      cpu.z = (result & 0xff) === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & 0x80) === 0 && ((cpu.a ^ result) & 0x80) !== 0;

      cpu.a = result & 0xff;
    },
  },
};

export const SBC = {
  name: "SBC",
  methods: {
    [Mode.Immediate](cpu: CPU) {
      const args = cpu.args(1);
      const value = args[0];
      const carry = cpu.c ? 1 : 0;
      const operand = 255 - value;
      const result = cpu.a + operand + carry;

      cpu.pc += 2;
      cpu.delay = 2;

      cpu.z = (result & 0xff) === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & (operand ^ result) & 0x80) !== 0;

      cpu.a = unsigned(result) & 0xff;
    },
    [Mode.ZeroPage](cpu: CPU) {
      const args = cpu.args(1);
      const value = cpu.memory.read(args[0], true);
      const carry = cpu.c ? 1 : 0;
      const operand = 255 - value;
      const result = cpu.a + operand + carry;

      cpu.pc += 2;
      cpu.delay = 2;

      cpu.z = (result & 0xff) === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & (operand ^ result) & 0x80) !== 0;

      cpu.a = unsigned(result) & 0xff;
    },
    [Mode.ZeroPageX](cpu: CPU) {
      const args = cpu.args(1);
      const value = cpu.memory.read(args[0] + cpu.x, true);
      const carry = cpu.c ? 1 : 0;
      const operand = 255 - value;
      const result = cpu.a + operand + carry;

      cpu.pc += 2;
      cpu.delay = 2;

      cpu.z = (result & 0xff) === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & (operand ^ result) & 0x80) !== 0;

      cpu.a = unsigned(result) & 0xff;
    },
    [Mode.ZeroPageY](cpu: CPU) {
      const args = cpu.args(1);
      const value = cpu.memory.read(args[0] + cpu.y, true);
      const carry = cpu.c ? 1 : 0;
      const operand = 255 - value;
      const result = cpu.a + operand + carry;

      cpu.pc += 2;
      cpu.delay = 2;

      cpu.z = (result & 0xff) === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & (operand ^ result) & 0x80) !== 0;

      cpu.a = unsigned(result) & 0xff;
    },
    [Mode.Absolute](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]));
      const carry = cpu.c ? 1 : 0;
      const operand = 255 - value;
      const result = cpu.a + operand + carry;

      cpu.pc += 3;
      cpu.delay = 2;

      cpu.z = (result & 0xff) === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & (operand ^ result) & 0x80) !== 0;

      cpu.a = unsigned(result) & 0xff;
    },
    [Mode.AbsoluteX](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]) + cpu.x);
      const carry = cpu.c ? 1 : 0;
      const operand = 255 - value;
      const result = cpu.a + operand + carry;

      cpu.pc += 3;
      cpu.delay = 2;

      cpu.z = (result & 0xff) === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & (operand ^ result) & 0x80) !== 0;

      cpu.a = unsigned(result) & 0xff;
    },
    [Mode.AbsoluteY](cpu: CPU) {
      const args = cpu.args(2);
      const value = cpu.memory.read(to16bit(args[0], args[1]) + cpu.y);
      const carry = cpu.c ? 1 : 0;
      const operand = 255 - value;
      const result = cpu.a + operand + carry;

      cpu.pc += 3;
      cpu.delay = 2;

      cpu.z = (result & 0xff) === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & (operand ^ result) & 0x80) !== 0;

      cpu.a = unsigned(result) & 0xff;
    },
    [Mode.IndirectX](cpu: CPU) {
      const args = cpu.args(1);
      const value = cpu.memory.read(args[0] + cpu.x);
      const carry = cpu.c ? 1 : 0;
      const operand = 255 - value;
      const result = cpu.a + operand + carry;

      cpu.pc += 2;
      cpu.delay = 2;

      cpu.z = (result & 0xff) === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & (operand ^ result) & 0x80) !== 0;

      cpu.a = unsigned(result) & 0xff;
    },
    [Mode.IndirectY](cpu: CPU) {
      const args = cpu.args(1);
      const value = cpu.memory.read(args[0]) + cpu.y;
      const carry = cpu.c ? 1 : 0;
      const operand = 255 - value;
      const result = cpu.a + operand + carry;

      cpu.pc += 2;
      cpu.delay = 2;

      cpu.z = (result & 0xff) === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & (operand ^ result) & 0x80) !== 0;

      cpu.a = unsigned(result) & 0xff;
    },
    [Mode.IndexedIndirect](cpu: CPU) {
      const args = cpu.args(1);
      const addr = cpu.memory.read16(args[0] + cpu.x);
      const value = cpu.memory.read(addr);
      const carry = cpu.c ? 1 : 0;
      const operand = 255 - value;
      const result = cpu.a + operand + carry;

      cpu.pc += 2;
      cpu.delay = 2;

      cpu.z = (result & 0xff) === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & (operand ^ result) & 0x80) !== 0;

      cpu.a = unsigned(result) & 0xff;
    },
    [Mode.IndirectIndexed](cpu: CPU) {
      const args = cpu.args(1);
      const addr = cpu.memory.read16(args[0], true);
      const value = cpu.memory.read(addr + cpu.y);
      const carry = cpu.c ? 1 : 0;
      const operand = 255 - value;
      const result = cpu.a + operand + carry;

      cpu.pc += 2;
      cpu.delay = 2;

      cpu.z = (result & 0xff) === 0;
      cpu.n = (result & 0x80) !== 0;
      cpu.c = result > 0xff;
      cpu.v = ((cpu.a ^ value) & (operand ^ result) & 0x80) !== 0;

      cpu.a = unsigned(result) & 0xff;
    },
  },
};
