const MAX_INTEGER = 4294967295;

export function numberToInt32(number: number): number[] {
  if (number > MAX_INTEGER) {
    throw new SyntaxError('number is too large');
  }

  return Array.from(new Uint8Array(new Uint32Array([number]).buffer));
}

export function bytesToNumber(int32bytes: number[]): number {
  return Array.from(new Uint32Array(new Uint8Array(int32bytes).buffer))[0];
}

export function stringToBytes(string: string[]): number[] {
  return string.map((c) => c.charCodeAt(0)).concat([0]);
}

export function stringToHexBytes(string: string): string {
  return string
    .split('')
    .reduce((stack, next, index) => {
      if (index % 2 === 0) {
        stack.push(next);
      } else {
        stack.push(stack.pop() + next);
      }

      return stack;
    }, [])
    .join(' ');
}
