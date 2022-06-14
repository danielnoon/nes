import Controller from "../controller";
import EventBus from "../EventBus";
import Clock from "./clock";
import CPU from "./cpu";
import { Mapper0 } from "./mapper";
import PPU from "./ppu";

const bus = new EventBus(self);

interface StartData {
  cpuRam: SharedArrayBuffer;
  ppuRam: SharedArrayBuffer;
  cpuRegisters: SharedArrayBuffer;
  controlRegisters: SharedArrayBuffer;
  framebuffer: SharedArrayBuffer;
  debug: boolean;
}

bus.on<StartData>(
  "start",
  ({ controlRegisters, cpuRam, cpuRegisters, ppuRam, framebuffer, debug }) => {
    const controller = new Controller(new Uint8Array(controlRegisters), bus);

    const clock = new Clock(controller);

    clock.addHook((cycle) => {
      if (cycle % 10000000 === 0) {
        console.log(cycle);
      }
    });

    const ppu = new PPU(
      new Uint8Array(ppuRam),
      bus,
      new Uint32Array(framebuffer)
    );

    const mapper = new Mapper0(new Uint8Array(cpuRam), ppu, bus);

    const cpu = new CPU(mapper, new Uint16Array(cpuRegisters), controller, bus);

    clock.addHook(cpu.cycle.bind(cpu));
    clock.addHook(ppu.realCycle.bind(ppu));

    if (!debug) {
      clock.start();
    }

    bus.on("step", () => {
      controller.sbgContinue = true;
      clock.step();
      bus.send("pause", {});
    });

    bus.on("continue", () => {
      controller.sbgContinue = true;
      clock.start();
    });
  }
);
