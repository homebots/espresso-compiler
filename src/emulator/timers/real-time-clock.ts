import { Clock } from './clock';

export class RealTimeClock implements Clock {
  private fn: () => void;
  private timer: unknown;
  paused = false;
  delayedBy = 0;

  onTick(fn: () => void): void {
    this.fn = fn;
  }

  start(): void {
    this.timer = setTimeout(() => this.tick(), 1);
    this.paused = false;
  }

  stop(): void {
    clearTimeout(this.timer as number);
    this.timer = 0;
    this.paused = true;
  }

  delay(delay: number): void {
    this.delayedBy = delay;
  }

  tick(): void {
    if (this.paused) {
      return;
    }

    if (this.delayedBy) {
      setTimeout(() => {
        this.delayedBy = 0;
        this.tick();
      }, this.delayedBy);
      return;
    }

    this.fn();
    this.tick();
  }
}
