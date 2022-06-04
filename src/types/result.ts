// deno-lint-ignore-file no-explicit-any
export abstract class Result<T, E> {
  abstract tag: "ok" | "err";

  abstract map<U>(f: (t: T) => U): Result<U, E>;
  abstract unwrap(): T;
  abstract unwrapErr(): E;
  abstract isOk(): boolean;
  abstract isErr(): boolean;
}

export class Ok<T> extends Result<T, any> {
  tag: "ok" | "err" = "ok";

  constructor(private value: T) {
    super();
  }

  map<U>(f: (t: T) => U): Result<U, any> {
    return new Ok(f(this.value));
  }

  unwrap(): T {
    return this.value;
  }

  unwrapErr(): never {
    throw new Error("unwrapErr called on Ok");
  }

  isOk(): boolean {
    return true;
  }

  isErr(): boolean {
    return false;
  }
}

export class Err<E> extends Result<unknown, E> {
  tag: "ok" | "err" = "err";

  constructor(private value: E) {
    super();
  }

  map<U>(): Result<U, E> {
    return new Err(this.value);
  }

  unwrap(): never {
    throw new Error("unwrap called on Err");
  }

  unwrapErr(): E {
    return this.value;
  }

  isOk(): boolean {
    return false;
  }

  isErr(): boolean {
    return true;
  }
}

export function isOk<T>(result: Result<T, any>): result is Ok<T> {
  return result.tag === "ok";
}
