import { stringToHexBytes, bytesToNumber, numberToInt32 } from './index';

describe('data helpers', () => {
  describe('numberToInt32', () => {
    it('should convert a number to four bytes', () => {
      expect(numberToInt32(1000)).toEqual([232, 3, 0, 0]);
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
});
