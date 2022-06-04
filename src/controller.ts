import EventBus from "./EventBus";

export default class Controller {
  constructor(private control: Uint8Array, private bus: EventBus) {}

  get running() {
    return this.control[0] === 1;
  }

  set running(value: boolean) {
    Atomics.store(this.control, 0, value ? 1 : 0);
  }

  get paused() {
    return this.control[1] === 1;
  }

  set paused(value: boolean) {
    Atomics.store(this.control, 1, value ? 1 : 0);
  }

  get sbgContinue() {
    return this.control[2] === 1;
  }

  set sbgContinue(value: boolean) {
    Atomics.store(this.control, 2, value ? 1 : 0);
  }

  pause() {
    this.paused = true;
    this.running = false;
    this.bus.send("pause", {});
  }

  resume() {
    this.paused = false;
    this.running = true;
    this.bus.send("resume", {});
  }
}
