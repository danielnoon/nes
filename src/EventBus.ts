interface Messageable {
  onmessage: ((e: MessageEvent) => void) | null;
  postMessage(data: any): void;
}

export default class EventBus {
  private eventMap: Map<string, Array<Function>> = new Map();

  constructor(private messageable: Messageable) {
    this.messageable.onmessage = (e: MessageEvent) => {
      const { event, data } = e.data;

      this.eventMap.get(event)?.forEach((callback) => callback(data));
    };
  }

  on<T>(event: string, callback: (data: T) => void): void {
    if (!this.eventMap.has(event)) {
      this.eventMap.set(event, []);
    }

    this.eventMap.get(event)?.push(callback);
  }

  off(event: string, callback: Function): void {
    if (!this.eventMap.has(event)) {
      return;
    }

    const callbacks = this.eventMap.get(event);
    const index = callbacks?.indexOf(callback);

    if (index === undefined) {
      return;
    }

    callbacks?.splice(index, 1);
  }

  send(event: string, data?: any): void {
    this.messageable.postMessage({ event, data });
    this.eventMap.get(event)?.forEach((callback) => callback(data));
  }
}
