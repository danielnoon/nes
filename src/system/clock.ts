import Controller from "../controller";

type hook = (cycle: number) => void;

export default class Clock {
  private hooks = new Set<hook>();
  private cycle = 0;

  constructor(private control: Controller) {}

  addHook(hook: hook) {
    this.hooks.add(hook);
  }

  removeHook(hook: hook) {
    this.hooks.delete(hook);
  }

  start() {
    this.control.resume();
    while (!this.control.paused) {
      this.step();
      this.cycle++;
    }
    this.control.pause();
  }

  stop() {
    this.control.pause();
  }

  step() {
    this.hooks.forEach((hook) => hook(this.cycle));
  }
}
