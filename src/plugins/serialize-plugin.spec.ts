import { Compiler } from '../compiler';
import { parse } from '../parser';
import { InstructionNode, NodeTypeToNodeMap, OpCodes, ValueType } from '../types/index';
import { FindIdentifiersPlugin } from './identifiers.plugin';
import { SerializePlugin } from './serialize.plugin';

describe('SerializePlugin.sizeOf and SerializePlugin.serialize', () => {
  const createIdentifier = (id: number) =>
    InstructionNode.create('identifierValue', {
      value: InstructionNode.create('useIdentifier', { name: 'foo', id }),
      dataType: ValueType.Identifier,
    });

  function compile(program: string) {
    const compiler = new Compiler(parse);
    return compiler.compile(program, [new FindIdentifiersPlugin(), new SerializePlugin()]);
  }

  describe('types and length', () => {
    it('should calculate the size of data types correctly', () => {
      const program = `
        byte $a = ffh
        uint $b = 1
        int $c = +1
        string $d = 'hello'
        `;

      const bytes = compile(program);
      expect(bytes).toHaveLength(27);
    });
  });

  describe('should calculate the instruction size correctly:', () => {
    it('assign', () => {
      const bytes = 'foo'.split('').map((c) => c.charCodeAt(0));
      const node = InstructionNode.create('assign', {
        target: createIdentifier(2),
        value: InstructionNode.create('stringValue', { value: ['f', 'o', 'o'], dataType: ValueType.String }),
      });

      expect(SerializePlugin.sizeOf(node)).toBe(8);
      expect(SerializePlugin.serialize(node)).toEqual([
        OpCodes.Assign,
        ValueType.Identifier,
        2,
        ValueType.String,
        ...bytes,
        0,
      ]);
    });

    it('binaryOperation', () => {
      const node = InstructionNode.create('binaryOperation', {
        a: InstructionNode.create('byteValue', { value: 1, dataType: ValueType.Byte }),
        b: InstructionNode.create('byteValue', { value: 2, dataType: ValueType.Byte }),
        operator: '+',
        target: createIdentifier(2),
      });

      expect(SerializePlugin.sizeOf(node)).toBe(7);
      expect(SerializePlugin.serialize(node)).toEqual([
        OpCodes.Add,
        ValueType.Identifier,
        2,
        ValueType.Byte,
        1,
        ValueType.Byte,
        2,
      ]);
    });

    it('unaryOperation', () => {
      const node = InstructionNode.create('unaryOperation', {
        target: createIdentifier(0),
        operator: 'inc',
      });
      expect(SerializePlugin.sizeOf(node)).toBe(3);
      expect(SerializePlugin.serialize(node)).toEqual([OpCodes.Inc, ValueType.Identifier, 0]);
    });

    it('comment', () => {
      const node = InstructionNode.create('comment', {});
      expect(SerializePlugin.sizeOf(node)).toBe(0);
      expect(SerializePlugin.serialize(node)).toEqual([]);
    });

    it('declareIdentifier', () => {
      const node = InstructionNode.create('declareIdentifier', {
        dataType: ValueType.Byte,
        name: 'foo',
        id: 1,
        value: InstructionNode.create('byteValue', { value: 0, dataType: ValueType.Byte }),
      });

      expect(SerializePlugin.sizeOf(node)).toBe(4);
      expect(SerializePlugin.serialize(node)).toEqual([OpCodes.Declare, 1, ValueType.Byte, 0]);
    });

    it('useIdentifier', () => {
      const node = InstructionNode.create('useIdentifier', { name: 'foo' });

      expect(SerializePlugin.sizeOf(node)).toBe(0);
      expect(() => SerializePlugin.serialize(node)).toThrow();
    });

    it('defineLabel', () => {
      const node = InstructionNode.create('defineLabel', { label: 'foo' });

      expect(SerializePlugin.sizeOf(node)).toBe(0);
      expect(() => SerializePlugin.serialize(node)).toThrow();
    });

    it('label', () => {
      const node = InstructionNode.create('label', { label: 'foo' });

      expect(SerializePlugin.sizeOf(node)).toBe(0);
      expect(() => SerializePlugin.serialize(node)).toThrow();
    });

    it('stringValue', () => {
      const node = InstructionNode.create('stringValue', { value: 'hello'.split(''), dataType: ValueType.String });

      expect(SerializePlugin.sizeOf(node)).toBe(7);
      expect(() => SerializePlugin.serialize(node)).toThrow();
    });

    it('numberValue', () => {
      const node = InstructionNode.create('numberValue', { value: 1000, dataType: ValueType.Integer });

      expect(SerializePlugin.sizeOf(node)).toBe(5);
      expect(() => SerializePlugin.serialize(node)).toThrow();
    });

    it('byteValue', () => {
      const node = InstructionNode.create('byteValue', { value: 1, dataType: ValueType.Byte });

      expect(SerializePlugin.sizeOf(node)).toBe(2);
      expect(() => SerializePlugin.serialize(node)).toThrow();
    });

    it('identifierValue', () => {
      const node = createIdentifier(0);

      expect(SerializePlugin.sizeOf(node)).toBe(2);
      expect(() => SerializePlugin.serialize(node)).toThrow();
    });

    it('debug', () => {
      const node = InstructionNode.create('debug', { value: 1 });

      expect(SerializePlugin.sizeOf(node)).toBe(2);
      expect(SerializePlugin.serialize(node)).toEqual([OpCodes.Debug, 1]);
    });

    it('single-byte instructions', () => {
      const instructionTypes: Array<keyof NodeTypeToNodeMap> = ['halt', 'restart', 'noop', 'systemInfo', 'dump'];

      instructionTypes.forEach((type) => expect(SerializePlugin.sizeOf(InstructionNode.create(type))).toBe(1));

      expect(SerializePlugin.serialize(InstructionNode.create('halt'))).toEqual([OpCodes.Halt]);
      expect(SerializePlugin.serialize(InstructionNode.create('restart'))).toEqual([OpCodes.Restart]);
      expect(SerializePlugin.serialize(InstructionNode.create('noop'))).toEqual([OpCodes.Noop]);
      expect(SerializePlugin.serialize(InstructionNode.create('systemInfo'))).toEqual([OpCodes.SystemInfo]);
      expect(SerializePlugin.serialize(InstructionNode.create('dump'))).toEqual([OpCodes.Dump]);
    });

    it('print', () => {
      const node = InstructionNode.create('print', {
        values: [InstructionNode.create('numberValue', { value: 1000, dataType: ValueType.Integer })],
      });

      expect(SerializePlugin.sizeOf(node)).toBe(7);
      expect(SerializePlugin.serialize(node)).toEqual([OpCodes.Print, ValueType.Integer, 0xe8, 0x03, 0, 0]);
    });

    const time = {
      value: InstructionNode.create('numberValue', { value: 1000, dataType: ValueType.Integer }),
    };

    it('delay', () => {
      const node = InstructionNode.create('delay', time);
      expect(SerializePlugin.sizeOf(node)).toBe(6);
      expect(SerializePlugin.serialize(node)).toEqual([OpCodes.Delay, ValueType.Integer, 0xe8, 0x03, 0, 0]);
    });

    it('sleep', () => {
      const node = InstructionNode.create('sleep', time);
      expect(SerializePlugin.sizeOf(node)).toBe(6);
      expect(SerializePlugin.serialize(node)).toEqual([OpCodes.Sleep, ValueType.Integer, 0xe8, 0x03, 0, 0]);
    });

    it('yield', () => {
      const node = InstructionNode.create('yield', time);
      expect(SerializePlugin.sizeOf(node)).toBe(6);
      expect(SerializePlugin.serialize(node)).toEqual([OpCodes.Yield, ValueType.Integer, 0xe8, 0x03, 0, 0]);
    });

    it('jumpTo', () => {
      const node = InstructionNode.create('jumpTo', {
        address: InstructionNode.create('numberValue', { value: 1000, dataType: ValueType.Address }),
      });
      expect(SerializePlugin.sizeOf(node)).toBe(6);
      expect(SerializePlugin.serialize(node)).toEqual([OpCodes.JumpTo, ValueType.Address, 0xe8, 0x03, 0, 0]);
    });

    it('jumpIf', () => {
      const value = InstructionNode.create('byteValue', { value: 1, dataType: ValueType.Byte });
      const node = InstructionNode.create('jumpIf', {
        condition: value,
        address: InstructionNode.create('numberValue', { value: 1000, dataType: ValueType.Address }),
      });

      expect(SerializePlugin.sizeOf(node)).toBe(8);
      expect(SerializePlugin.serialize(node)).toEqual([
        OpCodes.JumpIf,
        ValueType.Byte,
        1,
        ValueType.Address,
        0xe8,
        0x03,
        0,
        0,
      ]);
    });

    it('ioWrite', () => {
      expect(
        SerializePlugin.sizeOf(
          InstructionNode.create('ioWrite', {
            pin: 1,
            value: InstructionNode.create('byteValue', { value: 1, dataType: ValueType.Byte }),
          }),
        ),
      ).toBe(4);
    });

    it('ioRead', () => {
      const node = InstructionNode.create('ioRead', {
        pin: 1,
        target: createIdentifier(1),
      });

      expect(SerializePlugin.sizeOf(node)).toBe(4);
      expect(SerializePlugin.serialize(node)).toEqual([OpCodes.IoRead, 1, ValueType.Identifier, 1]);
    });

    it('ioMode', () => {
      const node = InstructionNode.create('ioMode', { pin: 1, mode: 2 });

      expect(SerializePlugin.sizeOf(node)).toBe(3);
      expect(SerializePlugin.serialize(node)).toEqual([OpCodes.IoMode, 1, 2]);
    });

    it('ioType', () => {
      const node = InstructionNode.create('ioType', { pin: 1, pinType: 2 });

      expect(SerializePlugin.sizeOf(node)).toBe(3);
      expect(SerializePlugin.serialize(node)).toEqual([OpCodes.IoType, 1, 2]);
    });

    it('ioAllOut', () => {
      const node = InstructionNode.create('ioAllOut');

      expect(SerializePlugin.sizeOf(node)).toBe(1);
      expect(SerializePlugin.serialize(node)).toEqual([OpCodes.IoAllOut]);
    });

    it('memoryGet', () => {
      const node = InstructionNode.create('memoryGet', {
        address: InstructionNode.create('numberValue', { dataType: ValueType.Address, value: 1000 }),
        target: createIdentifier(1),
      });

      expect(SerializePlugin.sizeOf(node)).toBe(8);
      expect(SerializePlugin.serialize(node)).toEqual([
        OpCodes.MemGet,
        ValueType.Identifier,
        1,
        ValueType.Address,
        0xe8,
        0x03,
        0,
        0,
      ]);
    });

    it('memorySet', () => {
      const node = InstructionNode.create('memorySet', {
        target: InstructionNode.create('numberValue', { dataType: ValueType.Address, value: 1000 }),
        value: InstructionNode.create('numberValue', { dataType: ValueType.Integer, value: 1001 }),
      });

      expect(SerializePlugin.sizeOf(node)).toBe(11);
      expect(SerializePlugin.serialize(node)).toEqual([
        OpCodes.MemSet,
        ValueType.Address,
        0xe8,
        0x03,
        0,
        0,
        ValueType.Integer,
        0xe9,
        0x03,
        0,
        0,
      ]);
    });

    it('memoryCopy', () => {
      const node = InstructionNode.create('memoryCopy', {
        source: InstructionNode.create('numberValue', { dataType: ValueType.Address, value: 1000 }),
        destination: InstructionNode.create('numberValue', { dataType: ValueType.Address, value: 1001 }),
      });

      expect(SerializePlugin.sizeOf(node)).toBe(11);
      expect(SerializePlugin.serialize(node)).toEqual([
        OpCodes.MemCopy,
        ValueType.Address,
        0xe8,
        0x03,
        0,
        0,
        ValueType.Address,
        0xe9,
        0x03,
        0,
        0,
      ]);
    });
  });
});
