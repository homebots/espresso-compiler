import { parse } from '../parser/index';
import { Compiler } from './compiler';

describe('Compiler', () => {
  function compile(program: string) {
    const compiler = new Compiler(parse);
    return compiler.compile(program);
  }

  it('should parse an empty program', () => {
    expect(compile('')).toStrictEqual([]);
  });

  it('should ignore comments', () => {
    expect(compile('// nothing')).toStrictEqual([]);
  });

  it('should throw an error for invalid syntax', () => {
    expect(() => compile('not valid')).toThrowError(
      '1:1: Expected end of input or new line but "n" found.\nnot valid\n^',
    );
  });
});
