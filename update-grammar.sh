grammarSpec=src/grammar.pegjs
grammarFile=src/compiler/grammar.ts

echo '' > $grammarSpec

cat src/grammar/program.pegjs >> $grammarSpec
cat src/grammar/system.pegjs >> $grammarSpec
cat src/grammar/memory.pegjs >> $grammarSpec
cat src/grammar/operators.pegjs >> $grammarSpec
cat src/grammar/io.pegjs >> $grammarSpec
cat src/grammar/wifi.pegjs >> $grammarSpec
cat src/grammar/i2c.pegjs >> $grammarSpec
cat src/grammar/types.pegjs >> $grammarSpec

pegjs --optimize speed --format commonjs -o src/grammar.out src/grammar.pegjs
rm src/grammar.pegjs

echo "/* eslint-disable no-constant-condition */\nimport * as peg from 'pegjs';\nimport * as T from './compiler/types';\nimport {OpCodes}  from './compiler';\nexport default function (T: any, OpCodes: Record<string, number>): peg.Parser {const module = { exports: null };" > $grammarFile
cat src/grammar.out >> $grammarFile
rm src/grammar.out
echo 'return module.exports as peg.Parser;}' >> $grammarFile

eslint --quiet $grammarFile --fix
eslint --quiet $grammarFile --fix

exit 0