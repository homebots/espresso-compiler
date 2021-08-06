grammarSpec=src/grammar.pegjs
grammarFile=src/compiler/parser.ts

echo '' > $grammarSpec
for file in `ls src/grammar/*.pegjs`; do
  echo $file
  cat $file >> $grammarSpec
done

pegjs --format commonjs --allowed-start-rules Program -o src/grammar.out src/grammar.pegjs
[[ $? -eq 0 ]] || exit 1

# rm src/grammar.pegjs

echo "/* eslint-disable no-constant-condition */\nimport * as peg from 'pegjs';\nimport { InstructionNode, ValueType } from './types';\n\nexport default function (): peg.Parser {const module = { exports: null };" > $grammarFile
cat src/grammar.out >> $grammarFile
rm src/grammar.out
echo 'return module.exports as peg.Parser;}' >> $grammarFile

# two passes to ensure that all the fixable issues are covered
eslint --quiet $grammarFile --fix >> /dev/null
eslint --quiet $grammarFile --fix >> /dev/null
prettier -w src/compiler/parser.ts

exit 0