import { IGenerator } from "./IGenerator";
import { GeneratorsRepository } from "../GeneratorsRepository";

export class DefaultObjectGenerator implements IGenerator {
    constructor(private readonly generatorsRepository: GeneratorsRepository) {  
    }

    public generate(schema: SchemaObject) {        
        const { properties } = schema;
        const result: any = {};
        if(properties) {            
            for(let property in properties) {
                const propSchema = properties[property];                
                result[property] = this.generatorsRepository.getGenerator(schema).generate(propSchema);
            }
        } 
        return result;
    }
}

