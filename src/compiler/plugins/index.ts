import { CompilerPlugin } from '../compiler';
import { CheckTypesPlugin } from './check-types.plugin';
import { FindIdentifiersPlugin, ReplaceIdentifiersPlugin } from './identifiers.plugin';
import { FindLabelsPlugin, ReplaceLabelReferencesPlugin } from './references.plugin';
import { SerializePlugin } from './serialize.plugin';

export const defaultPlugins: CompilerPlugin[] = [
  new FindIdentifiersPlugin(),
  new FindLabelsPlugin(),
  new CheckTypesPlugin(),
  new ReplaceLabelReferencesPlugin(),
  new ReplaceIdentifiersPlugin(),
  new SerializePlugin(),
];

export { CheckTypesPlugin, FindIdentifiersPlugin, FindLabelsPlugin, SerializePlugin };
