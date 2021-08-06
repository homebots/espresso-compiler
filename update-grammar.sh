grammarSpec=src/grammar.pegjs
grammarFile=src/compiler/parser.ts

echo '' > $grammarSpec
for file in `ls src/grammar/*.pegjs`; do
  echo 'Using' $file
  cat $file >> $grammarSpec
done

peggy --plugin ./node_modules/ts-pegjs/src/tspegjs --extra-options-file ./peg-config.json --allowed-start-rules Program -o $grammarFile --cache $grammarSpec
eslint --quiet $grammarFile --fix >> /dev/null
prettier -w $grammarFile