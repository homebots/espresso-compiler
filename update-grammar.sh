grammarSpec=src/grammar.pegjs
grammarFile=src/compiler/parser.ts

echo '' > $grammarSpec

cat src/grammar/program.pegjs >> $grammarSpec
cat src/grammar/system.pegjs >> $grammarSpec
cat src/grammar/memory.pegjs >> $grammarSpec
cat src/grammar/operators.pegjs >> $grammarSpec
cat src/grammar/io.pegjs >> $grammarSpec
# cat src/grammar/wifi.pegjs >> $grammarSpec
# cat src/grammar/i2c.pegjs >> $grammarSpec
cat src/grammar/values.pegjs >> $grammarSpec
cat src/grammar/types.pegjs >> $grammarSpec

pegjs --format commonjs -o src/grammar.out src/grammar.pegjs
[[ $? -eq 0 ]] || exit 1

rm src/grammar.pegjs

echo "/* eslint-disable no-constant-condition */\nimport * as peg from 'pegjs';\nimport { InstructionNode, ValueType } from './types';\n\nexport default function (): peg.Parser {const module = { exports: null };" > $grammarFile
cat src/grammar.out >> $grammarFile
rm src/grammar.out
echo 'return module.exports as peg.Parser;}' >> $grammarFile

eslint --quiet $grammarFile --fix
eslint --quiet $grammarFile --fix
prettier -w src/compiler/parser.ts

exit 0