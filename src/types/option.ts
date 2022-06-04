// deno-lint-ignore-file no-explicit-any
export abstract class Option<T> {
  abstract tag: "some" | "none";

  abstract map<U>(f: (t: T) => U): Option<U>;
  abstract unwrap(defaultValue: T): T;
  abstract isDefined(): boolean;
  abstract isEmpty(): boolean;
}

export class Some<T> extends Option<T> {
  tag: "some" | "none" = "some";

  constructor(private value: T) {
    super();
  }

  map<U>(f: (t: T) => U): Option<U> {
    return new Some(f(this.value));
  }

  unwrap(): T {
    return this.value;
  }

  isDefined(): boolean {
    return true;
  }

  isEmpty(): boolean {
    return false;
  }
}

export class None extends Option<any> {
  tag: "some" | "none" = "none";

  map<U>(): Option<U> {
    return new None();
  }

  unwrap<T>(defaultValue: T): T {
    return defaultValue;
  }

  isDefined(): boolean {
    return false;
  }

  isEmpty(): boolean {
    return true;
  }
}
