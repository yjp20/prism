import { DefaultIntegerGenerator, DoubleGenerator, FloatGenerator, DefaultStringGenerator, DefaultBooleanGenerator, DefaultNullGenerator, DefaultFileGenerator, DefaultObjectGenerator, DefaultArrayGenerator } from "./generators";
import { OpenApiSampler } from "./OpenApiSampler";
import { IGenerator } from "./generators/IGenerator";

export class GeneratorsRepository {

    private readonly generators: { [key: string]: { [key: string]: IGenerator } };

    constructor() {
        this.generators = {
            'number': {
                'float': new FloatGenerator(),
                'double': new DoubleGenerator()
            },
            'integer': {
                '': new DefaultIntegerGenerator()
            },
            'string': {
                '': new DefaultStringGenerator()
            },
            'boolean': {
                '': new DefaultBooleanGenerator()
            },
            'null': {
                '': new DefaultNullGenerator()
            },
            'file': {
                '': new DefaultFileGenerator()
            },
            'object': {
                '': new DefaultObjectGenerator(this)
            },
            'array': {
                '': new DefaultArrayGenerator(this)
            },
        };
    }

    public getGenerator(schema: SchemaObject): IGenerator {
        const { type, format } = schema;
        return this.generators[type][format];
    }

    public setGenerator(type: string, format: string, generator: IGenerator) {
        this.generators[type][format] = generator;
    }
}