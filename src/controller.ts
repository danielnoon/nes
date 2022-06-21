import EventBus from "./EventBus";

export default class Controller {
  private currentController1 = 0;
  private currentController2 = 0;

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

  pollControllers() {
    this.currentController1 = Atomics.load(this.control, 4);
    this.currentController2 = Atomics.load(this.control, 5);
  }

  getController1() {
    const value = this.currentController1 & 1;
    this.currentController1 >>= 1;
    return value;
  }

  getController2() {
    const value = this.currentController2 & 1;
    this.currentController2 >>= 1;
    return value;
  }

  pause() {
    this.paused = true;
    this.running = false;
    this.bus.send("pause");
  }

  resume() {
    this.paused = false;
    this.running = true;
    this.bus.send("resume");
  }
}
