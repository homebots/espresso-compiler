export type ByteArray = Array<number>;

export interface Context {
  bytes: ByteArray;
}

export interface CompilerPlugin<OutputContext extends Context = Context, InputContext extends Context = Context> {
  run(context: InputContext): OutputContext;
}
