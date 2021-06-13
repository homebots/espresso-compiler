import { int32ToNumber, numberToInt32, stringToHexBytes } from './helpers';

describe('helpers', () => {
  describe('numberToInt32', () => {
    it('should convert a number to four bytes', () => {
      expect(numberToInt32(1000)).toEqual([232, 3, 0, 0]);
    });
  });

  describe('int32ToNumber', () => {
    it('should convert int32 sequence of bytes to a number', () => {
      expect(int32ToNumber([232, 3, 0, 0])).toEqual(1000);
    });
  });

  describe('stringToHexBytes', () => {
    it('should convert a string into hex bytes', () => {
      expect(stringToHexBytes('0001ff00')).toBe('00 01 ff 00');
    });
  });
});
