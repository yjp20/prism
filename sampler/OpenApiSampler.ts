import { GeneratorsRepository } from "./GeneratorsRepository";
import { IGenerator } from "./generators/IGenerator";

export class OpenApiSampler {

    
    constructor(private generatorsRepository: GeneratorsRepository) {}    

    public sample(schema: SchemaObject) {
        return this.generatorsRepository.getGenerator(schema).generate(schema);
    }
}