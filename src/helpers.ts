import { Placeholder, Reference } from './types';

export function createReference(name: string): Reference {
  return { type: 'reference', name };
}

export function createPlaceholder(name: string): Placeholder {
  return { type: 'placeholder', name };
}

// export function getIdentifier(name: string): Identifier {
//   return { type: 'identifier', name, id: 0 };
// }

// export function toPinValue(number: number): [PinValue, number] {
//   return [{ type: 'pin', number }, 0x00];
// }

// export function toIdentifierValue(name: string): [Identifier, number] {
//   return [getIdentifier(name), 0x00];
// }

// export function gpioAddress(pin: number): number {
//   const GPIO_BASEADDR = 0x60000300;
//   const GPIO_PIN0_ADDRESS = 0x28;
//   const GPIO_PIN_ADDR = GPIO_BASEADDR + GPIO_PIN0_ADDRESS + pin * 4;

//   return GPIO_PIN_ADDR;
// }

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

export function toBinaryString(value: unknown[]): number[] {
  return value.map((c) => String(c).charCodeAt(0)).concat(0);
}

// export function toHex32(number: number): string[] {
//   return numberToInt32(number).map((x) => zeroPad(x.toString(16)));
// }
