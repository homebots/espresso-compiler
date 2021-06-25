target=src/grammar.pegjs

echo '' > $target
# echo 'export default `' > $target
cat src/grammar/program.pegjs >> $target
cat src/grammar/system.pegjs >> $target
cat src/grammar/memory.pegjs >> $target
cat src/grammar/operators.pegjs >> $target
cat src/grammar/io.pegjs >> $target
cat src/grammar/wifi.pegjs >> $target
cat src/grammar/i2c.pegjs >> $target
cat src/grammar/types.pegjs >> $target
# echo '`;' >> $target

pegjs --optimize speed --format commonjs -o src/grammar.out src/grammar.pegjs

echo "/* eslint-disable no-constant-condition */\nimport * as peg from 'pegjs';\nexport default function (_: any, T: any, OpCodes: Record<string, number>): peg.Parser {const module = { exports: null };" > src/grammar.ts
cat src/grammar.out >> src/grammar.ts
echo 'return module.exports as peg.Parser;}' >> src/grammar.ts

eslint --quiet src/**/*.ts --fix
eslint --quiet src/**/*.ts --fix

exit 0