import { CompilerPlugin } from '../compiler';
import { CheckTypesPlugin } from './check-types.plugin';
import { FindIdentifiersPlugin, ReplaceIdentifiersPlugin } from './identifiers.plugin';
import { FindLabelsPlugin, ReplaceLabelReferencesPlugin } from './references.plugin';
import { SerializePlugin } from './serialize.plugin';

export const defaultPlugins: CompilerPlugin[] = [
  new FindIdentifiersPlugin(),
  new FindLabelsPlugin(),
  new ReplaceLabelReferencesPlugin(),
  new CheckTypesPlugin(),
  new SerializePlugin(),
  new ReplaceIdentifiersPlugin(),
];

export { CheckTypesPlugin, FindIdentifiersPlugin, FindLabelsPlugin, SerializePlugin };
