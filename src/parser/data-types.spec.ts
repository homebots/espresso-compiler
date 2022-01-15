import { parse } from './parser';

describe('data types', () => {
  it('numbers', () => {
    const nodes = parse(`
      byte $a = 1h
      byte $b = true
      int $minusOne = -1
      int $lowestInt = -2147483648
      int $int = -2147483647
      int $positiveInt = +2147483647
      uint $e = 123
      string $f = 'hello'
      address $g = 0x00543f01
      `);

    expect(nodes).not.toEqual([]);
  });
});
