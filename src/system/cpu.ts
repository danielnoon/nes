import { MASK, RESET_VECTOR, STACK_BASE } from "../const";
import Controller from "../controller";
import EventBus from "../EventBus";
import { decode } from "./instructions";
import { Mapper } from "./mapper";

export default class CPU {
  delay = 0;
  breakpoints = new Set<number>();
  nmi = false;
  history = [] as number[];

  constructor(
    public memory: Mapper,
    private registers: Uint16Array,
    private controller: Controller,
    private bus: EventBus
  ) {
    this.pc = this.memory.read16(RESET_VECTOR);

    this.sp = 0xfd;

    this.bus.on("breakpoint", (address: number) => {
      this.breakpoints.add(address);
    });

    this.bus.on("nmi", () => {
      this.nmi = true;
    });
  }

  //#region Registers

  //#region Program Counter
  get pc() {
    return this.registers[0];
  }

  set pc(value: number) {
    Atomics.store(this.registers, 0, value);
  }
  //#endregion

  //#region Stack Pointer
  get sp() {
    return this.registers[1];
  }

  set sp(value: number) {
    Atomics.store(this.registers, 1, value);
  }
  //#endregion

  //#region A Register
  get a() {
    return this.registers[2];
  }

  set a(value: number) {
    Atomics.store(this.registers, 2, value & 0xff);
  }
  //#endregion

  //#region X Register
  get x() {
    return this.registers[3];
  }

  set x(value: number) {
    Atomics.store(this.registers, 3, value & 0xff);
  }
  //#endregion

  //#region Y Register
  get y() {
    return this.registers[4];
  }

  set y(value: number) {
    Atomics.store(this.registers, 4, value & 0xff);
  }
  //#endregion

  //#region Program Status
  get p() {
    return this.registers[5];
  }

  set p(value: number) {
    Atomics.store(this.registers, 5, value & ~(MASK.b | MASK.r));
  }
  //#endregion

  //#endregion

  //#region Flags
  get n() {
    return !!(this.p & MASK.n);
  }

  set n(value: boolean) {
    this.p = (this.p & ~MASK.n) | (value ? MASK.n : 0);
  }

  get v() {
    return !!(this.p & MASK.v);
  }

  set v(value: boolean) {
    this.p = (this.p & ~MASK.v) | (value ? MASK.v : 0);
  }

  get b() {
    return !!(this.p & MASK.b);
  }

  set b(value: boolean) {
    this.p = (this.p & ~MASK.b) | (value ? MASK.b : 0);
  }

  get d() {
    return !!(this.p & MASK.d);
  }

  set d(value: boolean) {
    this.p = (this.p & ~MASK.d) | (value ? MASK.d : 0);
  }

  get i() {
    return !!(this.p & MASK.i);
  }

  set i(value: boolean) {
    this.p = (this.p & ~MASK.i) | (value ? MASK.i : 0);
  }

  get z() {
    return !!(this.p & MASK.z);
  }

  set z(value: boolean) {
    this.p = (this.p & ~MASK.z) | (value ? MASK.z : 0);
  }

  get c() {
    return !!(this.p & MASK.c);
  }

  set c(value: boolean) {
    this.p = (this.p & ~MASK.c) | (value ? MASK.c : 0);
  }
  //#endregion

  push(value: number) {
    this.memory.write(this.sp + STACK_BASE, value);
    this.sp = (this.sp - 1) & 0xff;
  }

  pop() {
    this.sp = (this.sp + 1) & 0xff;
    return this.memory.read(this.sp + STACK_BASE);
  }

  args(n: number) {
    const args = [];
    for (let i = 0; i < n; i++) {
      args.push(this.memory.read(this.pc + i + 1));
    }
    return args;
  }

  cycle() {
    if (this.breakpoints.has(this.pc) && !this.controller.sbgContinue) {
      this.controller.pause();
      return;
    }

    if (this.controller.sbgContinue) {
      this.controller.sbgContinue = false;
    }

    if (this.delay > 0) {
      this.delay--;
      return;
    }

    if (this.nmi) {
      this.nmi = false;
      this.push(this.pc >> 8);
      this.push(this.pc & 0xff);
      this.push(this.p | MASK.b);
      this.p |= MASK.b;
      this.pc = this.memory.read16(0xfffa);
    }

    this.history.push(this.pc);

    const opcode = this.memory.read(this.pc);

    const execute = decode.apply(this, [opcode]);

    if (execute === null) {
      console.error(`Unknown opcode: ${opcode.toString(16)}`);
      console.log(
        this.history
          .slice(-20)
          .reverse()
          .map((x) => x.toString(16).padStart(4, "0"))
      );
      this.controller.pause();
      return;
    }

    try {
      execute(this);
    } catch (e) {
      console.error(e);
      this.controller.pause();
    }
  }
}
