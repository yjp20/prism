// @todo S is Schema interface (not defined yet)
export interface IExampleGenerator<S = any> {
  generate(schema: S, mediaType: string): Promise<string>;
}
