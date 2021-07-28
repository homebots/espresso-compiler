import { CompilerPlugin } from '../compiler';
import { FindIdentifiersPlugin, ReplaceIdentifiersPlugin } from './identifiers.plugin';
import { FindLabelsPlugin, ReplaceLabelReferencesPlugin } from './references.plugin';
import { SerializePlugin } from './serialize.plugin';

export const defaultPlugins: CompilerPlugin[] = [
  new FindIdentifiersPlugin(),
  new SerializePlugin(),
  new FindLabelsPlugin(),
  new ReplaceLabelReferencesPlugin(),
  new ReplaceIdentifiersPlugin(),
];
