import { InstructionNode, NodeTypeToNodeMap, OpCodes, ValueType } from './types/index.mjs';

describe('InstructionNode.sizeOf and InstructionNode.serialize', () => {
  const createIdentifier = (id: number) =>
    InstructionNode.create('identifierValue', {
      value: InstructionNode.create('useIdentifier', { name: 'foo', id }),
    });

  const createByte = (value: number) => InstructionNode.create('byteValue', { value, dataType: ValueType.Byte });

  describe('should calculate the instruction size correctly:', () => {
    it('assign', () => {
      const bytes = 'foo'.split('').map((c) => c.charCodeAt(0));
      const node = InstructionNode.create('assign', {
        target: createIdentifier(2),
        value: InstructionNode.create('stringValue', { value: 'foo' }),
      });

      expect(InstructionNode.sizeOf(node)).toBe(8);
      expect(InstructionNode.serialize(node)).toEqual([
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
        a: createByte(1),
        b: createByte(2),
        operator: '+',
        target: createIdentifier(2),
      });

      expect(InstructionNode.sizeOf(node)).toBe(7);
      expect(InstructionNode.serialize(node)).toEqual([
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
        operator: 'inc',
        target: createIdentifier(0),
      });
      expect(InstructionNode.sizeOf(node)).toBe(3);
      expect(InstructionNode.serialize(node)).toEqual([OpCodes.Inc, ValueType.Identifier, 0]);
    });

    it('comment', () => {
      const node = InstructionNode.create('comment', {});
      expect(InstructionNode.sizeOf(node)).toBe(0);
      expect(InstructionNode.serialize(node)).toEqual([]);
    });

    it('declareIdentifier', () => {
      const node = InstructionNode.create('declareIdentifier', {
        dataType: ValueType.Byte,
        name: 'foo',
        id: 1,
        value: createByte(0),
      });

      expect(InstructionNode.sizeOf(node)).toBe(4);
      expect(InstructionNode.serialize(node)).toEqual([OpCodes.Declare, 1, ValueType.Byte, 0]);
    });

    it('useIdentifier', () => {
      const node = InstructionNode.create('useIdentifier', { name: 'foo' });

      expect(InstructionNode.sizeOf(node)).toBe(0);
      expect(() => InstructionNode.serialize(node)).toThrow();
    });

    it('define', () => {
      const node = InstructionNode.create('define', {
        label: 'foo',
        body: [InstructionNode.create('return')],
      });

      expect(InstructionNode.sizeOf(node)).toBe(7);
      expect(InstructionNode.serialize(node)).toEqual([OpCodes.Define, ValueType.Integer, 1, 0, 0, 0, OpCodes.Return]);
    });

    it('label', () => {
      const node = InstructionNode.create('label', { label: 'foo' });

      expect(InstructionNode.sizeOf(node)).toBe(0);
      expect(() => InstructionNode.serialize(node)).toThrow();
    });

    it('stringValue', () => {
      const node = InstructionNode.create('stringValue', { value: 'hello' });

      expect(InstructionNode.sizeOf(node)).toBe(7);
      expect(() => InstructionNode.serialize(node)).toThrow();
    });

    it('integerValue', () => {
      const node = InstructionNode.create('integerValue', { value: 1000 });

      expect(InstructionNode.sizeOf(node)).toBe(5);
      expect(() => InstructionNode.serialize(node)).toThrow();
    });

    it('byteValue', () => {
      const node = createByte(1);

      expect(InstructionNode.sizeOf(node)).toBe(2);
      expect(() => InstructionNode.serialize(node)).toThrow();
    });

    it('identifierValue', () => {
      const node = createIdentifier(0);

      expect(InstructionNode.sizeOf(node)).toBe(2);
      expect(() => InstructionNode.serialize(node)).toThrow();
    });

    it('debug', () => {
      const byte = createByte(1);
      const node = InstructionNode.create('debug', { value: byte });

      expect(InstructionNode.sizeOf(node)).toBe(3);
      expect(InstructionNode.serialize(node)).toEqual([OpCodes.Debug, ValueType.Byte, 1]);
    });

    it('single-byte instructions', () => {
      const instructionTypes: Array<keyof NodeTypeToNodeMap> = ['halt', 'restart', 'noop', 'systemInfo', 'dump'];

      instructionTypes.forEach((type) => expect(InstructionNode.sizeOf(InstructionNode.create(type))).toBe(1));

      expect(InstructionNode.serialize(InstructionNode.create('halt'))).toEqual([OpCodes.Halt]);
      expect(InstructionNode.serialize(InstructionNode.create('restart'))).toEqual([OpCodes.Restart]);
      expect(InstructionNode.serialize(InstructionNode.create('noop'))).toEqual([OpCodes.Noop]);
      expect(InstructionNode.serialize(InstructionNode.create('systemInfo'))).toEqual([OpCodes.SystemInfo]);
      expect(InstructionNode.serialize(InstructionNode.create('dump'))).toEqual([OpCodes.Dump]);
    });

    it('print', () => {
      const node = InstructionNode.create('print', {
        value: InstructionNode.create('integerValue', { value: 1000 }),
      });

      expect(InstructionNode.sizeOf(node)).toBe(6);
      expect(InstructionNode.serialize(node)).toEqual([OpCodes.Print, ValueType.Integer, 0xe8, 0x03, 0, 0]);
    });

    const time = {
      value: InstructionNode.create('integerValue', { value: 1000 }),
    };

    it('delay', () => {
      const node = InstructionNode.create('delay', time);
      expect(InstructionNode.sizeOf(node)).toBe(6);
      expect(InstructionNode.serialize(node)).toEqual([OpCodes.Delay, ValueType.Integer, 0xe8, 0x03, 0, 0]);
    });

    it('sleep', () => {
      const node = InstructionNode.create('sleep', time);
      expect(InstructionNode.sizeOf(node)).toBe(6);
      expect(InstructionNode.serialize(node)).toEqual([OpCodes.Sleep, ValueType.Integer, 0xe8, 0x03, 0, 0]);
    });

    it('yield', () => {
      const node = InstructionNode.create('yield');
      expect(InstructionNode.sizeOf(node)).toBe(1);
      expect(InstructionNode.serialize(node)).toEqual([OpCodes.Yield]);
    });

    it('jumpTo', () => {
      const node = InstructionNode.create('jumpTo', {
        address: InstructionNode.create('addressValue', { value: 1000 }),
      });
      expect(InstructionNode.sizeOf(node)).toBe(6);
      expect(InstructionNode.serialize(node)).toEqual([OpCodes.JumpTo, ValueType.Address, 0xe8, 0x03, 0, 0]);
    });

    it('return', () => {
      const node = InstructionNode.create('return');
      expect(InstructionNode.sizeOf(node)).toBe(1);
      expect(InstructionNode.serialize(node)).toEqual([OpCodes.Return]);
    });

    it('jumpIf', () => {
      const value = createByte(1);
      const node = InstructionNode.create('jumpIf', {
        condition: value,
        address: InstructionNode.create('addressValue', { value: 1000 }),
      });

      expect(InstructionNode.sizeOf(node)).toBe(8);
      expect(InstructionNode.serialize(node)).toEqual([
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

    it('ioInterrupt', () => {
      const on = InstructionNode.create('ioInterrupt', {
        pin: InstructionNode.create('pinValue', { value: 0 }),
        value: InstructionNode.create('booleanValue', { value: 1 }),
        address: InstructionNode.create('addressValue', { value: 1000 }),
      });

      const off = InstructionNode.create('ioInterrupt', {
        pin: InstructionNode.create('pinValue', { value: 2 }),
        value: InstructionNode.create('booleanValue', { value: 0 }),
        address: InstructionNode.create('addressValue', { value: 1000 }),
      });

      expect(InstructionNode.sizeOf(on)).toBe(10);
      expect(InstructionNode.serialize(on)).toEqual([
        OpCodes.Iointerrupt,
        ValueType.Pin,
        0,
        ValueType.Byte,
        1,
        ValueType.Address,
        0xe8,
        0x03,
        0,
        0,
      ]);
      expect(InstructionNode.sizeOf(off)).toBe(10);
      expect(InstructionNode.serialize(off)).toEqual([
        OpCodes.Iointerrupt,
        ValueType.Pin,
        2,
        ValueType.Byte,
        0,
        ValueType.Address,
        0xe8,
        0x03,
        0,
        0,
      ]);
    });

    it('ioInterruptToggle', () => {
      const node = InstructionNode.create('ioInterruptToggle', {
        value: createByte(1),
      });

      expect(InstructionNode.sizeOf(node)).toBe(3);
      expect(InstructionNode.serialize(node)).toEqual([OpCodes.IointerruptToggle, ValueType.Byte, 1]);
    });

    it('ioWrite', () => {
      const node = InstructionNode.create('ioWrite', {
        pin: InstructionNode.create('pinValue', { value: 1 }),
        value: createByte(1),
      });

      expect(InstructionNode.sizeOf(node)).toBe(5);
      expect(InstructionNode.serialize(node)).toEqual([OpCodes.IoWrite, ValueType.Pin, 1, ValueType.Byte, 1]);
    });

    it('ioRead', () => {
      const node = InstructionNode.create('ioRead', {
        pin: InstructionNode.create('pinValue', { value: 1 }),
        target: createIdentifier(1),
      });

      expect(InstructionNode.sizeOf(node)).toBe(5);
      expect(InstructionNode.serialize(node)).toEqual([OpCodes.IoRead, ValueType.Pin, 1, ValueType.Identifier, 1]);
    });

    it('ioMode', () => {
      const node = InstructionNode.create('ioMode', {
        pin: InstructionNode.create('pinValue', { value: 1 }),
        mode: createByte(2),
      });

      expect(InstructionNode.sizeOf(node)).toBe(5);
      expect(InstructionNode.serialize(node)).toEqual([OpCodes.IoMode, ValueType.Pin, 1, ValueType.Byte, 2]);
    });

    it('ioType', () => {
      const node = InstructionNode.create('ioType', {
        pin: InstructionNode.create('pinValue', { value: 1 }),
        pinType: createByte(2),
      });

      expect(InstructionNode.sizeOf(node)).toBe(5);
      expect(InstructionNode.serialize(node)).toEqual([OpCodes.IoType, ValueType.Pin, 1, ValueType.Byte, 2]);
    });

    it('ioAllOutput', () => {
      const node = InstructionNode.create('ioAllOutput');

      expect(InstructionNode.sizeOf(node)).toBe(1);
      expect(InstructionNode.serialize(node)).toEqual([OpCodes.IoAllOutput]);
    });

    it('ioAllInput', () => {
      const node = InstructionNode.create('ioAllInput');

      expect(InstructionNode.sizeOf(node)).toBe(1);
      expect(InstructionNode.serialize(node)).toEqual([OpCodes.IoAllInput]);
    });

    it('memoryGet', () => {
      const node = InstructionNode.create('memoryGet', {
        address: InstructionNode.create('addressValue', { value: 1000 }),
        target: createIdentifier(1),
      });

      expect(InstructionNode.sizeOf(node)).toBe(8);
      expect(InstructionNode.serialize(node)).toEqual([
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
        target: InstructionNode.create('addressValue', { value: 1000 }),
        value: InstructionNode.create('integerValue', { value: 1001 }),
      });

      expect(InstructionNode.sizeOf(node)).toBe(11);
      expect(InstructionNode.serialize(node)).toEqual([
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

    it('wifiConnect', () => {
      const node = InstructionNode.create('wifiConnect', {
        ssid: InstructionNode.create('stringValue', {
          dataType: ValueType.String,
          value: 'test',
        }),
        password: InstructionNode.create('nullValue', {
          dataType: ValueType.Null,
          value: 0,
        }),
      });
      expect(InstructionNode.sizeOf(node)).toBe(9);
      expect(InstructionNode.serialize(node)).toEqual([
        OpCodes.WifiConnect,
        ValueType.String,
        116,
        101,
        115,
        116,
        0,
        0,
        0,
      ]);
    });

    it('wifiDisconnect', () => {
      const node = InstructionNode.create('wifiDisconnect');
      expect(InstructionNode.sizeOf(node)).toBe(1);
      expect(InstructionNode.serialize(node)).toEqual([OpCodes.WifiDisconnect]);
    });
  });
});
