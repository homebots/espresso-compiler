import { CompilerPlugin } from '../compiler';
import { FindIdentifiersPlugin, ReplaceIdentifiersPlugin } from './identifiers.plugin';
import { ExtractReferencesPlugin, ReplacePlaceholdersPlugin } from './references.plugin';
import { SerializePlugin } from './serialize.plugin';

export const defaultPlugins: CompilerPlugin[] = [
  new FindIdentifiersPlugin(),
  new ExtractReferencesPlugin(),
  new SerializePlugin(),
  new ReplaceIdentifiersPlugin(),
  new ReplacePlaceholdersPlugin(),
];
