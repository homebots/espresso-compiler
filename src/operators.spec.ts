import { OpCodes } from './compiler';
import { CaptureOutput, compile, Emulator, StepClock } from './index';

describe('operators', () => {
  function setup() {
    const emulator = new Emulator();
    const clock = new StepClock();
    const output = new CaptureOutput();
    return { emulator, clock, output };
  }

  it('should increase or decrease a value', () => {
    const { emulator, clock, output } = setup();
    const bytes = compile(
      `
      uint $times
      inc $times
      dec $times
      `,
    );

    emulator.load(bytes, clock, output);

    clock.run();
    expect(output.lines.map((i: unknown[]) => i.join(' '))).toEqual(['declare 0, 5', 'inc #0', 'dec #0']);
  });

  it('should perform an arithmetic or logic operation', () => {
    const { emulator, clock, output } = setup();
    const bytes = compile(
      `
      uint $a
      uint $b
      uint $c

      $a = $b + $c
      $a = $b - $c
      $a = $b * $c
      $a = $b / $c
      $a = $b and $c
      $a = $b or $c
      $a = $b xor $c
      $a = $b == $c
      $a = $b != $c
      $a = $b > $c
      $a = $b >= $c
      $a = $b < $c
      $a = $b <= $c
      $a = not $b
      $a = 1
      `,
    );

    emulator.load(bytes, clock, output);

    clock.run();
    expect(output.lines.map((i: unknown[]) => i.join(' '))).toEqual([
      'declare 0, 5',
      'declare 1, 5',
      'declare 2, 5',
      `#0 = #1 ${OpCodes.Add} #2`,
      `#0 = #1 ${OpCodes.Sub} #2`,
      `#0 = #1 ${OpCodes.Mul} #2`,
      `#0 = #1 ${OpCodes.Div} #2`,
      `#0 = #1 ${OpCodes.And} #2`,
      `#0 = #1 ${OpCodes.Or} #2`,
      `#0 = #1 ${OpCodes.Xor} #2`,
      `#0 = #1 ${OpCodes.Equal} #2`,
      `#0 = #1 ${OpCodes.NotEqual} #2`,
      `#0 = #1 ${OpCodes.Gt} #2`,
      `#0 = #1 ${OpCodes.Gte} #2`,
      `#0 = #1 ${OpCodes.Lt} #2`,
      `#0 = #1 ${OpCodes.Lte} #2`,
      `#0 = not #1`,
      `#0 = 1`,
    ]);
  });
});
