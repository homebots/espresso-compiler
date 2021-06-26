export interface Clock {
  onTick(fn: () => void): void;
  start(): void;
  stop(): void;
}

export class StepClock implements Clock {
  steps = 0;
  paused = false;

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

  tick(): void {
    if (!this.paused) {
      this.fn();
      this.steps++;
    }
  }
}

export class TimerClock implements Clock {
  private fn: () => void;
  private timer: unknown;

  onTick(fn: () => void): void {
    this.fn = fn;
  }

  start(): void {
    this.timer = setTimeout(() => this.fn(), 1);
  }

  stop(): void {
    clearTimeout(this.timer as number);
    this.timer = 0;
  }
}
