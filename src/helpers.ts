const MAX_INTEGER = 4294967295;

class Context {
  labels: Map<string, any>;
  references: Map<string, any>;

  reset() {
    this.labels = new Map();
    this.references = new Map();
  }
}

export const context = new Context();

export class Placeholder {
  constructor(readonly name: string) {}
}

export class Int32Reference {
  value = 0;

  valueOf() {
    return toInt32(this.value);
  }
}

export class ByteReference {
  value = 0;

  valueOf() {
    return Number(this.value);
  }
}

export function createLabel(label: string) {
  if (!context.labels.has(label)) {
    context.labels.set(label, new Int32Reference());
  }

  return new Placeholder(label);
}

export function getLabel(label: string) {
  if (!context.labels.has(label)) {
    throw new Error('Label not declared yet: ' + label);
  }

  return context.labels.get(label);
}

export function useReference(label: string) {
  if (!context.references.has(label)) {
    context.references.set(label, new ByteReference());
  }

  return context.references.get(label);
}

export function gpioAddress(pin: number) {
  const GPIO_BASEADDR = 0x60000300;
  const GPIO_PIN0_ADDRESS = 0x28;
  const GPIO_PIN_ADDR = GPIO_BASEADDR + GPIO_PIN0_ADDRESS + pin * 4;

  return GPIO_PIN_ADDR;
}

export function toInt32(number: number) {
  if (number > MAX_INTEGER) {
    throw new SyntaxError('number is too large');
  }

  return Array.from(new Uint8Array(new Uint32Array([number]).buffer));
}

export function parseInt32(hex: string) {
  return hex
    .split(' ')
    .map((x) => parseInt(x, 16))
    .map((n, i) => n << (8 * (3 - i)))
    .reduce((a, n) => new Uint32Array([n])[0] + a, 0);
}

export function zeroPad(string: string) {
  return (string.length === 1 ? '0' : '') + string;
}

export function toHex32(number: number) {
  return toInt32(number).map((x) => zeroPad(x.toString(16)));
}
