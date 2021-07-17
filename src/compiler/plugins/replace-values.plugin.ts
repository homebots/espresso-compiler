import { CompilerPlugin, Context } from '../plugins';
import { isValue, serializeValue } from '../values';

export class ReplaceValuesPlugin implements CompilerPlugin {
  run(context: Context): Context {
    const { bytes } = context;
    const output = [];

    for (let index = 0; index < bytes.length; ) {
      const node = bytes[index];

      if (isValue(node)) {
        const value = serializeValue(node);

        output.push(...value);
        index += value.length - 1;
        continue;
      }

      output.push(node);
      index++;
    }

    return { ...context, bytes: output };
  }
}
