import { Clock } from './clock';

export class StepperClock implements Clock {
  steps: number;
  paused: boolean;

  constructor() {
    this.start();
  }

  start(): void {
    this.steps = 0;
    this.paused = false;
  }

  stop(): void {
    this.paused = true;
  }

  private fn: () => void;

  onTick(fn: () => void): void {
    this.fn = fn;
  }

  tick(times = 1): void {
    while (times-- && !this.paused) {
      this.fn();
      this.steps++;
    }
  }

  delay(_: number): void {
    // noop
  }

  run(): void {
    while (!this.paused) {
      this.tick(9999);
    }
  }
}
