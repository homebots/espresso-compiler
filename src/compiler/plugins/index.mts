import { CompilerPlugin } from '../compiler.mjs';
import { CheckTypesPlugin } from './check-types.plugin.mjs';
import { FindIdentifiersPlugin, ReplaceIdentifiersPlugin } from './identifiers.plugin.mjs';
import { MapFunctionLocationsPlugin, AlignFunctionCallsPlugin } from './references.plugin.mjs';
import { SerializePlugin } from './serialize.plugin.mjs';

export const defaultPlugins: CompilerPlugin[] = [
  new FindIdentifiersPlugin(),
  new MapFunctionLocationsPlugin(),
  new CheckTypesPlugin(),
  new AlignFunctionCallsPlugin(),
  new ReplaceIdentifiersPlugin(),
  new SerializePlugin(),
];

export { CheckTypesPlugin, FindIdentifiersPlugin, MapFunctionLocationsPlugin as FindLabelsPlugin, SerializePlugin };
