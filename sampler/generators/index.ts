import Chance from 'chance';
import { IGenerator } from './IGenerator';

const chance = new Chance();

export class FloatGenerator implements IGenerator {
    public generate(schema: SchemaObject) {
        return chance.floating();
    }
}

export class DoubleGenerator implements IGenerator {
    public generate(schema: SchemaObject) {
        return chance.floating();
    }
}

export class DefaultIntegerGenerator implements IGenerator {
    public generate(schema: SchemaObject) {
        return chance.integer();
    }
}

export class DefaultStringGenerator implements IGenerator {
    public generate(schema: SchemaObject) {
        return chance.string();
    }
}

export class DefaultBooleanGenerator implements IGenerator {
    public generate(schema: SchemaObject) {
        return chance.bool();
    }
}

export class DefaultNullGenerator implements IGenerator {
    public generate(schema: SchemaObject) {
        return null;
    }
}

export class DefaultFileGenerator implements IGenerator {
    public generate(schema: SchemaObject) {
        throw new Error('Unsupported');
    }
}

export { DefaultObjectGenerator } from './DefaultObjectGenerator';
export { DefaultArrayGenerator } from './DefaultArrayGenerator';