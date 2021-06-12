target=src/grammar.ts

echo 'export default `' > $target
cat src/grammar/program.pegjs >> $target
cat src/grammar/types.pegjs >> $target
cat src/grammar/system.pegjs >> $target
cat src/grammar/memory.pegjs >> $target
cat src/grammar/io.pegjs >> $target
cat src/grammar/wifi.pegjs >> $target
cat src/grammar/i2c.pegjs >> $target
echo '`;' >> $target