import { CompilerPlugin } from '../compiler';
import { FindIdentifiersPlugin, ReplaceIdentifiersPlugin } from './identifiers.plugin';
import { ExtractReferencesPlugin } from './remove-references.plugin';
import { ReplacePlaceholdersPlugin } from './replace-placeholders.plugin';

export const defaultPlugins: CompilerPlugin[] = [
  new FindIdentifiersPlugin(),
  new ExtractReferencesPlugin(),
  new ReplaceIdentifiersPlugin(),
  new ReplacePlaceholdersPlugin(),
];
