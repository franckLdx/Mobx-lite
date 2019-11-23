function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg)
  }
}

export function assertDefined<T>(value: T | null | undefined, msg?: string): asserts value is T {
  assert(value !== null && value !== undefined, msg);
}