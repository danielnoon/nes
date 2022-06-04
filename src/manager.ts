import { range } from "itertools";
import { STACK_BASE } from "./const";
import EventBus from "./EventBus";
import { ROM } from "./parse";
import { copyPrgBanks, printFlags } from "./util";

interface Controls {
  pause: HTMLButtonElement;
  file: HTMLInputElement;
  debugView: HTMLDivElement;
  debug: HTMLInputElement;
  stepper: HTMLButtonElement;
  continuer: HTMLButtonElement;
}

//---------
// Control register
// 0x00: running
// 0x01: pause
// 0x02: interrupt (irq, nmi)
//---------

export default class Manager {
  cpuRamRaw = new SharedArrayBuffer(0x10000);
  ppuRamRaw = new SharedArrayBuffer(0x4000);
  cpuRegistersRaw = new SharedArrayBuffer(0x10);
  controlRegistersRaw = new SharedArrayBuffer(0x10);

  cpu = new Uint8Array(this.cpuRamRaw);
  ppu = new Uint8Array(this.ppuRamRaw);
  control = new Uint8Array(this.controlRegistersRaw);
  cpuRegisters = new Uint16Array(this.cpuRegistersRaw);

  worker: Worker;
  bus: EventBus;

  constructor(private controls: Controls) {
    this.worker = new Worker(new URL("./system/bus.ts", import.meta.url), {
      type: "module",
    });

    this.bus = new EventBus(this.worker);

    this.bus.on<string>("log", (message) => {
      console.log(message);
    });

    this.bus.on<{}>("pause", () => {
      console.log("paused");
      this.controls.debugView.innerHTML = `
        <pre><code>
        PC: ${this.cpuRegisters[0].toString(16)}
        SP: ${this.cpuRegisters[1].toString(16)}
        A:  ${this.cpuRegisters[2].toString(16)}
        X:  ${this.cpuRegisters[3].toString(16)}
        Y:  ${this.cpuRegisters[4].toString(16)}
        P:  ${this.cpuRegisters[5].toString(16)}
        Flags: ${printFlags(this.cpuRegisters[5])}
        Stack: ${[
          ...range(STACK_BASE + this.cpuRegisters[1] + 1, STACK_BASE + 0x100),
        ]
          .map((i) => this.cpu[i].toString(16))
          .join(" ")}
        </code></pre>
      `;
    });

    this.controls.stepper.addEventListener("click", () => {
      this.bus.send("step", {});
    });

    this.controls.continuer.addEventListener("click", () => {
      this.bus.send("continue", {});
    });
  }

  async start(romData: ROM) {
    this.controls.pause.addEventListener("click", this.pause);
    console.log("starting rom");
    console.log("copying rom data");

    copyPrgBanks(romData, this.cpuRamRaw);

    console.log("starting worker");

    this.bus.send("start", {
      cpuRam: this.cpuRamRaw,
      ppuRam: this.ppuRamRaw,
      cpuRegisters: this.cpuRegistersRaw,
      controlRegisters: this.controlRegistersRaw,
      debug: this.controls.debug.checked,
    });

    console.log(this.cpu);
  }

  pause = () => {
    Atomics.store(this.control, 1, 1);
  };

  addBreakpoint(address: number) {
    this.bus.send("breakpoint", address);
  }

  dispose() {
    console.log("disposing");
    this.controls.pause.removeEventListener("click", this.pause);
    this.worker.terminate();
  }
}
