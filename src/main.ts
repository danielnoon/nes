import { Flag } from "./flag";
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

romPicker.addEventListener("change", async () => {
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

  manager.start(romData.unwrap());
});

console.log(Flag);
