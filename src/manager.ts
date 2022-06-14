import { range } from "itertools";
import { OAM_SIZE, SECONDARY_OAM_SIZE, STACK_BASE } from "./const";
import EventBus from "./EventBus";
import { ROM } from "./parse";
import { Renderer } from "./renderer";
import { copyChrBanks, copyPrgBanks, printFlags } from "./util";

interface Controls {
  pause: HTMLButtonElement;
  file: HTMLInputElement;
  debugView: HTMLDivElement;
  debug: HTMLInputElement;
  stepper: HTMLButtonElement;
  continuer: HTMLButtonElement;
  screen: HTMLCanvasElement;
}

//---------
// Control register
// 0x00: running
// 0x01: pause
// 0x02: interrupt (irq, nmi)
//---------

export default class Manager {
  cpuRamRaw = new SharedArrayBuffer(0x10000);
  ppuRamRaw = new SharedArrayBuffer(0x4000 + OAM_SIZE + SECONDARY_OAM_SIZE);
  cpuRegistersRaw = new SharedArrayBuffer(0x10);
  controlRegistersRaw = new SharedArrayBuffer(0x10);
  framebufferRaw = new SharedArrayBuffer(0xf000 * 4);

  cpu = new Uint8Array(this.cpuRamRaw);
  ppu = new Uint8Array(this.ppuRamRaw);
  control = new Uint8Array(this.controlRegistersRaw);
  cpuRegisters = new Uint16Array(this.cpuRegistersRaw);
  framebuffer = new Uint32Array(this.framebufferRaw);

  worker: Worker;
  bus: EventBus;
  renderer: Renderer;

  constructor(private controls: Controls) {
    this.worker = new Worker(new URL("./system/bus.ts", import.meta.url), {
      type: "module",
    });

    this.renderer = new Renderer(
      this.controls.screen.getContext("2d")!,
      this.framebuffer
    );

    this.bus = new EventBus(this.worker);

    this.bus.on<string>("log", (message) => {
      console.log(message);
    });

    this.bus.on("frame", () => {
      this.renderer.render();
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
  }

  async start(romData: ROM) {
    this.controls.pause.addEventListener("click", this.pause);
    console.log("starting rom");
    console.log("copying rom data");

    copyPrgBanks(romData, this.cpuRamRaw);
    copyChrBanks(romData, this.ppuRamRaw);

    console.log("starting worker");

    this.bus.send("start", {
      cpuRam: this.cpuRamRaw,
      ppuRam: this.ppuRamRaw,
      cpuRegisters: this.cpuRegistersRaw,
      controlRegisters: this.controlRegistersRaw,
      debug: this.controls.debug.checked,
      framebuffer: this.framebufferRaw,
    });

    console.log(this.cpu);
    console.log(this.ppu);
  }

  pause = () => {
    Atomics.store(this.control, 1, 1);
  };

  step() {
    this.bus.send("step", {});
  }

  continue() {
    this.bus.send("continue", {});
  }

  addBreakpoint(address: number) {
    this.bus.send("breakpoint", address);
  }

  dispose() {
    console.log("disposing");
    this.controls.pause.removeEventListener("click", this.pause);
    this.worker.terminate();
  }
}
