// import * as peg from 'pegjs';
// import * as helpers from './helpers';
// import grammar from './grammar';

// export function createParser(grammar: string): peg.Parser {
//   try {
//     const parserCode = peg.generate(grammar, { output: 'source', optimize: 'speed' });
//     const parserFunction = Function('_', 'return 0, ' + parserCode);
//     const parser = parserFunction(helpers) as unknown as peg.Parser;

//     return parser;
//   } catch (error) {
//     return {
//       SyntaxError: SyntaxError,

//       parse() {
//         console.debug(grammar);
//         throw new Error('Invalid grammar: ' + error.message);
//       },
//     };
//   }
// }

// // export const defaultParser = createParser(grammar);
