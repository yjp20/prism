import { IGenerator } from "./IGenerator";
import { GeneratorsRepository } from "../GeneratorsRepository";
import { OpenApiSampler } from "../OpenApiSampler";

export class DefaultArrayGenerator implements IGenerator {
    constructor(private readonly generatorsRepository: GeneratorsRepository) {
    }

    public generate(schema: SchemaObject) {
        const items = schema.items;
        if(items && Array.isArray(schema.items)) {
            return (items as SchemaObject[]).map((item: SchemaObject) => {
                return OpenApiSampler.sample(item, this.generatorsRepository);
            });
        }
        throw new Error('Unsupported items type');
    }
}