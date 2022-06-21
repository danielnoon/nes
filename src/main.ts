import { Register } from "./Register";
import Manager from "./manager";
import { parse } from "./parse";
import "./style.css";
import { isOk } from "./types/result";

// const app = document.querySelector<HTMLDivElement>("#app")!;
const romPicker = document.querySelector<HTMLInputElement>("#file")!;
const pauseButton = document.querySelector<HTMLButtonElement>("#pause")!;
const debugView = document.querySelector<HTMLDivElement>("#debugView")!;
const debug = document.querySelector<HTMLInputElement>("#debug")!;
const stepper = document.querySelector<HTMLButtonElement>("#step")!;
const continuer = document.querySelector<HTMLButtonElement>("#continue")!;
const brkInput = document.querySelector<HTMLButtonElement>("#brkInput")!;
const brkSubmit = document.querySelector<HTMLButtonElement>("#brkSubmit")!;
const screen = document.querySelector<HTMLCanvasElement>("#screen")!;

let currentManager: Manager | null = null;

romPicker.addEventListener("change", async () => {
  if (currentManager) {
    currentManager.dispose();
  }

  const romData = parse(await romPicker.files![0].arrayBuffer());

  if (!romData || !isOk(romData)) {
    return;
  }

  const manager = new Manager({
    pause: pauseButton,
    file: romPicker,
    debugView,
    debug,
    stepper,
    continuer,
    screen,
  });

  brkSubmit.addEventListener("click", () => {
    const brk = parseInt(brkInput.value, 16);
    manager.addBreakpoint(brk);
  });

  stepper.addEventListener("click", () => {
    manager.step();
  });

  continuer.addEventListener("click", () => {
    manager.continue();
  });

  const keymap: Record<string, string> = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    KeyA: "start",
    KeyS: "select",
    KeyZ: "a",
    KeyX: "b",
  };

  window.addEventListener("keydown", (e) => {
    const key = keymap[e.code];

    if (key) {
      e.preventDefault();
      manager.setController1(key, 1);
    }
  });

  window.addEventListener("keyup", (e) => {
    const key = keymap[e.code];

    if (key) {
      e.preventDefault();
      manager.setController1(key, 0);
    }
  });

  manager.start(romData.unwrap());

  currentManager = manager;
});
