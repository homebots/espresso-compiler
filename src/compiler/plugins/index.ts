import { CompilerPlugin } from '../compiler.js';
import { CheckTypesPlugin } from './check-types.plugin.js';
import { FindIdentifiersPlugin, ReplaceIdentifiersPlugin } from './identifiers.plugin.js';
import { FindLabelsPlugin, ReplaceLabelReferencesPlugin } from './references.plugin.js';
import { SerializePlugin } from './serialize.plugin.js';

export const defaultPlugins: CompilerPlugin[] = [
  new FindIdentifiersPlugin(),
  new FindLabelsPlugin(),
  new CheckTypesPlugin(),
  new ReplaceLabelReferencesPlugin(),
  new ReplaceIdentifiersPlugin(),
  new SerializePlugin(),
];

export { CheckTypesPlugin, FindIdentifiersPlugin, FindLabelsPlugin, SerializePlugin };
