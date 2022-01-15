import { compile } from '../index';
// import { OpCodes } from '../types';
import {
  stringToHexBytes,
  bytesToNumber,
  numberToInt32,
  stringToBytes,
  numberToUnsignedInt32,
  charArrayToBytes,
} from './data-conversion';

describe('data helpers', () => {
  describe('numberToInt32', () => {
    it('should convert a number to four bytes', () => {
      expect(numberToInt32(1000)).toEqual([232, 3, 0, 0]);
      expect(numberToInt32(-1000)).toEqual([24, 252, 255, 255]);
    });

    it('should throw error for numbers greater than 32 bits', () => {
      expect(() => numberToInt32(4294967296)).toThrow('Number is too large');
    });
  });

  describe('numberToUnsignedInt32', () => {
    it('should convert a number to four bytes', () => {
      expect(numberToUnsignedInt32(1000)).toEqual([232, 3, 0, 0]);
      expect(() => numberToUnsignedInt32(-1000)).toThrowError('Negative value not allowed');
    });

    it('should throw error for numbers greater than 32 bits', () => {
      expect(() => numberToUnsignedInt32(4294967296)).toThrow('Number is too large');
    });

    it('should throw error if number is negative', () => {
      expect(() => numberToUnsignedInt32(-1)).toThrow('Negative value not allowed');
    });
  });

  describe('bytesToNumber', () => {
    it('should convert int32 sequence of bytes to a number', () => {
      expect(bytesToNumber([232, 3, 0, 0])).toEqual(1000);
    });
  });

  describe('stringToHexBytes', () => {
    it('should convert a string into hex bytes', () => {
      expect(stringToHexBytes('0001ff00')).toBe('00 01 ff 00');
    });
  });

  describe('stringToBytes', () => {
    it('should convert a string into bytes', () => {
      expect(stringToBytes('foo')).toEqual([102, 111, 111, 0]);
    });
  });

  describe('charArrayToBytes', () => {
    it('should convert a string into bytes', () => {
      expect(charArrayToBytes(['f', 'o', 'o'])).toEqual([102, 111, 111, 0]);
    });
  });
});
