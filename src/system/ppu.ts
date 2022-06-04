import EventBus from "../EventBus";

export default class PPU {
  constructor(private memory: ArrayBuffer, private bus: EventBus) {}

  cycle() {
    // TODO: implement one cycle of the PPU
  }

  realCycle() {
    this.cycle();
    this.cycle();
    this.cycle();
  }
}
