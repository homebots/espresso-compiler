export interface Clock {
  onTick(fn: () => void): void;
  start(): void;
  stop(): void;
  tick(): void;
  delay(delay: number): void;
}
