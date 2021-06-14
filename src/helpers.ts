const MAX_INTEGER = 4294967295;
export class Placeholder {
  constructor(readonly name: string) {}
}

export class Reference {
  constructor(readonly name: string) {}
}

export function createReference(label: string): Reference {
  return new Reference(label);
}

export function createPlaceholder(label: string): Placeholder {
  return new Placeholder(label);
}

export function gpioAddress(pin: number): number {
  const GPIO_BASEADDR = 0x60000300;
  const GPIO_PIN0_ADDRESS = 0x28;
  const GPIO_PIN_ADDR = GPIO_BASEADDR + GPIO_PIN0_ADDRESS + pin * 4;

  return GPIO_PIN_ADDR;
}

export function numberToInt32(number: number): number[] {
  if (number > MAX_INTEGER) {
    throw new SyntaxError('number is too large');
  }

  return Array.from(new Uint8Array(new Uint32Array([number]).buffer));
}

export function int32ToNumber(int32: number[]): number {
  return Array.from(new Uint32Array(new Uint8Array(int32).buffer))[0];
}

export function parseInt32(hex: string): number {
  return hex
    .split(' ')
    .map((x) => parseInt(x, 16))
    .map((n, i) => n << (8 * (3 - i)))
    .reduce((a, n) => new Uint32Array([n])[0] + a, 0);
}

export function zeroPad(string: string): string {
  return (string.length === 1 ? '0' : '') + string;
}

// export function toHex32(number: number): string[] {
//   return numberToInt32(number).map((x) => zeroPad(x.toString(16)));
// }

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

export function bytesFromHex(hex: string): number {
  return parseInt(hex, 16);
}
