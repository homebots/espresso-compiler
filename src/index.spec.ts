import { Compiler } from './index';
import grammar from './grammar';

describe('Compiler', () => {
  it('should parse a program', () => {
    const compiler = new Compiler(grammar);
  });
});
